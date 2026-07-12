'use strict';

/**
 * predictionRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mounts prediction endpoints.
 *
 *   POST /api/predict   →  predictionController.predictEligibility
 */

const express    = require('express');
const { predictEligibility } = require('../controllers/predictionController');

const router = express.Router();

/**
 * POST /api/predict
 *
 * Accepts an applicant payload, validates it, scores it via IBM AutoAI,
 * and returns a structured eligibility prediction.
 *
 * Body: see predictionController.validatePredictionBody for full schema.
 */
router.post('/predict', predictEligibility);

module.exports = router;
