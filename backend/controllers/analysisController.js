const Resume = require("../models/Resume");
const { compareWithJobDescription } = require("../utils/skillExtractor");
const { generateAISuggestions } = require("../utils/aiService");

const matchJobDescription = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ success: false, message: "Please provide a job description with at least 30 characters." });
    }
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    const { matchedSkills, missingSkills, matchScore, totalJobSkills } = compareWithJobDescription(resume.skills, jobDescription);

    let tailoredSuggestions = { improvements: [], strengths: [], summary: "" };
    try {
      const atsObj = resume.atsCheck ? resume.atsCheck.toObject() : {};
      const result = await generateAISuggestions(resume.rawText, resume.skills, { ...atsObj, jobDescription, missingSkills });
      if (result) tailoredSuggestions = result;
    } catch (aiError) {
      console.warn("AI suggestions skipped:", aiError.message);
    }

    const jobMatchEntry = {
      jobTitle: jobTitle || "Untitled Position",
      jobDescription: jobDescription.substring(0, 500),
      matchScore,
      matchedSkills,
      missingSkills,
      analysisDate: new Date(),
    };

    resume.jobMatches.push(jobMatchEntry);
    resume.lastAnalyzedAt = new Date();
    await resume.save();

    res.json({
      success: true,
      data: {
        resumeId: resume._id,
        jobTitle: jobMatchEntry.jobTitle,
        matchScore,
        totalJobSkillsDetected: totalJobSkills,
        matchedSkills: matchedSkills || [],
        missingSkills: missingSkills || [],
        resumeSkills: resume.skills.map((s) => s.name),
        suggestions: {
          improvements: tailoredSuggestions?.improvements || [],
          strengths: tailoredSuggestions?.strengths || [],
          summary: tailoredSuggestions?.summary || "",
        },
        recommendation: getMatchRecommendation(matchScore),
      },
    });
  } catch (error) {
    console.error("Job match error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalysisResults = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select(
      "fileName candidateName skills atsCheck aiSuggestions jobMatches wordCount lastAnalyzedAt"
    );
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    const skillsByCategory = resume.skills.reduce((acc, skill) => {
      const cat = skill.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill.name);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        candidateName: resume.candidateName,
        wordCount: resume.wordCount,
        lastAnalyzedAt: resume.lastAnalyzedAt,
        skills: { all: resume.skills, byCategory: skillsByCategory, total: resume.skills.length },
        atsCheck: resume.atsCheck,
        aiSuggestions: resume.aiSuggestions,
        jobMatchHistory: resume.jobMatches,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const regenerateSuggestions = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    const aiSuggestions = await generateAISuggestions(resume.rawText, resume.skills, resume.atsCheck);
    resume.aiSuggestions = aiSuggestions;
    resume.lastAnalyzedAt = new Date();
    await resume.save();

    res.json({ success: true, data: { aiSuggestions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMatchRecommendation = (score) => {
  if (score >= 80) return "Excellent match! You are highly qualified for this role.";
  if (score >= 60) return "Good match. Consider highlighting the matching skills prominently.";
  if (score >= 40) return "Moderate match. Address the missing skills before applying.";
  if (score >= 20) return "Low match. Significant skill gaps exist. Consider upskilling first.";
  return "Poor match. This role requires skills substantially different from your profile.";
};

module.exports = { matchJobDescription, getAnalysisResults, regenerateSuggestions };