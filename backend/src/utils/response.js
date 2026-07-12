'use strict';

/**
 * response.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Standardised JSON response helpers.
 *
 * Every Express route/controller sends a response through these helpers so the
 * shape of the API is consistent across the entire backend.
 *
 * Success envelope:
 *   { success: true,  data: {}, timestamp: "ISO" }
 *
 * Error envelope:
 *   { success: false, message: "", error: "", timestamp: "ISO" }
 */

/**
 * Send a 200 OK success response.
 *
 * @param {import('express').Response} res
 * @param {object}  data         - payload to embed under the appropriate key
 * @param {string}  [dataKey]    - top-level key for the payload (default: "data")
 * @param {number}  [statusCode] - HTTP status (default: 200)
 */
const success = (res, data, dataKey = 'data', statusCode = 200) => {
  return res.status(statusCode).json({
    success:   true,
    [dataKey]: data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a 201 Created response (resource creation).
 *
 * @param {import('express').Response} res
 * @param {object} data
 * @param {string} [dataKey]
 */
const created = (res, data, dataKey = 'data') => {
  return success(res, data, dataKey, 201);
};

/**
 * Send an error response.
 *
 * @param {import('express').Response} res
 * @param {string} message      - human-readable description shown to clients
 * @param {string} [errorCode]  - machine-readable error code (e.g. VALIDATION_ERROR)
 * @param {number} [statusCode] - HTTP status (default: 500)
 */
const error = (res, message, errorCode = 'INTERNAL_ERROR', statusCode = 500) => {
  return res.status(statusCode).json({
    success:   false,
    message,
    error:     errorCode,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a 400 Bad Request error — used for validation failures.
 *
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} [details] - field-level validation error map
 */
const validationError = (res, message, details = null) => {
  const body = {
    success:   false,
    message,
    error:     'VALIDATION_ERROR',
    timestamp: new Date().toISOString(),
  };
  if (details) body.details = details;
  return res.status(400).json(body);
};

/**
 * Send a 404 Not Found error.
 *
 * @param {import('express').Response} res
 * @param {string} [message]
 */
const notFound = (res, message = 'The requested resource was not found.') => {
  return error(res, message, 'NOT_FOUND', 404);
};

/**
 * Send a 503 Service Unavailable error — used when IBM Cloud is unreachable.
 *
 * @param {import('express').Response} res
 * @param {string} [message]
 */
const serviceUnavailable = (res, message = 'An upstream service is currently unavailable.') => {
  return error(res, message, 'SERVICE_UNAVAILABLE', 503);
};

module.exports = {
  success,
  created,
  error,
  validationError,
  notFound,
  serviceUnavailable,
};
