'use strict';

/**
 * predictionController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles POST /api/predict.
 *
 * Request → Validate → scoreWithAutoAI() → Respond
 *
 * Success response shape:
 *   {
 *     "success": true,
 *     "prediction": {
 *       "schemeCode": "IGNOAPS",
 *       "schemeName": "Indira Gandhi National Old Age Pension Scheme",
 *       "confidence": "92.4%",
 *       "raw":        { …watson ml raw response… }
 *     },
 *     "timestamp": "ISO-8601"
 *   }
 *
 * Failure response shape:
 *   HTTP 400 — validation error
 *   {
 *     "success": false,
 *     "message": "Request body validation failed.",
 *     "error":   "VALIDATION_ERROR",
 *     "details": { field: "error message", … },
 *     "timestamp": "ISO-8601"
 *   }
 *
 *   HTTP 500 / 502 / 503 / 504 — IBM service error
 *   {
 *     "success": false,
 *     "message": "Human-readable description.",
 *     "error":   "IBM_AUTH_ERROR | IBM_TIMEOUT | IBM_UNREACHABLE | …",
 *     "timestamp": "ISO-8601"
 *   }
 */

const { scoreWithAutoAI }  = require('../services/mlService');
const { success, validationError, error: sendError } = require('../utils/response');
const logger               = require('../utils/logger');

// ─── Validation rules ─────────────────────────────────────────────────────────

/**
 * String fields sent by the frontend that must be present and non-empty.
 * These match the IBM AutoAI model's expected input schema.
 */
const REQUIRED_STRING_FIELDS = [
  'finyear',
  'statename',
  'districtname',
];

/**
 * Numeric fields that must be present and be non-negative finite numbers.
 * Codes (lgdstatecode, lgddistrictcode) must additionally be positive integers.
 */
const REQUIRED_NUMERIC_FIELDS = [
  'lgdstatecode',
  'lgddistrictcode',
  'totalbeneficiaries',
  'totalmale',
  'totalfemale',
  'totaltransgender',
  'totalsc',
  'totalst',
  'totalgen',
  'totalobc',
  'totalaadhaar',
  'totalmpbilenumber',
];

/**
 * Validates every field of the AutoAI prediction request body.
 *
 * Designed to be a pure function — no side effects, easy to unit-test.
 *
 * @param {object} body - raw req.body
 * @returns {Record<string, string>} Map of { fieldName: errorMessage }.
 *                                   Empty object means the body is valid.
 */
function validatePredictionBody(body) {
  const errors = {};

  // Guard: body must be a plain object
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    errors._body = 'Request body must be a JSON object.';
    return errors;
  }

  // ── Required string fields ────────────────────────────────────────────────
  for (const field of REQUIRED_STRING_FIELDS) {
    const value = body[field];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      errors[field] = `${field} is required and must be a non-empty string.`;
    }
  }

  // ── Required numeric fields ───────────────────────────────────────────────
  for (const field of REQUIRED_NUMERIC_FIELDS) {
    const value = body[field];
    if (value === undefined || value === null || value === '') {
      errors[field] = `${field} is required.`;
    } else {
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0) {
        errors[field] = `${field} must be a non-negative number.`;
      }
    }
  }

  return errors;
}

// ─── IBM error → HTTP status mapper ──────────────────────────────────────────

/**
 * Maps the classified IBM error codes produced by mlService onto Express
 * HTTP status codes and response error codes.
 *
 * @param {Error & { statusCode?: number, code?: string, isIBMError?: boolean }} err
 * @returns {{ httpStatus: number, errorCode: string }}
 */
function mapIBMErrorToResponse(err) {
  const httpStatus = err.statusCode ?? 500;
  const errorCode  = err.code ?? 'IBM_SERVICE_ERROR';
  return { httpStatus, errorCode };
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * predictEligibility — POST /api/predict
 *
 * All IBM-related errors are caught here and returned as structured JSON
 * with the appropriate HTTP status code so the frontend can surface
 * meaningful error messages.
 *
 * Unexpected (non-IBM) errors are passed to the global error handler via
 * next(err) so they appear in logs with a full stack trace.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const predictEligibility = async (req, res, next) => {
  const requestId = req.requestId ?? 'unknown';

  // ── 1. Log incoming request ────────────────────────────────────────────────
  logger.info('POST /api/predict — incoming prediction request.', {
    requestId,
    ip:        req.ip,
    bodyKeys:  Object.keys(req.body ?? {}).join(', '),
  });

  try {
    // ── 2. Validate request body ───────────────────────────────────────────
    const validationErrors = validatePredictionBody(req.body);

    if (Object.keys(validationErrors).length > 0) {
      logger.warn('Prediction request rejected — validation failed.', {
        requestId,
        errorCount: Object.keys(validationErrors).length,
        errors:     validationErrors,
      });

      return validationError(
        res,
        'Request body validation failed. Please correct the highlighted fields.',
        validationErrors
      );
    }

    logger.info('Validation passed — forwarding to IBM AutoAI.', {
      requestId,
      district: req.body.districtname,
      state:    req.body.statename,
      finyear:  req.body.finyear,
    });

    // ── 3. Call IBM AutoAI via mlService ───────────────────────────────────
    const prediction = await scoreWithAutoAI(req.body);

    // ── 4. Log success ─────────────────────────────────────────────────────
    logger.info('Prediction completed successfully.', {
      requestId,
      schemeCode: prediction.schemeCode,
      schemeName: prediction.schemeName,
      confidence: prediction.confidence,
    });

    // ── 5. Return structured success response ──────────────────────────────
    // Response shape: { success, prediction: { scheme, confidence, eligible, raw }, timestamp }
    return success(res, prediction, 'prediction');

  } catch (err) {
    // ── IBM service errors (classified by mlService) ───────────────────────
    if (err.isIBMError) {
      const { httpStatus, errorCode } = mapIBMErrorToResponse(err);

      logger.error('IBM AutoAI service error.', {
        requestId,
        errorCode,
        httpStatus,
        message: err.message,
      });

      return sendError(res, err.message, errorCode, httpStatus);
    }

    // ── Parse error from IBM response body ────────────────────────────────
    if (err.message.startsWith('IBM AutoAI returned')) {
      logger.error('IBM AutoAI response parse error.', {
        requestId,
        message: err.message,
      });

      return sendError(
        res,
        'IBM AutoAI returned an unexpected response. Please try again.',
        'IBM_PARSE_ERROR',
        500
      );
    }

    // ── Unexpected error — delegate to global error handler ───────────────
    logger.error('Unexpected error during prediction.', {
      requestId,
      message: err.message,
      stack:   err.stack,
    });

    next(err);
  }
};

module.exports = { predictEligibility };
