import React, { useState } from "react";
import toast from "react-hot-toast";
import { Target, Loader, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { matchJobDescription } from "../utils/api";

const getScoreColor = (s) => s >= 75 ? "#188038" : s >= 50 ? "#2d6a6a" : s >= 30 ? "#e37400" : "#c5221f";
const getScoreBg   = (s) => s >= 75 ? "#f0faf3"  : s >= 50 ? "#e8f2f2"  : s >= 30 ? "#fef3e2"  : "#fce8e6";
const getScoreBdr  = (s) => s >= 75 ? "rgba(24,128,56,0.15)" : s >= 50 ? "rgba(45,106,106,0.2)" : s >= 30 ? "rgba(227,116,0,0.15)" : "rgba(197,34,31,0.15)";

const JobMatcher = ({ resumeId }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toast.error("Please enter at least 30 characters.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await matchJobDescription(resumeId, jobTitle, jobDescription);
      setResult(res.data.data);
      toast.success("Job match analysis complete!");
    } catch (err) {
      toast.error(err.message || "Failed to analyze.");
    } finally {
      setLoading(false);
    }
  };

  const matchScore    = result?.matchScore    ?? 0;
  const matchedSkills = result?.matchedSkills ?? [];
  const missingSkills = result?.missingSkills ?? [];
  const improvements  = result?.suggestions?.improvements ?? [];

  return (
    <div>
      <div className="form-group">
        <label>Job Title (optional)</label>
        <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
      </div>
      <div className="form-group">
        <label>Job Description *</label>
        <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." rows={7} style={{ resize: "vertical" }} />
        <span style={{ fontSize: 11, color: "#adb0b3", marginTop: 4, display: "block" }}>{jobDescription.length} characters</span>
      </div>
      <button className="btn btn-primary" onClick={handleMatch} disabled={loading || !jobDescription.trim()} style={{ width: "100%", justifyContent: "center" }}>
        {loading ? <><Loader size={14} className="spinner" />Analyzing...</> : <><Target size={14} />Analyze Job Match</>}
      </button>

      {result && (
        <div className="fade-in" style={{ marginTop: 24 }}>
          <div style={{ padding: 20, borderRadius: 12, background: getScoreBg(matchScore), border: `1px solid ${getScoreBdr(matchScore)}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 40, fontFamily: "Roboto Slab, serif", fontWeight: 700, color: getScoreColor(matchScore), lineHeight: 1 }}>{matchScore}%</div>
              <div style={{ fontSize: 11, color: "#80868b", marginTop: 3 }}>Match Score</div>
            </div>
            <div style={{ flex: 1 }}>
              {result.jobTitle && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Briefcase size={13} color="#80868b" />
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1f1f1f" }}>{result.jobTitle}</span>
                </div>
              )}
              <p style={{ fontSize: 13, color: "#444746", marginBottom: 10 }}>{result.recommendation}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${matchScore}%`, background: getScoreColor(matchScore) }} />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div style={{ padding: 16, background: "#f0faf3", border: "1px solid rgba(24,128,56,0.15)", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "#188038", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <CheckCircle size={13} />Matched ({matchedSkills.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {matchedSkills.length > 0 ? matchedSkills.map(s => <span key={s} className="badge badge-emerald">{s}</span>) : <p style={{ color: "#80868b", fontSize: 13 }}>No matching skills</p>}
              </div>
            </div>
            <div style={{ padding: 16, background: "#fce8e6", border: "1px solid rgba(197,34,31,0.15)", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "#c5221f", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <XCircle size={13} />Missing ({missingSkills.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {missingSkills.length > 0 ? missingSkills.map(s => <span key={s} className="badge badge-rose">{s}</span>) : <p style={{ color: "#188038", fontSize: 13 }}>All required skills present!</p>}
              </div>
            </div>
          </div>

          {improvements.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p className="section-label">Tailored Suggestions</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {improvements.slice(0, 4).map((s, i) => (
                  <div key={i} style={{ padding: "10px 14px", background: "#fff", border: "1px solid #e4dfd7", borderRadius: 8, fontSize: 13, color: "#444746", display: "flex", gap: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <span style={{ color: "#2d6a6a", fontWeight: 600 }}>{i + 1}.</span>{s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobMatcher;