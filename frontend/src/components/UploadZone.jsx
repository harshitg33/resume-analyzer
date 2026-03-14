import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Upload, FileText, AlertCircle, CheckCircle, Loader, Zap } from "lucide-react";
import { uploadResume } from "../utils/api";

const UploadZone = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [stage, setStage] = useState("idle");

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) { toast.error("Invalid file. Please upload PDF or DOCX."); return; }
    if (accepted.length > 0) { setSelectedFile(accepted[0]); setStage("idle"); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true); setStage("uploading"); setProgress(0);
    try {
      const res = await uploadResume(selectedFile, (pct) => {
        setProgress(pct);
        if (pct === 100) setStage("processing");
      });
      setStage("done");
      toast.success("Resume analyzed!");
      setTimeout(() => navigate(`/analysis/${res.data.data.resumeId}`), 700);
    } catch (err) {
      setStage("error"); setUploading(false);
      toast.error(err.message || "Upload failed.");
    }
  };

  const fmt = (b) => b < 1024*1024 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024/1024).toFixed(1)} MB`;

  return (
    <div>
      {/* Dropzone */}
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? "#2d6a6a" : selectedFile ? "#1a73e8" : "#d6d0c8"}`,
        borderRadius: 10, padding: "36px 24px", textAlign: "center", cursor: "pointer",
        background: isDragActive ? "#e8f2f2" : selectedFile ? "#e8f0fe" : "#faf9f7",
        transition: "all 0.2s",
      }}>
        <input {...getInputProps()} />
        {selectedFile ? (
          <>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e8f0fe", border: "1px solid rgba(26,115,232,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <FileText size={22} color="#1a73e8" />
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#1f1f1f", marginBottom: 3 }}>{selectedFile.name}</p>
            <p style={{ color: "#80868b", fontSize: 13 }}>{fmt(selectedFile.size)} · Click to change</p>
          </>
        ) : (
          <>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0ede8", border: "1px solid #d6d0c8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Upload size={22} color={isDragActive ? "#2d6a6a" : "#80868b"} />
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, color: isDragActive ? "#2d6a6a" : "#1f1f1f", marginBottom: 6 }}>
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
            </p>
            <p style={{ color: "#80868b", fontSize: 13, marginBottom: 14 }}>or click to browse files</p>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              <span className="badge badge-muted">PDF</span>
              <span className="badge badge-muted">DOCX</span>
              <span className="badge badge-muted">Max 10MB</span>
            </div>
          </>
        )}
      </div>

      {/* Progress */}
      {uploading && (
        <div style={{ marginTop: 14 }} className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#444746", display: "flex", alignItems: "center", gap: 6 }}>
              {stage === "done" ? <CheckCircle size={13} color="#188038" /> : <Loader size={13} className="spinner" color="#2d6a6a" />}
              {stage === "uploading" ? "Uploading..." : stage === "processing" ? "Analyzing resume..." : stage === "done" ? "Done!" : ""}
            </span>
            <span style={{ fontSize: 13, color: "#80868b" }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${stage === "processing" || stage === "done" ? 100 : progress}%`,
              background: stage === "done" ? "#188038" : "#2d6a6a",
            }} />
          </div>
          {stage === "processing" && (
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Parsing text","Detecting skills","ATS check","AI analysis"].map((s,i) => (
                <span key={i} className="badge badge-cyan">{s}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {stage === "error" && (
        <div className="info-box info-box-red fade-in" style={{ marginTop: 12 }}>
          <AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
          Upload failed. Check the file and try again.
        </div>
      )}

      {/* Button */}
      {selectedFile && !uploading && (
        <button className="btn btn-primary btn-lg fade-in" style={{ width: "100%", marginTop: 14, justifyContent: "center" }} onClick={handleUpload}>
          <Zap size={15} /> Analyze Resume
        </button>
      )}
    </div>
  );
};

export default UploadZone;
