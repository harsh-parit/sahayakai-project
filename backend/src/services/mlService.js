'use strict';

/**
 * mlService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * IBM AutoAI scoring client.
 *
 * Responsibilities
 * ────────────────
 *   1. Obtain a valid IBM IAM bearer token via authService (cached,
 *      auto-refreshed — no per-request IAM round-trips).
 *   2. Construct a Watson ML scoring payload from the validated request body.
 *   3. POST to the IBM AutoAI deployment endpoint (IBM_DEPLOYMENT_ENDPOINT).
 *   4. Parse the raw Watson ML response into a clean { scheme, confidence, raw }
 *      object via schemeMapper.
 *   5. On HTTP 401, invalidate the token cache and retry ONCE automatically.
 *   6. Classify and re-throw all IBM API errors with descriptive messages so
 *      the controller can return the correct HTTP status code.
 *
 * IBM Watson ML Scoring Request Format
 * ─────────────────────────────────────
 *   POST <IBM_DEPLOYMENT_ENDPOINT>
 *   Authorization: Bearer <iam_token>
 *   Content-Type: application/json
 *
 *   {
 *     "input_data": [{
 *       "fields": ["age", "gender", …],
 *       "values": [[35, "male", …]]
 *     }]
 *   }
 *
 * IBM Watson ML Scoring Response Format
 * ──────────────────────────────────────
 *   {
 *     "predictions": [{
 *       "fields": ["prediction", "probability"],
 *       "values": [[1, [0.08, 0.92]]]
 *     }]
 *   }
 *
 *   prediction  — integer 1 (eligible) or 0 (not eligible)
 *   probability — [prob_class_0, prob_class_1]
 */

const axios  = require('axios');
const env    = require('../config/env');
const logger = require('../utils/logger');
const { getSchemeFullName, formatConfidence } = require('../utils/schemeMapper');
const { getAccessToken, invalidateToken } = require('./authService');

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum time to wait for AutoAI scoring (ms). */
const ML_TIMEOUT_MS = 30_000;

/**
 * Ordered list of feature names sent to the IBM AutoAI deployment.
 *
 * IMPORTANT: this order must exactly match the column order used when the
 * AutoAI pipeline was trained.  If the training schema changes, update this
 * list and re-deploy the backend.
 */
const AUTOAI_FIELDS = [
  'finyear',
  'lgdstatecode',
  'statename',
  'lgddistrictcode',
  'districtname',
  'totalbeneficiaries',
  'totalmale',
  'totalfemale',
  'totaltransgender',
  'totalsc',
  'totalst',
  'totalgen',
  'totalobc',
  'totalaadhaar',
  'totalmpbilenumber'
];

// ─── Payload builder ──────────────────────────────────────────────────────────

/**
 * Converts the flat, validated request body into the Watson ML scoring payload.
 *
 * Fields not present in the body are sent as null so the model can apply
 * its own imputation strategy rather than crashing.
 *
 * @param {object} body - validated flat request body from predictionController
 * @returns {{ input_data: Array<{ fields: string[], values: Array<any[]> }> }}
 */
function buildScoringPayload(body) {
  const values = AUTOAI_FIELDS.map((field) => {
    const v = body[field];
    return v !== undefined && v !== null && v !== '' ? v : null;
  });

  return {
    input_data: [
      {
        fields: AUTOAI_FIELDS,
        values: [values],
      },
    ],
  };
}

// ─── Response parser ──────────────────────────────────────────────────────────

/**
 * Extracts the scheme code prediction and probability from the raw Watson ML
 * response, then maps the code to a full scheme name via schemeMapper.
 *
 * The IBM AutoAI model trained on NSAP district-statistics data returns a
 * string scheme code as its prediction (e.g. "IGNOAPS", "IGNWPS", "IGNDPS"),
 * NOT a binary 0/1 flag.
 *
 * Expected raw shape:
 *   {
 *     "predictions": [{
 *       "fields": ["prediction", "probability"],
 *       "values": [["IGNOAPS", [0.05, 0.91, 0.04]]]
 *     }]
 *   }
 *
 * Handles two known AutoAI field name variants:
 *   - "prediction"     (AutoAI default)
 *   - "predicted_label" (some pipeline versions)
 *
 * @param {object} rawResponse - axios response.data from IBM AutoAI
 * @returns {{ schemeCode: string, schemeName: string, confidence: string, raw: object }}
 * @throws {Error} if the response structure is unrecognised
 */
