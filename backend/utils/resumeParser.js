/**
 * utils/resumeParser.js
 * Extracts plain text from uploaded PDF or DOCX resumes
 * Uses pdf-parse for PDFs and mammoth for DOCX files
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extracts raw text from a resume file based on its extension.
 * @param {string} filePath - Absolute path to the uploaded file
 * @returns {Promise<string>} - Plain text content of the resume
 */
const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return await extractFromPDF(filePath);
  } else if (ext === ".docx" || ext === ".doc") {
    return await extractFromDOCX(filePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
};

/**
 * Extracts text from a PDF file using pdf-parse
 */
const extractFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  if (!data.text || data.text.trim().length < 50) {
    throw new Error(
      "Could not extract meaningful text from the PDF. It may be image-based or encrypted."
    );
  }

  return cleanText(data.text);
};

/**
 * Extracts text from a DOCX file using mammoth
 * mammoth converts DOCX to plain text while preserving structure
 */
const extractFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });

  if (!result.value || result.value.trim().length < 50) {
    throw new Error(
      "Could not extract meaningful text from the DOCX file."
    );
  }

  // Log any mammoth warnings (e.g., unsupported formatting)
  if (result.messages && result.messages.length > 0) {
    console.log("DOCX parsing warnings:", result.messages);
  }

  return cleanText(result.value);
};

/**
 * Cleans extracted text by normalizing whitespace and removing artifacts
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
const cleanText = (text) => {
  return text
    .replace(/\r\n/g, "\n")            // Normalize line endings
    .replace(/\r/g, "\n")              // Handle old Mac line endings
    .replace(/\t/g, " ")               // Replace tabs with spaces
    .replace(/[ ]{2,}/g, " ")          // Collapse multiple spaces
    .replace(/\n{3,}/g, "\n\n")        // Collapse multiple blank lines
    .replace(/[^\x20-\x7E\n]/g, " ")   // Remove non-printable ASCII chars
    .trim();
};

/**
 * Attempts to parse common resume sections from raw text
 * Uses regex to identify section headers like EDUCATION, EXPERIENCE, etc.
 * @param {string} text - Full resume text
 * @returns {object} - Object with named sections
 */
const parseSections = (text) => {
  const sections = {
    contact: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    certifications: "",
    projects: "",
  };

  // Header patterns that signal the start of each section
  const sectionPatterns = {
    summary: /\b(summary|profile|objective|about me|professional summary)\b/i,
    experience: /\b(experience|work history|employment|work experience|career)\b/i,
    education: /\b(education|academic|qualifications|degrees?|schooling)\b/i,
    skills: /\b(skills|technical skills|competencies|technologies|expertise)\b/i,
    certifications: /\b(certifications?|licenses?|credentials?|courses?)\b/i,
    projects: /\b(projects?|portfolio|work samples?|personal projects?)\b/i,
  };

  // Split text into lines and find section boundaries
  const lines = text.split("\n");
  let currentSection = "contact"; // Everything before a known header is "contact"

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this line is a section header
    let foundSection = null;
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmedLine) && trimmedLine.length < 50) {
        foundSection = sectionName;
        break;
      }
    }

    if (foundSection) {
      currentSection = foundSection;
    } else {
      sections[currentSection] += trimmedLine + "\n";
    }
  }

  // Trim all sections
  for (const key in sections) {
    sections[key] = sections[key].trim();
  }

  return sections;
};

module.exports = { extractTextFromFile, parseSections, cleanText };
