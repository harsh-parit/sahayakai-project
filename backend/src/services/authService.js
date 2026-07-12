'use strict';

/**
 * authService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * IBM Cloud IAM token manager.
 *
 * Responsibilities:
 *   1. Request a bearer token from the IBM IAM endpoint using the API key.
 *   2. Cache the token in memory so every ML prediction call does not incur
 *      an extra IAM round-trip (tokens are valid for 60 minutes by default).
 *   3. Proactively refresh the token 5 minutes (300 seconds) before expiry.
 *
 * Usage:
 *   const { getAccessToken } = require('./authService');
 *   const token = await getAccessToken();
 *   // → "Bearer <token>"
 *
 * Thread-safety note:
 *   Node.js is single-threaded, so in-memory state between requests is safe.
 *   For multi-process / clustered deployments consider Redis as a token store.
 */

const axios = require('axios');
const env   = require('../config/env');
const logger = require('../utils/logger');

// ─── Token cache ──────────────────────────────────────────────────────────────

/**
 * @typedef {Object} TokenCache
 * @property {string} accessToken   - raw bearer token string
 * @property {number} expiresAt     - Unix epoch (ms) when the token expires
 */

/** @type {TokenCache | null} */
let _tokenCache = null;

// How many milliseconds before expiry we proactively refresh (5 minutes)
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

// Request timeout for IAM calls (10 seconds)
const IAM_TIMEOUT_MS = 10_000;

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Returns true when the cached token is still valid (not approaching expiry).
 *
 * @returns {boolean}
 */
function _isCacheValid() {
  if (!_tokenCache) return false;
  return Date.now() < _tokenCache.expiresAt - REFRESH_BUFFER_MS;
}

/**
 * Fetches a fresh IAM bearer token from IBM Cloud.
 *
 * POST https://iam.cloud.ibm.com/identity/token
 * Body: grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=<API_KEY>
 *
 * @returns {Promise<TokenCache>}
 * @throws {Error} if the IAM request fails
 */
async function _fetchNewToken() {
  logger.info('Requesting new IBM IAM access token…');

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  params.append('apikey', env.ibmApiKey);

  const response = await axios.post(env.ibmIamTokenUrl, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: IAM_TIMEOUT_MS,
  });

  const { access_token, expires_in } = response.data;

  if (!access_token) {
    throw new Error('IBM IAM response did not contain an access_token.');
  }

  const expiresAt = Date.now() + (expires_in ?? 3600) * 1000;

  logger.info('IBM IAM token obtained successfully.', {
    expiresIn: `${expires_in ?? 3600}s`,
    refreshesAt: new Date(expiresAt - REFRESH_BUFFER_MS).toISOString(),
  });

  return { accessToken: access_token, expiresAt };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a valid IBM IAM access token, fetching a new one if necessary.
 *
 * This is the only function other modules should call. It handles caching,
 * expiry detection, and refreshing transparently.
 *
 * @returns {Promise<string>} The raw access token (no "Bearer " prefix).
 */
async function getAccessToken() {
  if (_isCacheValid()) {
    logger.debug('Using cached IBM IAM token.', {
      expiresAt: new Date(_tokenCache.expiresAt).toISOString(),
    });
    return _tokenCache.accessToken;
  }

  // Cache is missing or about to expire — fetch a fresh token
  try {
    _tokenCache = await _fetchNewToken();
    return _tokenCache.accessToken;
  } catch (err) {
    // Nullify stale cache to force a retry on the next call
    _tokenCache = null;
    logger.error('Failed to obtain IBM IAM access token.', {
      message: err.message,
      status: err?.response?.status,
    });
    throw new Error(`IBM IAM authentication failed: ${err.message}`);
  }
}

/**
 * Clears the in-memory token cache.
 * Useful for testing or when a 401 is received from a downstream service.
 */
function invalidateToken() {
  logger.warn('IBM IAM token cache invalidated — will re-authenticate on next request.');
  _tokenCache = null;
}

module.exports = {
  getAccessToken,
  invalidateToken,
};
