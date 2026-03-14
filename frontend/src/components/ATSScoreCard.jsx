import React, { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Shield } from "lucide-react";

const getScoreStyle = (score) => {
  if (score >= 85) return { color: "#188038", label: "Excellent", bg: "#f0faf3", border: "rgba(24,128,56,0.15)" };
  if (score >= 70) return { color: "#2d6a6a", label: "Good", bg: "#e8f2f2", border: "rgba(45,106,106,0.2)" };
  if (score >= 50) return { color: "#e37400", label: "Fair", bg: "#fef3e2", border: "rgba(227,116,0,0.15)" };
  return { color: "#c5221f", label: "Poor", bg: "#fce8e6", border: "rgba(197,34,31,0.15)" };
};

const ATSScoreCard = ({ atsCheck = {} }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { score=0, hasContactInfo, hasWorkExperience, hasEducation, hasSkillsSection, hasMeasurableAchievements, wordCount=0, issues=[], suggestions=[], grade="F" } = atsCheck;
  const ss = getScoreStyle(score);

  const items = [
    { label: "Contact information", passed: hasContactInfo },
    { label: "Work experience section", passed: hasWorkExperience },
    { label: "Education section", passed: hasEducation },
    { label: "Skills section", passed: hasSkillsSection },
    { label: "Quantifiable achievements", passed: hasMeasurableAchievements },
    { label: `Word count (${wordCount} words)`, passed: wordCount >= 200 && wordCount <= 1200 },
  ];
  const passCount = items.filter(i => i.passed).length;

  return (
    <div>
      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, padding: 20, background: ss.bg, border: `1px solid ${ss.border}`, borderRadius: 12 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={88} height={88} viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="#e4dfd7" strokeWidth="7" />
            <circle cx="44" cy="44" r="36" fill="none" stroke={ss.color} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={`${(score/100)*226.2} 226.2`} transform="rotate(-90 44 44)" style={{ transition: "stroke-dasharray 1s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 22, color: ss.color, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 10, color: "#80868b", marginTop: 1 }}>/ 100</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Shield size={15} color={ss.color} />
            <span style={{ fontFamily: "Roboto Slab, serif", fontWeight: 600, fontSize: 16 }}>ATS Compatibility</span>
            <span style={{ padding: "2px 10px", borderRadius: 999, background: "#fff", color: ss.color, fontSize: 12, fontWeight: 600, border: `1px solid ${ss.border}` }}>
              {ss.label} · Grade {grade}
            </span>
          </div>
          <p style={{ color: "#444746", fontSize: 13, marginBottom: 10 }}>{passCount}/{items.length} criteria passed</p>
          <div style={{ display: "flex", gap: 4 }}>
            {items.map((item, i) => (
              <div key={i} title={item.label} style={{ flex: 1, height: 5, borderRadius: 3, background: item.passed ? ss.color : "#e4dfd7", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
            borderRadius: 8, background: item.passed ? "#f0faf3" : "#fce8e6",
            border: `1px solid ${item.passed ? "rgba(24,128,56,0.15)" : "rgba(197,34,31,0.15)"}`,
          }}>
            {item.passed ? <CheckCircle size={15} color="#188038" /> : <XCircle size={15} color="#c5221f" />}
            <span style={{ fontSize: 13, color: item.passed ? "#145c2e" : "#8b1512" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Suggestions toggle */}
      {suggestions.length > 0 && (
        <>
          <button onClick={() => setShowDetails(!showDetails)} style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
            color: "#444746", cursor: "pointer", fontSize: 13, padding: "4px 0", marginBottom: showDetails ? 10 : 0,
          }}>
            {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {issues.length} issue{issues.length !== 1 ? "s" : ""} found — view suggestions
          </button>
          {showDetails && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suggestions.map((s, i) => (
                <div key={i} className="info-box info-box-orange">→ {s}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ATSScoreCard;
