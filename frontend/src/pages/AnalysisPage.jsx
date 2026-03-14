import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Loader, ArrowLeft, RefreshCw } from "lucide-react";
import SkillsPanel from "../components/SkillsPanel";
import ATSScoreCard from "../components/ATSScoreCard";
import JobMatcher from "../components/JobMatcher";
import AISuggestions from "../components/AISuggestions";
import { getAnalysisResults } from "../utils/api";

const TABS = [
  { id: "skills", label: "Skills" },
  { id: "ats", label: "ATS Check" },
  { id: "job-match", label: "Job Match" },
  { id: "ai", label: "AI Suggestions" },
];

const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("skills");

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try { const res = await getAnalysisResults(id); setData(res.data.data); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 14, color: "#80868b" }}>
      <Loader size={32} className="spinner" color="#2d6a6a" />
      <p style={{ fontFamily: "Roboto Slab, serif", fontWeight: 600, fontSize: 15 }}>Loading analysis...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <p style={{ color: "#c5221f", marginBottom: 16 }}>{error}</p>
      <button className="btn btn-secondary" onClick={() => navigate("/")}><ArrowLeft size={14} /> Back</button>
    </div>
  );

  if (!data) return null;
  const atsScore = data.atsCheck?.score || 0;
  const scoreColor = atsScore >= 80 ? "#188038" : atsScore >= 60 ? "#2d6a6a" : atsScore >= 40 ? "#e37400" : "#c5221f";

  return (
    <div className="page container fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button className="btn btn-secondary" style={{ marginBottom: 14, padding: "6px 12px", fontSize: 13 }} onClick={() => navigate("/")}>
          <ArrowLeft size={13} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#e8f2f2", border: "1px solid rgba(45,106,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={20} color="#2d6a6a" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 3 }}>{data.candidateName || data.fileName}</h1>
              <p style={{ color: "#80868b", fontSize: 13 }}>
                {data.wordCount} words · {data.skills?.total} skills detected · {data.lastAnalyzedAt ? new Date(data.lastAnalyzedAt).toLocaleString() : "Just now"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <StatPill label="Skills" value={data.skills?.total || 0} color="#1a73e8" />
            <StatPill label="ATS Score" value={`${atsScore}/100`} color={scoreColor} />
            <button className="btn btn-secondary" onClick={fetchData} style={{ padding: "8px 10px" }}><RefreshCw size={14} /></button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #e4dfd7" }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "10px 20px", border: "none", background: "none",
            color: activeTab === tab.id ? "#2d6a6a" : "#80868b",
            fontFamily: "Roboto, sans-serif", fontWeight: activeTab === tab.id ? 500 : 400,
            fontSize: 14, cursor: "pointer",
            borderBottom: activeTab === tab.id ? "2px solid #2d6a6a" : "2px solid transparent",
            marginBottom: -1, transition: "all 0.15s",
          }}>
            {tab.label}
            {tab.id === "skills" && data.skills?.total > 0 && (
              <span style={{ marginLeft: 6, background: "#e8f2f2", color: "#2d6a6a", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>
                {data.skills.total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card fade-in" style={{ minHeight: 400 }}>
        {activeTab === "skills" && (<><p className="section-label">Detected Skills</p><SkillsPanel skills={data.skills?.all || []} /></>)}
        {activeTab === "ats" && (<><p className="section-label">ATS Compatibility Report</p><ATSScoreCard atsCheck={data.atsCheck} /></>)}
        {activeTab === "job-match" && (<><p className="section-label">Job Description Matcher</p><JobMatcher resumeId={id} resumeSkills={data.skills?.all || []} /></>)}
        {activeTab === "ai" && (<><p className="section-label">AI-Powered Suggestions</p><AISuggestions resumeId={id} suggestions={data.aiSuggestions} onRefresh={fetchData} /></>)}
      </div>

      {/* Job match history */}
      {data.jobMatchHistory?.length > 0 && activeTab !== "job-match" && (
        <div style={{ marginTop: 20 }}>
          <p className="section-label">Recent Job Matches</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.jobMatchHistory.slice(-3).reverse().map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#fff", border: "1px solid #e4dfd7", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1f1f1f" }}>{m.jobTitle || "Unnamed Position"}</span>
                  <span style={{ fontSize: 12, color: "#80868b", marginLeft: 10 }}>{new Date(m.analysisDate).toLocaleDateString()}</span>
                </div>
                <span style={{ fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 16, color: m.matchScore >= 70 ? "#188038" : m.matchScore >= 40 ? "#e37400" : "#c5221f" }}>
                  {m.matchScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatPill = ({ label, value, color }) => (
  <div style={{ padding: "8px 16px", background: "#fff", border: "1px solid #e4dfd7", borderRadius: 8, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
    <div style={{ fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 18, color }}>{value}</div>
    <div style={{ fontSize: 11, color: "#80868b", marginTop: 1 }}>{label}</div>
  </div>
);

export default AnalysisPage;
