'use strict';

/**
 * schemeMapper.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps a raw IBM AutoAI scheme-code prediction to a human-readable full name
 * and a formatted confidence string.
 *
 * The IBM AutoAI model trained on NSAP district-statistics data returns a
 * string scheme code (e.g. "IGNOAPS") as its predicted_label, NOT a binary
 * eligible/not-eligible flag.  This replaces the old applicant-profile rule
 * engine that is no longer applicable.
 *
 * Supported scheme codes
 * ──────────────────────
 *   IGNOAPS  → Indira Gandhi National Old Age Pension Scheme
 *   IGNWPS   → Indira Gandhi National Widow Pension Scheme
 *   IGNDPS   → Indira Gandhi National Disability Pension Scheme
 */

// ─── Scheme code → full name lookup ───────────────────────────────────────────

/**
 * Map of IBM AutoAI predicted scheme codes to their full official names.
 *
 * @type {Record<string, string>}
 */
const SCHEME_CODE_MAP = {
  IGNOAPS: 'Indira Gandhi National Old Age Pension Scheme',
  IGNWPS:  'Indira Gandhi National Widow Pension Scheme',
  IGNDPS:  'Indira Gandhi National Disability Pension Scheme',
};

// ─── Public helpers ────────────────────────────────────────────────────────────

/**
 * Returns the full official scheme name for a given IBM AutoAI scheme code.
 * Falls back to the raw code string if the code is not in the lookup table.
 *
 * @param {string} code - raw scheme code from IBM AutoAI (e.g. "IGNOAPS")
 * @returns {string} full scheme name
 */
function getSchemeFullName(code) {
  if (!code || typeof code !== 'string') return 'Unknown Scheme';
  const normalised = code.trim().toUpperCase();
  return SCHEME_CODE_MAP[normalised] ?? code.trim();
}

/**
 * Converts a raw AutoAI probability array to a formatted percentage string.
 *
 * For multi-class models the probability field is an array of per-class
 * probabilities.  We take the maximum value as the confidence of the
 * predicted class.
 *
 * @param {number | number[] | null | undefined} probability
 * @returns {string} e.g. "92.4%"
 */
function formatConfidence(probability) {
  let raw;

  if (Array.isArray(probability)) {
    raw = Math.max(...probability);
  } else if (typeof probability === 'number' && Number.isFinite(probability)) {
    raw = probability;
  } else {
    return 'N/A';
  }

  // Clamp to [0, 1] — some pipeline versions return values > 1 due to rounding
  raw = Math.min(1, Math.max(0, raw));
  return `${(raw * 100).toFixed(1)}%`;
}

module.exports = { getSchemeFullName, formatConfidence, SCHEME_CODE_MAP };
