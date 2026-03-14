/**
 * utils/skillExtractor.js
 * Detects and categorizes skills from resume text using a comprehensive keyword database
 * No external API required - pure pattern matching approach
 */

// ─── Skill Database ───────────────────────────────────────────────────────────
// Organized by category for easy extensibility
const SKILL_DATABASE = {
  // Programming Languages
  programmingLanguages: {
    category: "technical",
    skills: [
      "javascript", "typescript", "python", "java", "c++", "c#", "c", "go", "golang",
      "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl",
      "bash", "shell", "powershell", "objective-c", "dart", "elixir", "haskell",
      "lua", "groovy", "cobol", "fortran", "assembly",
    ],
  },

  // Frontend Frameworks & Libraries
  frontend: {
    category: "framework",
    skills: [
      "react", "react.js", "reactjs", "angular", "angularjs", "vue", "vue.js", "vuejs",
      "next.js", "nextjs", "nuxt", "svelte", "gatsby", "remix", "html", "css",
      "html5", "css3", "sass", "scss", "less", "bootstrap", "tailwind", "tailwindcss",
      "material-ui", "mui", "chakra ui", "styled-components", "webpack", "vite",
      "parcel", "jquery", "redux", "zustand", "mobx", "graphql", "apollo",
    ],
  },

  // Backend Frameworks
  backend: {
    category: "framework",
    skills: [
      "node.js", "nodejs", "express", "express.js", "fastapi", "flask", "django",
      "spring", "spring boot", "laravel", "rails", "ruby on rails", "asp.net",
      ".net", "dotnet", "gin", "fiber", "nestjs", "nest.js", "koa", "hapi",
      "fastify", "strapi", "prisma", "sequelize", "hibernate",
    ],
  },

  // Databases
  databases: {
    category: "tool",
    skills: [
      "mongodb", "mysql", "postgresql", "postgres", "sqlite", "oracle", "mssql",
      "sql server", "redis", "cassandra", "dynamodb", "firebase", "supabase",
      "elasticsearch", "neo4j", "mariadb", "couchdb", "influxdb", "cockroachdb",
      "sql", "nosql", "graphql",
    ],
  },

  // Cloud & DevOps
  cloudDevOps: {
    category: "tool",
    skills: [
      "aws", "amazon web services", "azure", "google cloud", "gcp", "docker",
      "kubernetes", "k8s", "jenkins", "github actions", "gitlab ci", "circleci",
      "travis ci", "terraform", "ansible", "chef", "puppet", "nginx", "apache",
      "linux", "unix", "ubuntu", "centos", "debian", "bash scripting",
      "ci/cd", "devops", "microservices", "serverless", "lambda", "ec2", "s3",
      "heroku", "vercel", "netlify", "digitalocean",
    ],
  },

  // AI / ML / Data Science
  aiMl: {
    category: "technical",
    skills: [
      "machine learning", "deep learning", "artificial intelligence", "ai", "ml",
      "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "pandas",
      "numpy", "matplotlib", "seaborn", "opencv", "nlp", "natural language processing",
      "computer vision", "neural networks", "reinforcement learning", "data science",
      "data analysis", "data visualization", "tableau", "power bi", "hadoop",
      "spark", "kafka", "airflow", "mlflow", "jupyter", "hugging face",
    ],
  },

  // Mobile Development
  mobile: {
    category: "framework",
    skills: [
      "react native", "flutter", "android", "ios", "swift", "kotlin",
      "xamarin", "ionic", "cordova", "expo",
    ],
  },

  // Version Control & Collaboration
  tools: {
    category: "tool",
    skills: [
      "git", "github", "gitlab", "bitbucket", "jira", "confluence", "trello",
      "asana", "notion", "figma", "sketch", "adobe xd", "postman", "insomnia",
      "vs code", "visual studio", "intellij", "eclipse", "vim", "neovim",
    ],
  },

  // Soft Skills
  softSkills: {
    category: "soft",
    skills: [
      "leadership", "communication", "teamwork", "problem solving", "critical thinking",
      "time management", "project management", "agile", "scrum", "kanban",
      "mentoring", "collaboration", "adaptability", "creativity", "analytical",
      "detail-oriented", "self-motivated", "fast learner",
    ],
  },

  // Languages (spoken)
  languages: {
    category: "language",
    skills: [
      "english", "spanish", "french", "german", "mandarin", "chinese", "japanese",
      "arabic", "portuguese", "hindi", "russian", "italian", "korean",
    ],
  },
};

