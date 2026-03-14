import React, { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, ThumbsUp, ArrowRight, RefreshCw, Loader } from "lucide-react";
import { regenerateSuggestions } from "../utils/api";

const AISuggestions = ({ resumeId, suggestions = {}, onRefresh }) => {
  const [regenerating, setRegenerating] = useState(false);
  const { summary, improvements = [], strengths = [], generatedAt, source } = suggestions;

  const handleRegenerate = async () => {
    setRegenerating(true);
    try { await regenerateSuggestions(resumeId); toast.success("Suggestions refreshed!"); if (onRefresh) onRefresh(); }
    catch { toast.error("Failed to regenerate."); }
    finally { setRegenerating(false); }
  };

  if (!summary && !improvements.length && !strengths.length) return (
    <div className="empty-state"><Sparkles size={40} /><p>No suggestions generated yet.</p></div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Sparkles size={13} color="#5e35b1" />
            <span style={{ fontSize: 11, color: "#80868b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              {source === "openai" ? "GPT-3.5 Analysis" : "Smart Analysis"}
            </span>
            {generatedAt && <span style={{ fontSize: 11, color: "#adb0b3" }}>· {new Date(generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
          {summary && (
            <div style={{ padding: "14px 16px", background: "#f5f3ef", border: "1px solid #e4dfd7", borderRadius: 8, borderLeft: "3px solid #5e35b1", fontSize: 14, color: "#1f1f1f", lineHeight: 1.65 }}>
              {summary}
            </div>
          )}
        </div>
        <button className="btn btn-secondary" style={{ marginLeft: 12, flexShrink: 0 }} onClick={handleRegenerate} disabled={regenerating}>
          {regenerating ? <Loader size={14} className="spinner" /> : <RefreshCw size={14} />}
        </button>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={12} />What's Working Well</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {strengths.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "#f0faf3", border: "1px solid rgba(24,128,56,0.15)", borderRadius: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#188038", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#145c2e", lineHeight: 1.6 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div>
          <p className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><ArrowRight size={12} />Recommended Improvements</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {improvements.map((s, i) => (
              <div key={i} className="fade-in" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#fff", border: "1px solid #e4dfd7", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", animationDelay: `${i*0.05}s`, transition: "border-color 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d6a6a"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(45,106,106,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4dfd7"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#e8f2f2", border: "1px solid rgba(45,106,106,0.25)", color: "#2d6a6a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</span>
                <span style={{ fontSize: 13, color: "#444746", lineHeight: 1.65 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
