/**
 * mlService.js — IBM AutoAI prediction service layer.
 *
 * Architecture:
 *   GovernmentStatsForm  →  predictEligibility(formData)
 *                        →  POST /api/predict  (Express backend)
 *                        →  IBM AutoAI deployment endpoint
 *
 * The frontend NEVER calls IBM AutoAI directly.
 * All IBM credentials live exclusively in backend/.env.
 *
 * AutoAI model input fields:
 *   finyear, lgdstatecode, statename, lgddistrictcode, districtname,
 *   totalbeneficiaries, totalmale, totalfemale, totaltransgender,
 *   totalsc, totalst, totalgen, totalobc, totalaadhaar, totalmpbilenumber
 */

import axios from 'axios';

// Base URL — set VITE_API_BASE_URL=http://localhost:5000 in frontend/.env
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Shared axios instance for the Express backend
const mlClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Response interceptor — normalise error messages ─────────────────────────
mlClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── Payload builder ──────────────────────────────────────────────────────────
/**
 * Transforms the raw form state from GovernmentStatsForm into the flat
 * payload structure the Express backend (and therefore IBM AutoAI) expects.
 *
 * All numeric fields are coerced to Number so the backend validator accepts
 * them as numerics rather than strings.
 *
 * @param {import('../components/prediction/EligibilityForm').FormState} formData
 * @returns {AutoAIPayload}
 */
export function buildPredictionPayload(formData) {
  return {
    finyear:              formData.finyear.trim(),
    lgdstatecode:         Number(formData.lgdstatecode),
    statename:            formData.statename.trim(),
    lgddistrictcode:      Number(formData.lgddistrictcode),
    districtname:         formData.districtname.trim(),
    totalbeneficiaries:   Number(formData.totalbeneficiaries),
    totalmale:            Number(formData.totalmale),
    totalfemale:          Number(formData.totalfemale),
    totaltransgender:     Number(formData.totaltransgender),
    totalsc:              Number(formData.totalsc),
    totalst:              Number(formData.totalst),
    totalgen:             Number(formData.totalgen),
    totalobc:             Number(formData.totalobc),
    totalaadhaar:         Number(formData.totalaadhaar),
    totalmpbilenumber:    Number(formData.totalmpbilenumber),
  };
}

// ─── Primary prediction call ──────────────────────────────────────────────────
/**
 * Submits government statistics to the Express backend for IBM AutoAI scoring.
 *
 * Returns the full backend response envelope:
 *   { success: true, prediction: { scheme, confidence, eligible, raw }, timestamp }
 *
 * @param {object} formData - validated raw form state from GovernmentStatsForm
 * @returns {Promise<{ success: boolean, prediction: PredictionResult, timestamp: string }>}
 */
export async function predictEligibility(formData) {
  const payload = buildPredictionPayload(formData);
  const response = await mlClient.post('/api/predict', payload);
  return response.data;
}
