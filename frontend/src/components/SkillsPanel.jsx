import React, { useState } from "react";
import { Code2, Layers, Wrench, Brain, Globe, MessageSquare } from "lucide-react";

const CATEGORY_META = {
  technical:  { label: "Technical",        icon: <Code2 size={13} />,       color: "#2d6a6a",  bg: "#e8f2f2",  border: "rgba(45,106,106,0.2)" },
  framework:  { label: "Frameworks",       icon: <Layers size={13} />,      color: "#5e35b1",  bg: "#ede7f6",  border: "rgba(94,53,177,0.2)" },
  tool:       { label: "Tools & Platforms",icon: <Wrench size={13} />,      color: "#e37400",  bg: "#fef3e2",  border: "rgba(227,116,0,0.15)" },
  soft:       { label: "Soft Skills",      icon: <Brain size={13} />,       color: "#188038",  bg: "#f0faf3",  border: "rgba(24,128,56,0.15)" },
  language:   { label: "Languages",        icon: <Globe size={13} />,       color: "#1a73e8",  bg: "#e8f0fe",  border: "rgba(26,115,232,0.15)" },
  other:      { label: "Other",            icon: <MessageSquare size={13} />, color: "#80868b", bg: "#f5f3ef",  border: "#e4dfd7" },
};

const SkillsPanel = ({ skills = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const grouped = skills.reduce((acc, s) => { const c = s.category || "other"; if (!acc[c]) acc[c] = []; acc[c].push(s); return acc; }, {});
  const categories = Object.keys(grouped);
  const filtered = activeFilter === "all" ? skills : grouped[activeFilter] || [];

  if (!skills.length) return (
    <div className="empty-state">
      <Code2 size={40} />
      <p>No skills detected in this resume.</p>
      <p style={{ fontSize: 13 }}>Add a dedicated skills section with technical competencies.</p>
    </div>
  );

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {["all", ...categories].map(cat => {
          const meta = cat === "all" ? null : CATEGORY_META[cat];
          const count = cat === "all" ? skills.length : (grouped[cat]?.length || 0);
          const isActive = activeFilter === cat;
          return (
            <button key={cat} onClick={() => setActiveFilter(cat)} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 999,
              border: `1px solid ${isActive ? (meta?.color || "#2d6a6a") : "#e4dfd7"}`,
              background: isActive ? (meta?.bg || "#e8f2f2") : "#fff",
              color: isActive ? (meta?.color || "#2d6a6a") : "#444746",
              fontSize: 13, fontWeight: isActive ? 500 : 400, cursor: "pointer", transition: "all 0.15s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              {meta?.icon}
              {meta?.label || "All"}
              <span style={{ background: isActive ? (meta?.color || "#2d6a6a") : "#f0ede8", color: isActive ? "#fff" : "#80868b", borderRadius: 999, padding: "0 6px", fontSize: 11, fontWeight: 600 }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills */}
      {activeFilter === "all" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {categories.map(cat => {
            const meta = CATEGORY_META[cat] || CATEGORY_META.other;
            return (
              <div key={cat}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, color: meta.color, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {meta.icon}{meta.label} <span style={{ color: "#80868b", fontWeight: 400 }}>({grouped[cat].length})</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {grouped[cat].map(skill => <SkillChip key={skill.name} skill={skill} meta={meta} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {filtered.map(skill => <SkillChip key={skill.name} skill={skill} meta={CATEGORY_META[skill.category] || CATEGORY_META.other} />)}
        </div>
      )}
    </div>
  );
};

const SkillChip = ({ skill, meta }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", padding: "6px 13px",
    borderRadius: 999, background: meta.bg, border: `1px solid ${meta.border}`,
    color: meta.color, fontSize: 13, fontWeight: 500, cursor: "default", transition: "box-shadow 0.15s",
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
  >
    {skill.name}
  </div>
);

export default SkillsPanel;
