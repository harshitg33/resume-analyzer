import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, ArrowRight, Loader, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getAllResumes, deleteResume } from "../utils/api";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchResumes = async (page = 1) => {
    setLoading(true);
    try { const res = await getAllResumes(page); setResumes(res.data.data.resumes); setPagination(res.data.data.pagination); }
    catch { toast.error("Failed to load resumes."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this resume?")) return;
    setDeletingId(id);
    try { await deleteResume(id); setResumes(p => p.filter(r => r._id !== id)); toast.success("Deleted."); }
    catch { toast.error("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const scoreColor = (s) => s >= 80 ? "#188038" : s >= 60 ? "#2d6a6a" : s >= 40 ? "#e37400" : "#c5221f";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 10, color: "#80868b" }}>
      <Loader size={22} className="spinner" color="#2d6a6a" /> Loading...
    </div>
  );

  return (
    <div className="page container fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 3 }}>Resume History</h1>
          <p style={{ color: "#80868b", fontSize: 14 }}>{pagination.total || 0} resume{pagination.total !== 1 ? "s" : ""} analyzed</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/")}><Plus size={14} />New Analysis</button>
      </div>

      {/* Empty */}
      {resumes.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <FileText size={48} />
          <h2 style={{ fontFamily: "Roboto Slab, serif", fontWeight: 600, fontSize: 18 }}>No resumes yet</h2>
          <p>Upload your first resume to get started.</p>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate("/")}><Plus size={14} />Upload Resume</button>
        </div>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 100px", gap: 16, padding: "8px 16px", marginBottom: 4 }}>
            {["Resume", "Skills", "ATS", "Status", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#80868b", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: i > 0 ? "center" : "left" }}>{h}</div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {resumes.map((r, i) => (
              <div key={r._id} className="fade-in" style={{
                display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 100px", gap: 16, alignItems: "center",
                padding: "14px 16px", background: "#fff", border: "1px solid #e4dfd7", borderRadius: 10,
                cursor: "pointer", animationDelay: `${i*0.04}s`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.15s",
              }}
                onClick={() => navigate(`/analysis/${r._id}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d6a6a"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(45,106,106,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4dfd7"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e8f2f2", border: "1px solid rgba(45,106,106,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={16} color="#2d6a6a" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: 14, color: "#1f1f1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{r.candidateName || r.fileName}</p>
                    <p style={{ fontSize: 12, color: "#80868b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.fileName} · {new Date(r.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 16, color: "#5e35b1" }}>{r.skills?.length || 0}</div>
                <div style={{ textAlign: "center", fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 16, color: scoreColor(r.atsCheck?.score || 0) }}>{r.atsCheck?.score || "—"}</div>
                <div style={{ textAlign: "center" }}>
                  <span className={`badge ${r.status === "analyzed" ? "badge-emerald" : "badge-muted"}`}>{r.status}</span>
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-secondary" style={{ padding: "6px 10px" }} onClick={() => navigate(`/analysis/${r._id}`)}><ArrowRight size={13} /></button>
                  <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={e => handleDelete(r._id, e)} disabled={deletingId === r._id}>
                    {deletingId === r._id ? <Loader size={13} className="spinner" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`btn ${p === pagination.page ? "btn-primary" : "btn-secondary"}`} style={{ padding: "7px 14px" }} onClick={() => fetchResumes(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
