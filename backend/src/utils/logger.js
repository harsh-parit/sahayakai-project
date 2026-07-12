'use strict';

/**
 * logger.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight structured logger built on top of console.
 *
 * Emits JSON lines in production so log aggregators (IBM Log Analysis,
 * Datadog, etc.) can parse them without additional configuration.
 * Emits colourised human-readable output in development.
 *
 * Usage:
 *   const logger = require('../utils/logger');
 *   logger.info('Server started', { port: 5000 });
 *   logger.error('IBM IAM request failed', { status: 401 });
 */

const IS_PROD = process.env.NODE_ENV === 'production';

// ANSI colour codes — only used in development
const COLOURS = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  info:   '\x1b[36m',   // cyan
  warn:   '\x1b[33m',   // yellow
  error:  '\x1b[31m',   // red
  debug:  '\x1b[35m',   // magenta
};

/**
 * Core log function.
 *
 * @param {'info'|'warn'|'error'|'debug'} level
 * @param {string}  message
 * @param {object}  [meta]   - optional key/value metadata
 */
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();

  if (IS_PROD) {
    // Structured JSON line for log aggregators
    const output = JSON.stringify({ timestamp, level, message, ...meta });
    if (level === 'error') {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
    return;
  }

  // Human-readable development output
  const colour = COLOURS[level] ?? COLOURS.reset;
  const prefix = `${COLOURS.dim}${timestamp}${COLOURS.reset} ${colour}[${level.toUpperCase()}]${COLOURS.reset}`;
  const metaStr = Object.keys(meta).length
    ? ` ${COLOURS.dim}${JSON.stringify(meta)}${COLOURS.reset}`
    : '';

  const logFn = level === 'error' ? console.error : console.log;
  logFn(`${prefix} ${message}${metaStr}`);
}

const logger = {
  info:  (message, meta) => log('info',  message, meta),
  warn:  (message, meta) => log('warn',  message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};

module.exports = logger;