function parseAutoAIResponse(rawResponse) {
  const predictions = rawResponse?.predictions;

  if (!Array.isArray(predictions) || predictions.length === 0) {
    throw new Error(
      'IBM AutoAI returned an unrecognised response structure ' +
      '(missing "predictions" array).'
    );
  }

  const result = predictions[0];
  const fields = Array.isArray(result.fields) ? result.fields : [];
  const values = Array.isArray(result.values?.[0]) ? result.values[0] : [];

  if (fields.length === 0 || values.length === 0) {
    throw new Error(
      'IBM AutoAI predictions[0] contains empty "fields" or "values".'
    );
  }

  // Support both "prediction" (AutoAI default) and "predicted_label" variants
  const predField = fields.includes('prediction') ? 'prediction' : 'predicted_label';
  const probField = fields.includes('probability') ? 'probability' : 'probabilities';

  const predIndex = fields.indexOf(predField);
  const probIndex = fields.indexOf(probField);

  if (predIndex === -1) {
    throw new Error(
      `IBM AutoAI response missing expected field "${predField}". ` +
      `Available fields: ${fields.join(', ')}`
    );
  }

  const rawPrediction  = values[predIndex];   // e.g. "IGNOAPS"
  const rawProbability = probIndex !== -1 ? values[probIndex] : null;

  // The model returns a scheme code string — convert to string defensively
  const schemeCode = String(rawPrediction ?? '').trim();
  const schemeName = getSchemeFullName(schemeCode);
  const confidence = formatConfidence(rawProbability);

  logger.debug('Parsed AutoAI response.', {
    schemeCode,
    schemeName,
    confidence,
    rawProbability,
  });

  return { schemeCode, schemeName, confidence, raw: rawResponse };
}

// ─── HTTP request helper ──────────────────────────────────────────────────────

/**
 * Builds the Axios config object for a Watson ML scoring POST request.
 *
 * @param {string} token         - valid IBM IAM bearer token (no "Bearer " prefix)
 * @param {object} scoringPayload - Watson ML input_data payload
 * @returns {import('axios').AxiosRequestConfig}
 */
function buildAxiosConfig(token, scoringPayload) {
  return {
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
      // IBM Watson ML requires the project/space ID for some deployment types
      ...(env.ibmProjectId && { 'IBM-Project-Id': env.ibmProjectId }),
    },
    timeout: ML_TIMEOUT_MS,
    data:    scoringPayload,
  };
}

// ─── IBM error classifier ─────────────────────────────────────────────────────

/**
 * Converts an Axios error from an IBM endpoint into a human-readable
 * Error with a `statusCode` property so the controller can map it to
 * the correct HTTP response.
 *
 * @param {import('axios').AxiosError} err
 * @returns {Error & { statusCode: number, code: string }}
 */
function classifyIBMError(err) {
  const httpStatus = err?.response?.status;
  const ibmMessage =
    err?.response?.data?.errors?.[0]?.message ??
    err?.response?.data?.message ??
    err.message;

  let message;
  let statusCode;
  let code;

  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    message    = `IBM AutoAI scoring timed out after ${ML_TIMEOUT_MS / 1000}s. Please try again.`;
    statusCode = 504;
    code       = 'IBM_TIMEOUT';
  } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    message    = 'Cannot reach IBM AutoAI endpoint. Check IBM_DEPLOYMENT_ENDPOINT in .env.';
    statusCode = 502;
    code       = 'IBM_UNREACHABLE';
  } else if (httpStatus === 401 || httpStatus === 403) {
    message    = 'IBM Cloud authentication failed. Verify IBM_API_KEY in .env.';
    statusCode = 502;
    code       = 'IBM_AUTH_ERROR';
  } else if (httpStatus === 429) {
    message    = 'IBM AutoAI rate limit exceeded. Please wait before retrying.';
    statusCode = 429;
    code       = 'IBM_RATE_LIMIT';
  } else if (httpStatus === 404) {
    message    = 'IBM AutoAI deployment not found. Verify IBM_DEPLOYMENT_ENDPOINT in .env.';
    statusCode = 502;
    code       = 'IBM_NOT_FOUND';
  } else if (httpStatus >= 500) {
    message    = `IBM AutoAI service error (HTTP ${httpStatus}): ${ibmMessage}`;
    statusCode = 502;
    code       = 'IBM_SERVER_ERROR';
  } else {
    message    = `IBM AutoAI request failed (HTTP ${httpStatus ?? 'N/A'}): ${ibmMessage}`;
    statusCode = 502;
    code       = 'IBM_REQUEST_ERROR';
  }

  const classified  = new Error(message);
  classified.statusCode = statusCode;
  classified.code       = code;
  classified.isIBMError = true;
  return classified;
}

