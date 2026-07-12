'use strict';

/**
 * server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP server entry point.
 *
 * Responsibilities:
 *   1. Import the configured Express app.
 *   2. Bind to the configured port.
 *   3. Handle unhandled promise rejections and uncaught exceptions so the
 *      process exits cleanly and the container / PM2 restarts it.
 *   4. Handle SIGTERM / SIGINT for graceful shutdown (drain in-flight requests
 *      before closing the listener).
 *
 * Start with:  node src/server.js
 * Dev mode:    nodemon src/server.js   (via `npm run dev`)
 */

// Load environment variables and validate them before anything else
const env    = require('./config/env');
const logger = require('./utils/logger');
const app    = require('./app');

// ─── Create HTTP server ───────────────────────────────────────────────────────

const server = app.listen(env.port, () => {
  logger.info(`SahayakAI backend started.`, {
    port:    env.port,
    env:     env.nodeEnv,
    pid:     process.pid,
    node:    process.version,
  });
  logger.info(`Health check → http://localhost:${env.port}/api/health`);
  logger.info(`Predict      → POST http://localhost:${env.port}/api/predict`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

/**
 * Attempts a graceful shutdown: stops accepting new connections, waits for
 * in-flight requests to complete, then exits.
 *
 * @param {string} signal - OS signal that triggered the shutdown
 */
function gracefulShutdown(signal) {
  logger.info(`Received ${signal} — initiating graceful shutdown…`);

  server.close((err) => {
    if (err) {
      logger.error('Error during graceful shutdown.', { message: err.message });
      process.exit(1);
    }
    logger.info('All connections closed — process exiting cleanly.');
    process.exit(0);
  });

  // Force-exit after 10 seconds if connections are still open
  setTimeout(() => {
    logger.warn('Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 10_000).unref(); // .unref() ensures the timer doesn't keep the event loop alive
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// ─── Safety nets ──────────────────────────────────────────────────────────────

/**
 * Catches unhandled promise rejections (e.g. a service function that forgot
 * to await). Logs and exits so the container restarts rather than running
 * in an undefined state.
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection — shutting down.', {
    reason: reason?.message ?? String(reason),
    promise: String(promise),
  });
  server.close(() => process.exit(1));
});

/**
 * Catches synchronous exceptions that escaped all try/catch blocks.
 * These should never happen in well-written code — if they do, it is a bug.
 */
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception — shutting down.', {
    message: err.message,
    stack:   err.stack,
  });
  process.exit(1);
});

module.exports = server; // exported for integration tests
