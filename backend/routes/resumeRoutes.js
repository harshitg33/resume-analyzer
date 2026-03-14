/**
 * routes/resumeRoutes.js
 * Express router for all resume upload and retrieval endpoints
 */

const express = require("express");
const router = express.Router();
const { handleUpload } = require("../middleware/upload");
const {
  uploadResume,
  getResumeById,
  getResumeFullText,
  getAllResumes,
  deleteResume,
} = require("../controllers/resumeController");

// POST   /api/resumes/upload       - Upload and analyze a new resume
router.post("/upload", handleUpload, uploadResume);

// GET    /api/resumes              - List all resumes (paginated)
router.get("/", getAllResumes);

// GET    /api/resumes/:id          - Get resume summary (no raw text)
router.get("/:id", getResumeById);

// GET    /api/resumes/:id/full     - Get resume with raw text
router.get("/:id/full", getResumeFullText);

// DELETE /api/resumes/:id          - Delete a resume and its file
router.delete("/:id", deleteResume);

module.exports = router;
