'use strict';

/**
 * errorHandler.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Global Express error-handling middleware.
 *
 * Must be registered LAST in app.js (after all routes) and must have exactly
 * four parameters so Express recognises it as an error handler.
 *
 * Catches:
 *   - Errors thrown inside route handlers / controllers
 *   - Errors passed via next(err)
 *   - Axios errors from IBM Cloud API calls
 *   - JSON body-parser syntax errors
 */

const logger = require('../utils/logger');
const { error: sendError } = require('../utils/response');

/**
 * @param {Error}                       err
 * @param {import('express').Request}   req
 * @param {import('express').Response}  res
 * @param {import('express').NextFunction} next  - required by Express signature
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // ── Log the error with context ────────────────────────────────────────────
  logger.error(err.message, {
    method:  req.method,
    url:     req.originalUrl,
    status:  err.status ?? err.statusCode ?? 500,
    stack:   process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  // ── JSON body parse error (SyntaxError from express.json()) ──────────────
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(
      res,
      'Invalid JSON in request body.',
      'INVALID_JSON',
      400
    );
  }

  // ── Axios / HTTP client errors from IBM Cloud calls ───────────────────────
  if (err.isAxiosError) {
    const upstreamStatus = err?.response?.status;

    if (upstreamStatus === 401 || upstreamStatus === 403) {
      return sendError(
        res,
        'IBM Cloud authentication failed. Check your API key configuration.',
        'IBM_AUTH_ERROR',
        502
      );
    }

    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return sendError(
        res,
        'Request to IBM Cloud timed out. Please try again.',
        'IBM_TIMEOUT',
        504
      );
    }

    return sendError(
      res,
      'An upstream IBM Cloud service returned an error.',
      'IBM_UPSTREAM_ERROR',
      502
    );
  }

  // ── Application-level errors with explicit status codes ───────────────────
  const statusCode = err.status ?? err.statusCode ?? 500;
  const isDev      = process.env.NODE_ENV !== 'production';

  return sendError(
    res,
    isDev ? err.message : 'An unexpected internal server error occurred.',
    err.code ?? 'INTERNAL_ERROR',
    statusCode
  );
};

module.exports = errorHandler;
