'use strict';

/**
 * app.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express application factory.
 *
 * Creates and configures the Express app but does NOT start the HTTP server
 * (that happens in server.js). This separation makes the app testable in
 * isolation — a test can import the app and use supertest without binding
 * to a port.
 *
 * Middleware registration order matters:
 *   1. Security headers (Helmet)
 *   2. CORS
 *   3. Request logger (custom) + Morgan (HTTP access log)
 *   4. Body parsers
 *   5. Routes
 *   6. 404 handler
 *   7. Global error handler  ← MUST be last
 */

const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const morgan        = require('morgan');

const env              = require('./config/env');
const requestLogger    = require('./middleware/requestLogger');
const errorHandler     = require('./middleware/errorHandler');
const notFound         = require('./middleware/notFound');
const healthRoutes     = require('./routes/healthRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const logger           = require('./utils/logger');

// ─── App factory ──────────────────────────────────────────────────────────────

const app = express();

// ── 1. Security headers ────────────────────────────────────────────────────
app.use(
  helmet({
    // Allow the Vite dev server to load the API in an iframe during development
    contentSecurityPolicy: env.isDev ? false : undefined,
  })
);

// ── 2. CORS ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn('CORS blocked request from disallowed origin.', { origin });
      return callback(new Error(`CORS policy: origin ${origin} is not allowed.`));
    },
    methods:            ['GET', 'POST', 'OPTIONS'],
    allowedHeaders:     ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders:     ['X-Request-Id'],
    credentials:        true,
    optionsSuccessStatus: 200,
  })
);

// ── 3. Request logger + Morgan HTTP access log ─────────────────────────────
app.use(requestLogger);

// Morgan format: 'dev' in development, 'combined' in production
app.use(
  morgan(env.isDev ? 'dev' : 'combined', {
    // Skip health-check polls in production logs to reduce noise
    skip: (req) => !env.isDev && req.path === '/api/health',
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// ── 4. Body parsers ────────────────────────────────────────────────────────
// Accept JSON bodies up to 1 MB — sufficient for any prediction payload
app.use(express.json({ limit: '1mb' }));

// ── 5. Routes ──────────────────────────────────────────────────────────────
app.use('/api', healthRoutes);
app.use('/api', predictionRoutes);

// Root — useful for quick uptime checks
app.get('/', (req, res) => {
  res.json({
    name:    'SahayakAI Backend',
    version: require('../package.json').version,
    docs:    '/api/health',
  });
});

// ── 6. 404 handler ─────────────────────────────────────────────────────────
app.use(notFound);

// ── 7. Global error handler ────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use(errorHandler);

module.exports = app;
