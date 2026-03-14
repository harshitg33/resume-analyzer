/**
 * utils/atsChecker.js
 * Evaluates how well a resume would perform with ATS (Applicant Tracking Systems)
 * Checks formatting, content completeness, keyword density, and common ATS pitfalls
 */

/**
 * Runs a full ATS compatibility check on a parsed resume
 * @param {string} rawText - Full resume text
 * @param {object} sections - Parsed resume sections
 * @returns {object} - ATS score and detailed findings
 */
const checkATSCompatibility = (rawText, sections = {}) => {
  const issues = [];
  const suggestions = [];
  let score = 100; // Start at 100 and deduct for each issue

  // ─── 1. Contact Information ─────────────────────────────────────────────────
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawText);
  const hasPhone = /(\+?\d{1,3}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/.test(rawText);
  const hasContactInfo = hasEmail && hasPhone;

  if (!hasEmail) {
    issues.push("No email address detected.");
    suggestions.push("Add a professional email address in your contact section.");
    score -= 15;
  }
  if (!hasPhone) {
    issues.push("No phone number detected.");
    suggestions.push("Include a phone number in your contact section.");
    score -= 10;
  }

  // ─── 2. Work Experience ─────────────────────────────────────────────────────
  const hasWorkExperience = !!(
    sections.experience && sections.experience.length > 50 ||
    /\b(experience|worked|employed|position|role|company|employer)\b/i.test(rawText)
  );

  if (!hasWorkExperience) {
    issues.push("Work experience section not clearly identified.");
    suggestions.push("Ensure your experience section has a clear heading like 'Work Experience' or 'Professional Experience'.");
    score -= 20;
  }

  // ─── 3. Education ────────────────────────────────────────────────────────────
  const hasEducation = !!(
    sections.education && sections.education.length > 20 ||
    /\b(university|college|bachelor|master|phd|degree|diploma|b\.s\.|m\.s\.|b\.tech|m\.tech)\b/i.test(rawText)
  );

  if (!hasEducation) {
    issues.push("Education section not clearly detected.");
    suggestions.push("Add an education section with degree, institution, and graduation year.");
    score -= 10;
  }

  // ─── 4. Skills Section ──────────────────────────────────────────────────────
  const hasSkillsSection = !!(
    sections.skills && sections.skills.length > 20 ||
    /\b(skills|technologies|technical skills|competencies)\b/i.test(rawText)
  );

  if (!hasSkillsSection) {
    issues.push("Dedicated skills section not found.");
    suggestions.push("Add a clearly labeled 'Skills' or 'Technical Skills' section listing your key abilities.");
    score -= 15;
  }

  // ─── 5. Measurable Achievements ─────────────────────────────────────────────
  // ATS and recruiters value quantified achievements (%, $, numbers)
  const achievementPattern = /(\d+%|\$\d+|\d+ years?|\d+ months?|increased|decreased|improved|reduced|managed \d+|led \d+)/i;
  const hasMeasurableAchievements = achievementPattern.test(rawText);

  if (!hasMeasurableAchievements) {
    issues.push("No quantified achievements found.");
    suggestions.push("Add measurable results to your experience (e.g., 'Increased performance by 40%', 'Led a team of 5').");
    score -= 10;
  }

  // ─── 6. Word Count ───────────────────────────────────────────────────────────
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 200) {
    issues.push(`Resume is very short (${wordCount} words). ATS may not find enough content.`);
    suggestions.push("Aim for 400–800 words for a single-page resume or 600–1000 for two pages.");
    score -= 10;
  } else if (wordCount > 1200) {
    issues.push(`Resume is very long (${wordCount} words). Consider condensing to 1-2 pages.`);
    suggestions.push("Keep your resume concise. Trim older or less relevant experience.");
    score -= 5;
  }

  // ─── 7. Action Verbs ─────────────────────────────────────────────────────────
  const actionVerbs = [
    "developed", "built", "designed", "implemented", "managed", "led", "created",
    "improved", "increased", "reduced", "deployed", "architected", "collaborated",
    "optimized", "automated", "integrated", "delivered", "launched",
  ];
  const hasActionVerbs = actionVerbs.some((verb) =>
    new RegExp(`\\b${verb}\\b`, "i").test(rawText)
  );

  if (!hasActionVerbs) {
    issues.push("No strong action verbs detected.");
    suggestions.push("Start bullet points with powerful action verbs: 'Built', 'Led', 'Optimized', etc.");
    score -= 5;
  }

  // ─── 8. Date Formats ─────────────────────────────────────────────────────────
  const hasDateFormats = /\b(20\d{2}|19\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(rawText);

  if (!hasDateFormats) {
    issues.push("No dates detected. ATS relies on dates to assess tenure.");
    suggestions.push("Include start/end dates for all positions and education entries.");
    score -= 5;
  }

  // ─── Final Score Clamp ────────────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    hasContactInfo,
    hasWorkExperience,
    hasEducation,
    hasSkillsSection,
    hasMeasurableAchievements,
    wordCount,
    issues,
    suggestions,
    grade: getATSGrade(score),
  };
};

/**
 * Converts numeric ATS score to a letter grade
 */
const getATSGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
};

module.exports = { checkATSCompatibility };
