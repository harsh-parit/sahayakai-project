'use strict';

/**
 * requestLogger.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Per-request structured log helper, layered on top of Morgan.
 *
 * Morgan handles the raw HTTP access log. This middleware adds a structured
 * log entry at the START of each request, useful for tracing async flows
 * across IBM Cloud Log Analysis.
 *
 * The middleware also stamps each request with a unique request ID that
 * propagates through the logger context — handy for debugging concurrent
 * prediction requests.
 */

const logger = require('../utils/logger');

let requestCounter = 0;

/**
 * @param {import('express').Request}    req
 * @param {import('express').Response}   res
 * @param {import('express').NextFunction} next
 */
const requestLogger = (req, res, next) => {
  // Lightweight sequential request ID — good enough for a single-process server
  requestCounter += 1;
  req.requestId = `req-${requestCounter.toString().padStart(6, '0')}`;

  // Skip verbose logging for health-check polling in production
  const isHealthCheck = req.path === '/api/health';
  const isProduction  = process.env.NODE_ENV === 'production';

  if (!(isHealthCheck && isProduction)) {
    logger.info(`→ ${req.method} ${req.originalUrl}`, {
      requestId: req.requestId,
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  // Attach request ID to response headers for client-side correlation
  res.setHeader('X-Request-Id', req.requestId);

  next();
};

module.exports = requestLogger;
