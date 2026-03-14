/**
 * utils/api.js
 * Centralized Axios instance for all API calls to the backend
 */

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 60000, // 60s timeout for large file uploads & AI calls
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    console.error("[API Error]", message);
    return Promise.reject(new Error(message));
  }
);

// ─── Resume API Calls ─────────────────────────────────────────────────────────

export const uploadResume = (file, onProgress) => {
  const formData = new FormData();
  formData.append("resume", file);

  return API.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
};

export const getResume = (id) => API.get(`/resumes/${id}`);

export const getAllResumes = (page = 1) => API.get(`/resumes?page=${page}&limit=10`);

export const deleteResume = (id) => API.delete(`/resumes/${id}`);

// ─── Analysis API Calls ───────────────────────────────────────────────────────

export const getAnalysisResults = (id) => API.get(`/analysis/${id}/results`);

export const matchJobDescription = (id, jobTitle, jobDescription) =>
  API.post(`/analysis/${id}/match-job`, { jobTitle, jobDescription });

export const regenerateSuggestions = (id) =>
  API.post(`/analysis/${id}/regenerate`);

export default API;
