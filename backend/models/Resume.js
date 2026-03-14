/**
 * models/Resume.js
 * Mongoose schema for storing parsed resume data and analysis results
 */

const mongoose = require("mongoose");

// ─── Sub-schema: Individual Skill ────────────────────────────────────────────
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["technical", "soft", "language", "tool", "framework", "other"],
    default: "technical",
  },
  confidence: { type: Number, min: 0, max: 1, default: 1 }, // How confidently detected
});

// ─── Sub-schema: ATS Check Results ───────────────────────────────────────────
const ATSCheckSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100 },
  hasContactInfo: Boolean,
  hasWorkExperience: Boolean,
  hasEducation: Boolean,
  hasSkillsSection: Boolean,
  hasMeasurableAchievements: Boolean,
  wordCount: Number,
  issues: [String],        // List of ATS problems found
  suggestions: [String],   // How to fix the issues
});

// ─── Sub-schema: Job Match Result ────────────────────────────────────────────
const JobMatchSchema = new mongoose.Schema({
  jobTitle: String,
  jobDescription: String,
  matchScore: { type: Number, min: 0, max: 100 },
  matchedSkills: [String],
  missingSkills: [String],
  analysisDate: { type: Date, default: Date.now },
});

// ─── Main Resume Schema ───────────────────────────────────────────────────────
const ResumeSchema = new mongoose.Schema(
  {
    // File metadata
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx"], required: true },
    fileSize: Number, // in bytes
    filePath: String,

    // Extracted content
    rawText: { type: String, required: true },   // Full plain text from the resume
    wordCount: Number,
    characterCount: Number,

    // Parsed sections
    sections: {
      contact: String,
      summary: String,
      experience: String,
      education: String,
      skills: String,
      certifications: String,
      projects: String,
    },

    // Extracted skills
    skills: [SkillSchema],

    // Candidate name extracted from resume (best-effort)
    candidateName: String,

    // ATS compatibility results
    atsCheck: ATSCheckSchema,

    // AI-generated improvement suggestions
    aiSuggestions: {
      summary: String,          // One-line summary of the resume quality
      improvements: [String],   // List of specific improvement suggestions
      strengths: [String],      // What the resume does well
      generatedAt: Date,
    },

    // History of all job match analyses performed on this resume
    jobMatches: [JobMatchSchema],

    // Upload tracking
    uploadedAt: { type: Date, default: Date.now },
    lastAnalyzedAt: Date,

    // Analysis status
    status: {
      type: String,
      enum: ["uploaded", "parsed", "analyzed", "error"],
      default: "uploaded",
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: Total skills count ─────────────────────────────────────────────
ResumeSchema.virtual("skillCount").get(function () {
  return this.skills ? this.skills.length : 0;
});

// ─── Index for faster queries ─────────────────────────────────────────────────
ResumeSchema.index({ uploadedAt: -1 });
ResumeSchema.index({ status: 1 });

module.exports = mongoose.model("Resume", ResumeSchema);
