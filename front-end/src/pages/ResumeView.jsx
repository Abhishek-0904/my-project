import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useResume from "./resumecontext";
import ResumePreview from "../components/ResumePreview";
import html2pdf from "html2pdf.js";
import confetti from "canvas-confetti";
import LZString from "lz-string";
import "./ResumeView.css";

export default function ResumeView() {
  const { template: contextTemplate, resumeData: contextData } = useResume();
  const navigate = useNavigate();
  const location = useLocation();
  const resumeRef = useRef();

  const [sharedData, setSharedData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const zshared = params.get("zshared");
    const shared = params.get("shared");
    const id = params.get("id");

    if (id) {
      // Fetch public resume from backend
      fetch(`http://localhost:5000/api/resumes/public/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.message) {
            setSharedData(data);
          }
        })
        .catch(err => console.error("Failed to fetch public resume:", err));
    } else if (zshared) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(zshared);
        if (decompressed) {
          setSharedData(JSON.parse(decompressed));
        }
      } catch (err) {
        console.error("Failed to decode compressed resume:", err);
      }
    } else if (shared) {
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

  const handleDownload = async () => {
    const element = resumeRef.current;
    if (!element || isDownloading) return;

    setIsDownloading(true);
    fireConfetti();

    // Scroll to top to ensure clean capture offset
    window.scrollTo(0, 0);

    const opt = {
      margin: 0,
      filename: `${resumeData?.name?.toString().replace(/\s+/g, '_') || "Resume"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200, // Force a desktop-like width for the capture
        onclone: (doc) => {
          // 1. Create a global 'print' style in the cloned document
          const style = doc.createElement('style');
          style.innerHTML = `
            /* Kill animations and force visibility */
            * { 
              animation: none !important; 
              transition: none !important; 
              transform: none !important;
              opacity: 1 !important; 
              visibility: visible !important;
            }

            /* Fix Section Headers to be high contrast in PDF */
            .resume-preview h3 {
              color: var(--primary, #1e293b) !important;
              font-size: var(--section-title-size, 1.1rem) !important;
              font-weight: var(--section-title-weight, 700) !important;
              border-bottom: 2px solid var(--primary, #1e293b) !important;
              background: transparent !important;
              padding-bottom: 4px !important;
              margin-bottom: var(--section-spacing, 12px) !important;
            }

            /* Layout cleanup for A4 */
            .resume-preview { 
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: var(--page-padding, 40px) !important;
              background: white !important;
              display: block !important;
              position: relative !important;
              box-shadow: none !important;
              font-family: var(--font-family, serif) !important;
              font-size: var(--base-font-size, 14px) !important;
              line-height: var(--line-height, 1.5) !important;
            }

            .resume-preview h1 {
              font-size: var(--header-name-size, 2.8rem) !important;
              color: var(--header-color, var(--primary)) !important;
            }

            .resume-preview .resume-title {
              font-size: var(--header-title-size, 1.1rem) !important;
            }

            .resume-preview .resume-summary-text {
              font-size: var(--summary-font-size, 14px) !important;
              line-height: var(--summary-line-height, 1.6) !important;
              font-style: var(--summary-font-style, normal) !important;
            }

            .resume-preview .item-description {
              font-size: var(--section-body-size, 13px) !important;
            }

            /* Ensure all text stays sharp */
            p, span, div, li, strong {
              color: #1a202c;
            }

            /* Headers on dark backgrounds */
            .resume-header-bar, .resume-sidebar, .resume-tech-header, .resume-special-header {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color: white !important;
            }

            .resume-header-bar h1, .resume-sidebar h1, .resume-tech-header h1, .resume-special-header h1 {
              color: white !important;
              -webkit-text-fill-color: white !important;
            }

            .resume-preview::after { display: none !important; }
            
            .resume-qr-code {
              display: flex !important;
              border: 1px solid #ddd !important;
              background: white !important;
            }
          `;
          doc.head.appendChild(style);

          // 2. Mirror Canvas content manually in the clone
          const originalPreview = element.querySelector('.resume-preview') || element;
          const clonedPreview = doc.querySelector('.resume-preview') || doc.body;

          const originalCanvases = originalPreview.querySelectorAll('canvas');
          const clonedCanvases = clonedPreview.querySelectorAll('canvas');

          originalCanvases.forEach((canvas, i) => {
            if (clonedCanvases[i]) {
              const destCtx = clonedCanvases[i].getContext('2d');
              destCtx.drawImage(canvas, 0, 0);
            }
          });
        }
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    };

    // Delay slightly to allow the 'Generating PDF' state to render
    setTimeout(async () => {
      try {
        const previewElement = element.querySelector('.resume-preview') || element;
        await html2pdf().set(opt).from(previewElement).save();
      } catch (err) {
        console.error("PDF download failed:", err);
        alert("PDF generation failed. Check for large images or try another browser.");
      } finally {
        setIsDownloading(false);
      }
    }, 600);
  };

  if (!template) return null;

  return (
    <div className={`resume-view-page theme-${template}`}>
      <div className="resume-view-actions">
        <button className="back-to-form-btn" onClick={() => navigate("/form")} disabled={isDownloading}>
          ← Back to Edit
        </button>
        <button className={`download-pdf-btn ${isDownloading ? 'loading' : ''}`} onClick={handleDownload} disabled={isDownloading}>
          <span>{isDownloading ? "Generating PDF..." : "Download PDF"}</span>
          {!isDownloading && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          {isDownloading && <span className="download-spinner"></span>}
        </button>
      </div>
      <div className="resume-view-container">
        <div ref={resumeRef}>
          <ResumePreview
            template={template}
            data={resumeData}
            fullPage
            customColorsOverride={sharedData?.customColors || {}}
            selectedGradientOverride={sharedData?.gradient || "none"}
          />
        </div>
      </div>
    </div>
  );
}
