import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, History } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "#ffffff", borderBottom: "1px solid #e4dfd7",
      height: 64, display: "flex", alignItems: "center",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "#2d6a6a", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileText size={17} color="#fff" />
          </div>
          <span style={{ fontFamily: "Roboto Slab, serif", fontWeight: 700, fontSize: 18, color: "#1f1f1f", letterSpacing: "-0.01em" }}>
            ResumeIQ
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavLink to="/" active={isActive("/")} icon={<FileText size={15} />} label="Analyze" />
          <NavLink to="/history" active={isActive("/history")} icon={<History size={15} />} label="History" />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, icon, label }) => (
  <Link to={to} style={{
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 6, textDecoration: "none",
    fontSize: 14, fontWeight: active ? 500 : 400,
    color: active ? "#2d6a6a" : "#444746",
    background: active ? "#e8f2f2" : "transparent",
    transition: "all 0.15s",
  }}>
    {icon}{label}
  </Link>
);

export default Navbar;
