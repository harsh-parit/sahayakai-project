'use strict';

/**
 * predictionController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles POST /api/predict.
 *
 * Responsibilities:
 *   1. Validate the incoming request body — fail fast with clear errors.
 *   2. Delegate to mlService.scoreWithAutoAI().
 *   3. Return a clean, consistent JSON response.
 *   4. Pass unexpected errors to the global error handler via next(err).
 */

const { scoreWithAutoAI }  = require('../services/mlService');
const { success, validationError, serviceUnavailable } = require('../utils/response');
const logger               = require('../utils/logger');

// ─── Validation schema ────────────────────────────────────────────────────────

/**
 * Required string fields — must be non-empty strings.
 * @type {string[]}
 */
const REQUIRED_STRING_FIELDS = [
  'applicant_name',
  'gender',
  'marital_status',
  'category',
  'occupation',
  'state',
  'district',
];

/**
 * Required boolean fields — must be true or false (not undefined/null).
 * @type {string[]}
 */
const REQUIRED_BOOLEAN_FIELDS = [
  'bpl_status',
  'disability_status',
  'widow_status',
  'aadhaar_available',
  'bank_account_available',
];

/**
 * Validates the request body for a prediction request.
 * Returns an object of field → error message; empty if valid.
 *
 * @param {object} body
 * @returns {Record<string, string>}
 */
function validatePredictionBody(body) {
  const errors = {};

  // ── age ───────────────────────────────────────────────────────────────────
  if (body.age === undefined || body.age === null || body.age === '') {
    errors.age = 'age is required.';
  } else {
    const age = Number(body.age);
    if (!Number.isFinite(age) || !Number.isInteger(age) || age < 1 || age > 120) {
      errors.age = 'age must be an integer between 1 and 120.';
    }
  }

  // ── annual_income ─────────────────────────────────────────────────────────
  if (body.annual_income === undefined || body.annual_income === null || body.annual_income === '') {
    errors.annual_income = 'annual_income is required.';
  } else {
    const income = Number(body.annual_income);
    if (!Number.isFinite(income) || income < 0) {
      errors.annual_income = 'annual_income must be a non-negative number.';
    }
  }

  // ── Required string fields ────────────────────────────────────────────────
  for (const field of REQUIRED_STRING_FIELDS) {
    if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
      errors[field] = `${field} is required and must be a non-empty string.`;
    }
  }

  // ── Required boolean fields ───────────────────────────────────────────────
  for (const field of REQUIRED_BOOLEAN_FIELDS) {
    if (body[field] === undefined || body[field] === null) {
      errors[field] = `${field} is required and must be true or false.`;
    } else if (typeof body[field] !== 'boolean') {
      errors[field] = `${field} must be a boolean (true or false).`;
    }
  }

  return errors;
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * predictEligibility — POST /api/predict
 *
 * @param {import('express').Request}    req
 * @param {import('express').Response}   res
 * @param {import('express').NextFunction} next
 */
const predictEligibility = async (req, res, next) => {
  const requestId = req.requestId ?? 'unknown';

  try {
    // ── 1. Validate ───────────────────────────────────────────────────────
    const validationErrors = validatePredictionBody(req.body);
    if (Object.keys(validationErrors).length > 0) {
      logger.warn('Prediction request rejected — validation errors.', {
        requestId,
        errors: validationErrors,
      });
      return validationError(
        res,
        'Request body validation failed. Please correct the highlighted fields.',
        validationErrors
      );
    }

    logger.info('Prediction request accepted — forwarding to IBM AutoAI.', {
      requestId,
      applicant: req.body.applicant_name,
      state:     req.body.state,
    });

    // ── 2. Score ──────────────────────────────────────────────────────────
    const prediction = await scoreWithAutoAI(req.body);

    logger.info('Prediction completed.', {
      requestId,
      eligible:   prediction.eligible,
      confidence: prediction.confidence,
    });

    // ── 3. Respond ────────────────────────────────────────────────────────
    return success(res, prediction, 'prediction');

  } catch (err) {
    // Differentiate IBM service errors from unexpected errors
    const isServiceError = err.message.includes('IBM');

    if (isServiceError) {
      logger.error('IBM AutoAI service error during prediction.', {
        requestId,
        message: err.message,
      });
      return serviceUnavailable(res, err.message);
    }

    // Unexpected — delegate to the global error handler
    next(err);
  }
};

module.exports = { predictEligibility };
