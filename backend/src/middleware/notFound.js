'use strict';

/**
 * notFound.js
 * ─────────────────────────────────────────────────────────────────────────────
 * 404 catch-all middleware.
 *
 * Registered after all route definitions in app.js. Any request that does
 * not match a defined route falls through to this handler.
 */

const { notFound: sendNotFound } = require('../utils/response');

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const notFound = (req, res) => {
  return sendNotFound(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
};

module.exports = notFound;
