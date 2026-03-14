import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import AnalysisPage from "./pages/AnalysisPage";
import HistoryPage from "./pages/HistoryPage";
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f1f1f",
              border: "1px solid #e4dfd7",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#188038", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#c5221f", secondary: "#fff" } },
          }}
        />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis/:id" element={<AnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
