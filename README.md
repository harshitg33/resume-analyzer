# ResumeIQ — AI Resume Analyzer

A production-grade full-stack application built with the MERN stack that analyzes resumes for skills, ATS compatibility, job description matching, and AI-powered improvement suggestions.

---

## 📁 Project Structure

```
resume-analyzer/
├── backend/
│   ├── controllers/
│   │   ├── resumeController.js      # Upload, parse, retrieve resumes
│   │   └── analysisController.js    # Job matching, results, AI regen
│   ├── middleware/
│   │   └── upload.js                # Multer file upload + validation
│   ├── models/
│   │   └── Resume.js                # Mongoose schema
│   ├── routes/
│   │   ├── resumeRoutes.js          # /api/resumes/*
│   │   └── analysisRoutes.js        # /api/analysis/*
│   ├── utils/
│   │   ├── resumeParser.js          # PDF/DOCX text extraction
│   │   ├── skillExtractor.js        # Skill detection + job matching
│   │   ├── atsChecker.js            # ATS compatibility scoring
│   │   └── aiService.js             # OpenAI integration + fallback
│   ├── uploads/                     # Uploaded resume files (gitignored)
│   ├── server.js                    # Express app entry point
│   ├── .env.example                 # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation
│   │   │   ├── UploadZone.jsx       # Drag-and-drop file upload
│   │   │   ├── SkillsPanel.jsx      # Skill grid with category filters
│   │   │   ├── ATSScoreCard.jsx     # ATS score + checklist
│   │   │   ├── JobMatcher.jsx       # Job description input + match results
│   │   │   └── AISuggestions.jsx    # AI improvement suggestions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Landing page with upload
│   │   │   ├── AnalysisPage.jsx     # Full analysis dashboard (tabbed)
│   │   │   └── HistoryPage.jsx      # All uploaded resumes
│   │   ├── utils/
│   │   │   └── api.js               # Axios instance + API functions
│   │   ├── App.js                   # Router setup
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   └── package.json
│
├── package.json                     # Root scripts (concurrently)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repo-url>
cd resume-analyzer
npm run install:all
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
OPENAI_API_KEY=sk-your-key-here    # Optional — falls back to rule-based
```

### 3. Start Development Servers
From the project root:
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🔌 API Reference

### Resume Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload and analyze a resume |
| GET | `/api/resumes` | List all resumes (paginated) |
| GET | `/api/resumes/:id` | Get resume summary |
| DELETE | `/api/resumes/:id` | Delete resume + file |

### Analysis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analysis/:id/results` | Full analysis results |
| POST | `/api/analysis/:id/match-job` | Match against job description |
| POST | `/api/analysis/:id/regenerate` | Re-run AI suggestions |

### Upload Request
```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -F "resume=@/path/to/your-resume.pdf"
```

### Job Match Request
```bash
curl -X POST http://localhost:5000/api/analysis/:id/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Senior React Developer",
    "jobDescription": "We are looking for a React developer with 3+ years experience in TypeScript, Node.js, MongoDB..."
  }'
```

---

## 📊 Example Analysis Output

```json
{
  "resumeId": "65a1b2c3d4e5f6789...",
  "fileName": "john-doe-resume.pdf",
  "candidateName": "John Doe",
  "wordCount": 487,
  "skills": {
    "total": 23,
    "byCategory": {
      "technical": ["JavaScript", "TypeScript", "Python"],
      "framework": ["React.js", "Node.js", "Express"],
      "tool": ["Git", "Docker", "MongoDB", "AWS"],
      "soft": ["Leadership", "Agile", "Communication"]
    }
  },
  "atsCheck": {
    "score": 78,
    "grade": "B",
    "hasContactInfo": true,
    "hasWorkExperience": true,
    "hasEducation": true,
    "hasSkillsSection": true,
    "hasMeasurableAchievements": false,
    "wordCount": 487,
    "issues": ["No quantified achievements found."],
    "suggestions": ["Add measurable results like 'Reduced load time by 40%'"]
  },
  "aiSuggestions": {
    "summary": "Strong technical resume with good ATS structure, but missing impact metrics.",
    "strengths": [
      "Impressive skill set covering both frontend and backend.",
      "Clear section structure improves ATS readability."
    ],
    "improvements": [
      "Add measurable achievements to each role (e.g., 'Reduced API latency by 35%').",
      "Include a LinkedIn and GitHub profile URL.",
      "Add a concise professional summary at the top.",
      "Quantify team sizes and project scales.",
      "Tailor the skills section to match target job descriptions."
    ]
  }
}
```

---

## ⚙️ Configuration Options

### OpenAI Integration
Without an API key, the app uses a built-in rule-based suggestion engine that provides good quality feedback. To enable GPT suggestions, add your key to `.env`:
```
OPENAI_API_KEY=sk-...
```

### File Upload Limits
Configurable in `.env`:
```
MAX_FILE_SIZE=10mb
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios, react-dropzone |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| File Parsing | pdf-parse (PDF), mammoth (DOCX) |
| AI | OpenAI GPT-3.5 (with rule-based fallback) |
| Styling | Custom CSS with CSS variables |
| Upload | Multer |
| Security | Helmet, CORS |

---

## 📦 Production Deployment

### Backend (Railway / Render)
1. Set all environment variables in the platform dashboard
2. Set build command: `npm install`
3. Set start command: `npm start`

### Frontend (Vercel / Netlify)
1. Build command: `npm run build`
2. Set `REACT_APP_API_URL=https://your-backend-url.com/api`

---

## 🔒 Security Notes

- Uploaded files are validated by MIME type and extension
- File size is capped at 10MB
- File names are sanitized and prefixed with UUID
- Helmet sets secure HTTP headers
- CORS is restricted to the configured client origin

---

## 📝 License

MIT