// ─── Core scoring function ────────────────────────────────────────────────────

/**
 * scoreWithAutoAI
 * ───────────────
 * Calls the IBM AutoAI deployment endpoint and returns a structured result.
 *
 * Retry strategy:
 *   On HTTP 401 the IAM cache is invalidated and the request is retried ONCE
 *   with a fresh token.  All other errors surface immediately.
 *
 * @param {object} requestBody - validated flat payload from predictionController
 * @returns {Promise<{ scheme: string, confidence: string, eligible: boolean, raw: object }>}
 * @throws {Error & { statusCode: number, code: string, isIBMError: boolean }}
 *         Always throws a classified error — never swallows failures silently.
 */
async function scoreWithAutoAI(requestBody) {
  const scoringPayload = buildScoringPayload(requestBody);

  logger.info('Sending scoring request to IBM AutoAI.', {
    endpoint:   env.ibmDeploymentEndpoint,
    applicant:  requestBody.applicant_name,
    fieldCount: AUTOAI_FIELDS.length,
  });

  // ── 1. Obtain IAM token (cached) ─────────────────────────────────────────
  let token;
  try {
    token = await getAccessToken();
  } catch (authErr) {
    logger.error('IAM authentication failed before scoring.', {
      message: authErr.message,
    });
    const err = new Error(`IBM IAM authentication failed: ${authErr.message}`);
    err.statusCode = 502;
    err.code       = 'IBM_AUTH_ERROR';
    err.isIBMError = true;
    throw err;
  }

  // ── 2. First scoring attempt ──────────────────────────────────────────────
  try {
    const response = await axios.post(
      env.ibmDeploymentEndpoint,
      scoringPayload,
      buildAxiosConfig(token, scoringPayload)
    );

    logger.info('IBM AutoAI scoring succeeded.', {
      httpStatus: response.status,
    });

    return parseAutoAIResponse(response.data);

  } catch (err) {
    // ── 401 → invalidate token cache and retry once ───────────────────────
    if (err?.response?.status === 401) {
      logger.warn(
        'IBM AutoAI returned HTTP 401 — invalidating IAM cache and retrying with fresh token.'
      );
      invalidateToken();

      let freshToken;
      try {
        freshToken = await getAccessToken();
      } catch (retryAuthErr) {
        logger.error('Re-authentication after 401 also failed.', {
          message: retryAuthErr.message,
        });
        throw classifyIBMError(err); // surface the original 401 error
      }

      try {
        const retryResponse = await axios.post(
          env.ibmDeploymentEndpoint,
          scoringPayload,
          buildAxiosConfig(freshToken, scoringPayload)
        );

        logger.info('IBM AutoAI retry after 401 succeeded.', {
          httpStatus: retryResponse.status,
        });

        return parseAutoAIResponse(retryResponse.data);

      } catch (retryErr) {
        logger.error('IBM AutoAI retry also failed.', {
          status:  retryErr?.response?.status,
          message: retryErr.message,
        });
        throw classifyIBMError(retryErr);
      }
    }

    // ── All other Axios / network errors ─────────────────────────────────
    logger.error('IBM AutoAI scoring request failed.', {
      code:    err.code,
      status:  err?.response?.status,
      message: err.message,
    });
    throw classifyIBMError(err);
  }
}

module.exports = { scoreWithAutoAI };
