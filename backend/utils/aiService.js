/**
 * utils/aiService.js
 * Integrates with OpenAI API to generate AI-powered resume improvement suggestions
 * Falls back to rule-based suggestions if no API key is configured
 */

const OpenAI = require("openai");

// ─── OpenAI Client ────────────────────────────────────────────────────────────
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Generates AI-powered resume improvement suggestions using OpenAI
 * @param {string} resumeText - Full resume text
 * @param {Array} detectedSkills - Skills extracted from the resume
 * @param {object} atsResults - ATS compatibility check results
 * @returns {Promise<object>} - Summary, improvements, and strengths
 */
const generateAISuggestions = async (resumeText, detectedSkills, atsResults) => {
  // If no OpenAI key, use rule-based fallback
  if (!openai) {
    console.warn("⚠️  No OpenAI API key found. Using rule-based suggestions.");
    return generateRuleBasedSuggestions(resumeText, detectedSkills, atsResults);
  }

  try {
    const skillNames = detectedSkills.map((s) => s.name).join(", ");
    const atsIssues = atsResults.issues.join("; ");

    const prompt = `You are a professional resume coach and career consultant with 10+ years of experience.

Analyze this resume and provide specific, actionable feedback.

RESUME TEXT:
${resumeText.substring(0, 3000)} ${resumeText.length > 3000 ? "...[truncated]" : ""}

DETECTED SKILLS: ${skillNames || "None clearly detected"}
ATS SCORE: ${atsResults.score}/100
ATS ISSUES FOUND: ${atsIssues || "None"}

Respond with a JSON object in this exact format:
{
  "summary": "One sentence overall assessment of the resume quality",
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2",
    "Specific improvement suggestion 3",
    "Specific improvement suggestion 4",
    "Specific improvement suggestion 5"
  ],
  "strengths": [
    "Strength 1 of the resume",
    "Strength 2 of the resume",
    "Strength 3 of the resume"
  ]
}

Be specific and constructive. Focus on actionable changes that will improve interview rates.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume coach. Always respond with valid JSON only, no markdown.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content?.trim();

    // Parse the JSON response
    const parsed = JSON.parse(content);

    return {
      summary: parsed.summary || "Analysis complete.",
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      generatedAt: new Date(),
      source: "openai",
    };
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    // Fall back to rule-based if API call fails
    return generateRuleBasedSuggestions(resumeText, detectedSkills, atsResults);
  }
};

/**
 * Rule-based fallback when OpenAI is unavailable
 * Generates suggestions based on detected patterns and ATS results
 */
const generateRuleBasedSuggestions = (resumeText, detectedSkills, atsResults) => {
  const improvements = [];
  const strengths = [];
  const text = resumeText.toLowerCase();

  // Build improvements from ATS issues
  improvements.push(...atsResults.suggestions.slice(0, 3));

  // Add suggestions based on content analysis
  if (!text.includes("github") && !text.includes("portfolio") && !text.includes("linkedin")) {
    improvements.push("Add links to your GitHub, LinkedIn, or portfolio to showcase your work.");
  }

  if (detectedSkills.length < 5) {
    improvements.push("Your skills section seems sparse. Expand it with relevant technical and soft skills.");
  }

  if (!/(summary|objective|profile)/i.test(resumeText)) {
    improvements.push("Consider adding a professional summary or objective at the top of your resume.");
  }

  if (!/(bullet|•|-|\*)/m.test(resumeText)) {
    improvements.push("Use bullet points to break up long paragraphs and improve readability.");
  }

  improvements.push("Tailor your resume to each job description by incorporating keywords from the posting.");

  // Build strengths
  if (detectedSkills.length >= 10) {
    strengths.push(`Strong skill set with ${detectedSkills.length} relevant skills detected.`);
  }
  if (atsResults.hasMeasurableAchievements) {
    strengths.push("Good use of quantifiable achievements demonstrating real impact.");
  }
  if (atsResults.hasContactInfo) {
    strengths.push("Complete contact information makes it easy for recruiters to reach you.");
  }
  if (atsResults.score >= 70) {
    strengths.push(`Solid ATS compatibility score of ${atsResults.score}/100.`);
  }

  // Default strength if none found
  if (strengths.length === 0) {
    strengths.push("Resume has a clear structure that can be built upon.");
  }

  const score = atsResults.score;
  let summary = "";
  if (score >= 80) summary = "Your resume is well-structured and ATS-friendly with room for minor improvements.";
  else if (score >= 60) summary = "Your resume has a solid foundation but needs some adjustments to maximize ATS performance.";
  else summary = "Your resume needs significant improvements to pass ATS screening effectively.";

  return {
    summary,
    improvements: improvements.slice(0, 6),
    strengths: strengths.slice(0, 4),
    generatedAt: new Date(),
    source: "rule-based",
  };
};

module.exports = { generateAISuggestions };
