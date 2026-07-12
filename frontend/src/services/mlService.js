/**
 * mlService.js — IBM AutoAI / Watsonx.ai prediction service layer.
 *
 * Architecture:
 *   EligibilityForm  →  predictEligibility(payload)  →  IBM AutoAI endpoint
 *                                                     →  Watsonx.ai explanation endpoint
 *
 * This module is intentionally a clean interface stub. All functions are
 * exported and typed, ready for real IBM Cloud / Watson ML endpoint wiring
 * when the backend is available.
 *
 * No mock data, no fake responses — callers must handle the pending state.
 */

import axios from 'axios';

// Base URL is set via environment variable — injected at build time by Vite.
// Set VITE_API_BASE_URL in your .env file to point to the deployed Flask backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// Shared axios instance with sensible defaults for the ML backend.
const mlClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000, // 30 s — AutoAI scoring can take a moment
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor — attach IBM IAM token when available ────────────────
mlClient.interceptors.request.use((config) => {
  const iamToken = sessionStorage.getItem('ibm_iam_token');
  if (iamToken) {
    config.headers.Authorization = `Bearer ${iamToken}`;
  }
  return config;
});

// ─── Response interceptor — normalise error shape ─────────────────────────────
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
 * Transforms the raw form state object produced by EligibilityForm into the
 * normalised payload structure expected by the IBM AutoAI scoring endpoint.
 *
 * @param {import('../components/prediction/EligibilityForm').FormState} formData
 * @returns {PredictionPayload}
 */
export function buildPredictionPayload(formData) {
  return {
    applicant_name:       formData.applicantName.trim(),
    age:                  Number(formData.age),
    gender:               formData.gender,
    marital_status:       formData.maritalStatus,
    category:             formData.category,
    occupation:           formData.occupation,
    state:                formData.state,
    district:             formData.district.trim(),
    annual_income:        Number(formData.annualIncome),
    bpl_status:           formData.bplStatus === 'yes',
    disability_status:    formData.disabilityStatus === 'yes',
    widow_status:         formData.widowStatus === 'yes',
    aadhaar_available:    formData.aadhaarAvailable === 'yes',
    bank_account_available: formData.bankAccountAvailable === 'yes',
  };
}

// ─── Primary prediction call ──────────────────────────────────────────────────
/**
 * Sends applicant data to the IBM AutoAI scoring endpoint and returns
 * the raw eligibility prediction response.
 *
 * The function is intentionally un-implemented — the POST target
 * `/api/predict` will be served by the Flask + Watson ML backend.
 *
 * @param {import('../components/prediction/EligibilityForm').FormState} formData
 * @returns {Promise<PredictionResponse>}
 */
export async function predictEligibility(formData) {
  const payload = buildPredictionPayload(formData);
  const response = await mlClient.post('/api/predict', payload);
  return response.data;
}

// ─── Explanation call (Watsonx.ai) ────────────────────────────────────────────
/**
 * Requests a plain-language explanation from the Watsonx.ai endpoint for
 * a given prediction result.
 *
 * @param {string} predictionId  — UUID returned by predictEligibility()
 * @returns {Promise<ExplanationResponse>}
 */
export async function fetchExplanation(predictionId) {
  const response = await mlClient.get(`/api/explain/${predictionId}`);
  return response.data;
}

// ─── Type documentation (JSDoc) ───────────────────────────────────────────────
/**
 * @typedef {Object} PredictionPayload
 * @property {string}  applicant_name
 * @property {number}  age
 * @property {string}  gender
 * @property {string}  marital_status
 * @property {string}  category
 * @property {string}  occupation
 * @property {string}  state
 * @property {string}  district
 * @property {number}  annual_income
 * @property {boolean} bpl_status
 * @property {boolean} disability_status
 * @property {boolean} widow_status
 * @property {boolean} aadhaar_available
 * @property {boolean} bank_account_available
 */

/**
 * @typedef {Object} PredictionResponse
 * @property {string}  prediction_id      — UUID for this result
 * @property {boolean} eligible           — AutoAI binary classification
 * @property {number}  confidence         — 0–1 confidence score
 * @property {string[]} eligible_schemes  — list of qualifying scheme names
 */

/**
 * @typedef {Object} ExplanationResponse
 * @property {string} explanation   — Watsonx.ai plain-language decision rationale
 * @property {Array<{feature: string, impact: number}>} feature_impacts
 */
