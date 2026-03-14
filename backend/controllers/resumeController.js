/**
 * controllers/resumeController.js
 * Handles resume upload, text extraction, skill detection, and ATS analysis
 */

const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const { extractTextFromFile, parseSections } = require("../utils/resumeParser");
const { extractSkills } = require("../utils/skillExtractor");
const { checkATSCompatibility } = require("../utils/atsChecker");
const { generateAISuggestions } = require("../utils/aiService");

/**
 * POST /api/resumes/upload
 * Accepts a PDF or DOCX file, extracts text, runs analysis, saves to MongoDB
 */
const uploadResume = async (req, res) => {
  const filePath = req.file.path;

  try {
    // Step 1: Extract text from the uploaded file
    const rawText = await extractTextFromFile(filePath);

    // Step 2: Parse sections from the raw text
    const sections = parseSections(rawText);

    // Step 3: Extract skills
    const skills = extractSkills(rawText);

    // Step 4: ATS compatibility check
    const atsCheck = checkATSCompatibility(rawText, sections);

    // Step 5: Generate AI suggestions
    const aiSuggestions = await generateAISuggestions(rawText, skills, atsCheck);

    // Step 6: Attempt to extract candidate name (first non-empty line, heuristic)
    const firstLine = rawText.split("\n").find((l) => l.trim().length > 2);
    const candidateName = firstLine && firstLine.length < 60 ? firstLine.trim() : undefined;

    // Step 7: Save to database
    const resume = new Resume({
      fileName: req.file.originalname,
      fileType: path.extname(req.file.originalname).replace(".", "").toLowerCase(),
      fileSize: req.file.size,
      filePath: req.file.filename,
      rawText,
      wordCount: rawText.split(/\s+/).filter(Boolean).length,
      characterCount: rawText.length,
      sections,
      skills,
      candidateName,
      atsCheck,
      aiSuggestions,
      status: "analyzed",
      lastAnalyzedAt: new Date(),
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        candidateName: resume.candidateName,
        skillCount: skills.length,
        atsScore: atsCheck.score,
        status: resume.status,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    // Clean up uploaded file on failure
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to process the resume.",
    });
  }
};

/**
 * GET /api/resumes/:id
 * Returns full resume analysis for a given resume ID
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select("-rawText"); // Exclude rawText for payload size

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/resumes/:id/full
 * Returns complete resume data including raw text (for debugging)
 */
const getResumeFullText = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.json({ success: true, data: { rawText: resume.rawText, sections: resume.sections } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/resumes
 * Returns paginated list of all uploaded resumes (summary only)
 */
const getAllResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const resumes = await Resume.find()
      .select("fileName candidateName skills atsCheck status uploadedAt")
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resume.countDocuments();

    res.json({
      success: true,
      data: {
        resumes,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/resumes/:id
 * Deletes a resume from the database and removes the uploaded file
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, "../uploads", resume.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadResume, getResumeById, getResumeFullText, getAllResumes, deleteResume };
