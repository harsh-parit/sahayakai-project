'use strict';

/**
 * healthRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mounts the health-check endpoint.
 *
 *   GET /api/health
 *
 * Used by:
 *   - IBM Cloud load balancers / Kubernetes liveness probes
 *   - Uptime monitors (UptimeRobot, IBM Instana, etc.)
 *   - CI/CD pipelines that wait for the service to become ready
 */

const express = require('express');
const { version } = require('../../package.json');
const { success } = require('../utils/response');

const router = express.Router();

/**
 * GET /api/health
 *
 * Returns server status, uptime, timestamp, and application version.
 */
router.get('/health', (req, res) => {
  return success(
    res,
    {
      status:    'ok',
      uptime:    Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version,
      node:      process.version,
      env:       process.env.NODE_ENV ?? 'development',
    },
    'data',
    200
  );
});

module.exports = router;
