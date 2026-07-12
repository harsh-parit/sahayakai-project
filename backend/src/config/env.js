'use strict';

/**
 * env.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central environment variable loader and validator.
 *
 * All other modules import from here — never directly from process.env —
 * so that:
 *   1. Missing required variables are caught at startup, not at runtime.
 *   2. Type coercions (string → number) happen in one place.
 *   3. Secrets stay out of application logic.
 */

require('dotenv').config();

const logger = require('../utils/logger');

// ─── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates that all required environment variables are present.
 * Exits the process with code 1 if any are missing, so the container
 * restarts cleanly rather than running in a broken state.
 *
 * @param {string[]} required - list of variable names that must be present
 */
function assertEnv(required) {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    logger.error('Missing required environment variables — cannot start server.', {
      missing: missing.join(', '),
    });
    process.exit(1);
  }
}

// ─── Require these at startup ─────────────────────────────────────────────────
assertEnv([
  'IBM_API_KEY',
  'IBM_DEPLOYMENT_ENDPOINT',
]);

// ─── CORS origin list ─────────────────────────────────────────────────────────
const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// ─── Exported config object ───────────────────────────────────────────────────
const env = {
  // Server
  port:    parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDev:   (process.env.NODE_ENV ?? 'development') === 'development',

  // IBM Cloud
  ibmApiKey:            process.env.IBM_API_KEY,
  ibmRegion:            process.env.IBM_REGION ?? 'us-south',
  ibmDeploymentEndpoint: process.env.IBM_DEPLOYMENT_ENDPOINT,
  ibmProjectId:         process.env.IBM_PROJECT_ID ?? '',

  // IBM IAM token endpoint — same for all regions
  ibmIamTokenUrl: 'https://iam.cloud.ibm.com/identity/token',

  // CORS
  corsOrigins,
};

module.exports = env;
