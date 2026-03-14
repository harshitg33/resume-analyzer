/**
 * routes/analysisRoutes.js
 * Express router for analysis endpoints: job matching, results retrieval
 */

const express = require("express");
const router = express.Router();
const {
  matchJobDescription,
  getAnalysisResults,
  regenerateSuggestions,
} = require("../controllers/analysisController");

// GET  /api/analysis/:id/results      - Get full analysis for a resume
router.get("/:id/results", getAnalysisResults);

// POST /api/analysis/:id/match-job    - Match resume against a job description
router.post("/:id/match-job", matchJobDescription);

// POST /api/analysis/:id/regenerate   - Re-generate AI suggestions
router.post("/:id/regenerate", regenerateSuggestions);

module.exports = router;
