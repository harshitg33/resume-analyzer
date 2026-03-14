/**
 * middleware/upload.js
 * Multer configuration for handling PDF and DOCX file uploads
 * Validates file type, enforces size limits, and saves to /uploads directory
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Storage Configuration ────────────────────────────────────────────────────
// Files are saved with a UUID prefix to prevent naming collisions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // e.g. "a1b2c3d4-my-resume.pdf"
    const uniqueId = uuidv4().split("-")[0];
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${uniqueId}-${sanitizedName}`);
  },
});

// ─── File Type Filter ─────────────────────────────────────────────────────────
// Only accept PDF and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const allowedExtensions = [".pdf", ".docx", ".doc"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only PDF and DOCX files are allowed."),
      false
    );
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 1,                    // Only one file per request
  },
});

// ─── Error Handler Wrapper ────────────────────────────────────────────────────
// Wraps multer errors in a consistent JSON response format
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single("resume");

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File is too large. Maximum size is 10MB.",
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // No file uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a PDF or DOCX file.",
      });
    }

    next();
  });
};

module.exports = { handleUpload };
