import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useResume from "./resumecontext";
import ResumePreview from "../components/ResumePreview";
import html2pdf from "html2pdf.js";
import confetti from "canvas-confetti";
import "./ResumeView.css";

export default function ResumeView() {
  const { template: contextTemplate, resumeData: contextData } = useResume();
  const navigate = useNavigate();
  const location = useLocation();
  const resumeRef = useRef();

  const [sharedData, setSharedData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shared = params.get("shared");
    if (shared) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(shared)));
        setSharedData(decoded);
      } catch (err) {
        console.error("Failed to decode shared resume:", err);
      }
    }
  }, [location]);

  const template = sharedData ? sharedData.template : contextTemplate;
  const resumeData = sharedData ? sharedData.data : contextData;

  useEffect(() => {
    if (!template && !sharedData) {
      navigate("/");
    }
  }, [template, navigate, sharedData]);

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#eab308', '#ec4899']
    });
  };

  const handleDownload = () => {
    const element = resumeRef.current;
    fireConfetti();

    // Modern options for high quality PDF
    const opt = {
      margin: 0,
      filename: `${resumeData.name || "Resume"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
  };

  if (!template) return null;

  return (
    <div className={`resume-view-page theme-${template}`}>
      <div className="resume-view-actions">
        <button className="back-to-form-btn" onClick={() => navigate("/form")}>
          ← Back to Edit
        </button>
        <button className="download-pdf-btn" onClick={handleDownload}>
          <span>Download PDF</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
      <div className="resume-view-container" ref={resumeRef}>
        <ResumePreview template={template} data={resumeData} fullPage />
      </div>
    </div>
  );
}
