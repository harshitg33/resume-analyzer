import React from "react";
import UploadZone from "../components/UploadZone";
import { CheckCircle, Shield, Target, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: <CheckCircle size={20} color="#188038" />, title: "Skill Extraction", desc: "Detects 200+ technical & soft skills automatically.", bg: "#f0faf3", border: "rgba(24,128,56,0.15)" },
  { icon: <Shield size={20} color="#2d6a6a" />, title: "ATS Check", desc: "Score your resume against real ATS criteria.", bg: "#e8f2f2", border: "rgba(45,106,106,0.2)" },
  { icon: <Target size={20} color="#1a73e8" />, title: "Job Matching", desc: "Paste any job description for an instant fit score.", bg: "#e8f0fe", border: "rgba(26,115,232,0.15)" },
  { icon: <Sparkles size={20} color="#e37400" />, title: "AI Suggestions", desc: "Get GPT-powered tips to improve your resume.", bg: "#fef3e2", border: "rgba(227,116,0,0.15)" },
];

const HomePage = () => (
  <div className="page container fade-in">
    {/* Hero */}
    <div style={{ textAlign: "center", marginBottom: 48, paddingTop: 12 }}>
      <span style={{
        display: "inline-block", padding: "4px 14px", borderRadius: 999,
        background: "#e8f2f2", color: "#2d6a6a", fontSize: 12,
        fontWeight: 500, marginBottom: 18, border: "1px solid rgba(45,106,106,0.2)",
      }}>
        AI-Powered Resume Analysis
      </span>
      <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 14, color: "#1f1f1f" }}>
        Get More Interviews with a<br />
        <span style={{ color: "#2d6a6a" }}>Smarter Resume</span>
      </h1>
      <p style={{ color: "#444746", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
        Upload your resume and get instant feedback on skills, ATS compatibility, job fit score, and AI-powered improvements.
      </p>
    </div>

    {/* Upload card */}
    <div style={{ maxWidth: 560, margin: "0 auto 56px" }}>
      <div className="card" style={{ padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#80868b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
          Upload Your Resume
        </p>
        <UploadZone />
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "#adb0b3", marginTop: 10 }}>
        PDF & DOCX supported · Max 10MB · Secure processing
      </p>
    </div>

    {/* Features */}
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <p style={{ textAlign: "center", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#80868b", marginBottom: 24 }}>
        What you'll get
      </p>
      <div className="grid-4">
        {FEATURES.map((f, i) => (
          <div key={i} className="fade-in" style={{
            background: f.bg, border: `1px solid ${f.border}`,
            borderRadius: 12, padding: "20px 18px", textAlign: "center",
            animationDelay: `${i * 0.08}s`,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10, background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}>{f.icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#1f1f1f" }}>{f.title}</h3>
            <p style={{ fontSize: 12, color: "#80868b", lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Stats */}
    <div style={{ maxWidth: 600, margin: "56px auto 0", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
      {[["200+","Skills detected"],["ATS","Compatibility check"],["GPT","AI suggestions"],["Free","No sign-up"]].map(([v, l], i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 22, color: "#2d6a6a" }}>{v}</div>
          <div style={{ fontSize: 12, color: "#80868b", marginTop: 3 }}>{l}</div>
        </div>
      ))}
    </div>
  </div>
);

export default HomePage;
