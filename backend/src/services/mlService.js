'use strict';

/**
 * mlService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * IBM AutoAI scoring client.
 *
 * Responsibilities:
 *   1. Obtain a valid IBM IAM token via authService (cached, auto-refreshed).
 *   2. Transform the validated request payload into the Watson ML scoring format.
 *   3. POST to the IBM AutoAI deployment endpoint.
 *   4. Parse and return the prediction response.
 *   5. Handle token expiry (401 → invalidate cache → retry once).
 *   6. Enforce a configurable request timeout.
 *
 * IBM Watson ML Scoring Payload Format:
 *   {
 *     "input_data": [{
 *       "fields": ["field1", "field2", …],
 *       "values": [[value1, value2, …]]
 *     }]
 *   }
 */

const axios              = require('axios');
const env                = require('../config/env');
const logger             = require('../utils/logger');
const { getAccessToken, invalidateToken } = require('./authService');

// Request timeout for AutoAI scoring calls (30 seconds)
const ML_TIMEOUT_MS = 30_000;

// ─── Field ordering ───────────────────────────────────────────────────────────
// The field order must match exactly what the AutoAI pipeline was trained on.
// Update this list if the training schema changes.
const AUTOAI_FIELDS = [
  'applicant_name',
  'age',
  'gender',
  'marital_status',
  'category',
  'occupation',
  'state',
  'district',
  'annual_income',
  'bpl_status',
  'disability_status',
  'widow_status',
  'aadhaar_available',
  'bank_account_available',
];

// ─── Payload builder ──────────────────────────────────────────────────────────

/**
 * Converts the flat request body into the nested Watson ML input_data format.
 *
 * @param {object} body - validated request body from predictionController
 * @returns {{ input_data: Array<{ fields: string[], values: Array<any[]> }> }}
 */
function buildScoringPayload(body) {
  const values = AUTOAI_FIELDS.map((field) => body[field] ?? null);

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
 * Extracts structured prediction data from the raw Watson ML response.
 *
 * Watson ML returns:
 * {
 *   "predictions": [{
 *     "fields": ["prediction", "probability"],
 *     "values": [[1, [0.08, 0.92]]]
 *   }]
 * }
 *
 * @param {object} rawResponse - axios response.data
 * @returns {{ eligible: boolean, confidence: number, raw: object }}
 */
function parseAutoAIResponse(rawResponse) {
  const predictions = rawResponse?.predictions;

  if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
    throw new Error('Unexpected response structure from IBM AutoAI endpoint.');
  }

  const result   = predictions[0];
  const fields   = result.fields ?? [];
  const values   = result.values?.[0] ?? [];

  const predIndex  = fields.indexOf('prediction');
  const probIndex  = fields.indexOf('probability');

  const prediction  = predIndex  !== -1 ? values[predIndex]  : null;
  const probability = probIndex !== -1 ? values[probIndex] : null;

  // prediction: 1 = eligible, 0 = not eligible
  const eligible   = prediction === 1 || prediction === '1' || prediction === true;
  // probability is typically [prob_class_0, prob_class_1]
  const confidence = Array.isArray(probability)
    ? Math.max(...probability)
    : (typeof probability === 'number' ? probability : null);

  return { eligible, confidence, raw: rawResponse };
}

// ─── Core scoring function ────────────────────────────────────────────────────

/**
 * Calls the IBM AutoAI deployment endpoint and returns a structured result.
 *
 * Retries once on 401 (token expiry) by invalidating the IAM cache and
 * re-authenticating before giving up.
 *
 * @param {object} requestBody - validated flat payload from predictionController
 * @returns {Promise<{ eligible: boolean, confidence: number, raw: object }>}
 * @throws {Error} on non-retryable failures or if retry also fails
 */
async function scoreWithAutoAI(requestBody) {
  const scoringPayload = buildScoringPayload(requestBody);

  logger.info('Sending scoring request to IBM AutoAI.', {
    endpoint: env.ibmDeploymentEndpoint,
    fields:   AUTOAI_FIELDS.length,
  });

  // ── Attempt 1 ──────────────────────────────────────────────────────────────
  let token;
  try {
    token = await getAccessToken();
  } catch (authErr) {
    throw new Error(`Authentication failed before scoring: ${authErr.message}`);
  }

  try {
    const response = await axios.post(
      env.ibmDeploymentEndpoint,
      scoringPayload,
      {
        headers: {
          Authorization:  `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept:         'application/json',
          ...(env.ibmProjectId && { 'IBM-Project-Id': env.ibmProjectId }),
        },
        timeout: ML_TIMEOUT_MS,
      }
    );

    logger.info('IBM AutoAI scoring completed successfully.', {
      status: response.status,
    });

    return parseAutoAIResponse(response.data);

  } catch (err) {
    // ── 401 — token might have just expired; invalidate and retry once ───────
    if (err?.response?.status === 401) {
      logger.warn('IBM AutoAI returned 401 — invalidating token cache and retrying.');
      invalidateToken();

      const freshToken = await getAccessToken();

      const retryResponse = await axios.post(
        env.ibmDeploymentEndpoint,
        scoringPayload,
        {
          headers: {
            Authorization:  `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
            Accept:         'application/json',
            ...(env.ibmProjectId && { 'IBM-Project-Id': env.ibmProjectId }),
          },
          timeout: ML_TIMEOUT_MS,
        }
      );

      logger.info('IBM AutoAI retry succeeded.', { status: retryResponse.status });
      return parseAutoAIResponse(retryResponse.data);
    }

    // ── Timeout ───────────────────────────────────────────────────────────────
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      logger.error('IBM AutoAI request timed out.', { timeout: ML_TIMEOUT_MS });
      throw new Error('IBM AutoAI scoring endpoint timed out. Please try again.');
    }

    // ── Other HTTP error ──────────────────────────────────────────────────────
    const status  = err?.response?.status;
    const detail  = err?.response?.data?.errors?.[0]?.message ?? err.message;
    logger.error('IBM AutoAI scoring request failed.', { status, detail });
    throw new Error(`IBM AutoAI error (HTTP ${status ?? 'N/A'}): ${detail}`);
  }
}

module.exports = { scoreWithAutoAI };