/**
 * Extracts skills from resume text by matching against the skill database
 * @param {string} text - Raw resume text
 * @returns {Array<{name: string, category: string, confidence: number}>}
 */
const extractSkills = (text) => {
  const normalizedText = text.toLowerCase();
  const detectedSkills = new Map(); // Use Map to avoid duplicates

  for (const [groupName, group] of Object.entries(SKILL_DATABASE)) {
    for (const skill of group.skills) {
      // Use word boundary matching for accurate detection
      // e.g., "r" should not match "react"
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedSkill}\\b`, "gi");

      if (regex.test(normalizedText)) {
        // Use the canonical (lowercase) form as key to prevent case-variant duplicates
        const canonicalName = skill.toLowerCase();

        if (!detectedSkills.has(canonicalName)) {
          // Calculate confidence: more occurrences = slightly higher confidence
          const matches = normalizedText.match(regex) || [];
          const confidence = Math.min(0.95, 0.7 + matches.length * 0.05);

          detectedSkills.set(canonicalName, {
            name: formatSkillName(skill), // Proper display casing
            category: group.category,
            confidence: Math.round(confidence * 100) / 100,
          });
        }
      }
    }
  }

  // Sort by category then alphabetically
  return Array.from(detectedSkills.values()).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
};

/**
 * Formats a skill name for display (proper casing for known acronyms)
 */
const formatSkillName = (skill) => {
  const uppercaseAcronyms = [
    "sql", "nosql", "html", "css", "api", "rest", "graphql", "aws", "gcp",
    "ci/cd", "ui", "ux", "ai", "ml", "nlp", "ios", "php",
  ];

  const knownCasings = {
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "reactjs": "React.js",
    "react.js": "React.js",
    "vue.js": "Vue.js",
    "vuejs": "Vue.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "mongodb": "MongoDB",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "github": "GitHub",
    "gitlab": "GitLab",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "scikit-learn": "Scikit-learn",
    "c++": "C++",
    "c#": "C#",
    "asp.net": "ASP.NET",
  };

  const lower = skill.toLowerCase();
  if (knownCasings[lower]) return knownCasings[lower];
  if (uppercaseAcronyms.includes(lower)) return skill.toUpperCase();

  // Title case as fallback
  return skill.split(" ").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
};

/**
 * Checks which skills from a job description are missing in the resume
 * @param {Array} resumeSkills - Skills detected in the resume
 * @param {string} jobDescriptionText - Raw job description text
 * @returns {{ matchedSkills: string[], missingSkills: string[], matchScore: number }}
 */
const compareWithJobDescription = (resumeSkills, jobDescriptionText) => {
  // Extract skills from job description using the same engine
  const jobSkills = extractSkills(jobDescriptionText);
  const resumeSkillNames = resumeSkills.map((s) => s.name.toLowerCase());

  const matchedSkills = [];
  const missingSkills = [];

  for (const jobSkill of jobSkills) {
    const skillLower = jobSkill.name.toLowerCase();
    if (resumeSkillNames.some((rs) => rs.includes(skillLower) || skillLower.includes(rs))) {
      matchedSkills.push(jobSkill.name);
    } else {
      missingSkills.push(jobSkill.name);
    }
  }

  // Score: percentage of job skills covered, with a minimum of 0
  const totalJobSkills = jobSkills.length;
  const matchScore = totalJobSkills > 0
    ? Math.round((matchedSkills.length / totalJobSkills) * 100)
    : 0;

  return { matchedSkills, missingSkills, matchScore, totalJobSkills };
};

module.exports = { extractSkills, compareWithJobDescription, SKILL_DATABASE };
