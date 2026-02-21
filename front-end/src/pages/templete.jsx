import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useResume from "./resumecontext";
import { TEMPLATES } from "../templates";
import "./templete.css";

function TemplatePreview({ id, color, accent }) {
  const style = { "--primary": color, "--accent": accent };
  return (
    <div className={`preview preview-${id}`} style={style}>
      <div className="preview-decor" />
      <span className="p1" />
      <div className="preview-row">
        <span className="p2" />
        <span className="p3" />
      </div>
      <span className="p4" />
      <span className="p5" />
      <div className="preview-group">
        <span className="p6" />
        <span className="p7" />
        <span className="p8" />
      </div>
    </div>
  );
}

const BADGES = {
  executive: "⭐ Elite",
  professional: "🏆 Featured",
  classic: "💎 Heritage",
  modern: "✨ Modern",
  corporate: "🏢 Business",
  luxe: "👑 Gold",
  minimal: "🌑 Pure",
  tech: "💻 Matrix",
  creative: "🎨 Trendy",
  startup: "🌱 Fresh",
  serenity: "🧘 Calm",
  sunset: "🌅 Vibrant",
};

const CATEGORIES = ["All", "Featured", "Professional", "Creative", "Modern", "Minimal"];

const TEMPLATE_CATEGORIES = {
  executive: "Featured",
  professional: "Featured",
  classic: "Featured",
  modern: "Featured",
  corporate: "Featured",
  luxe: "Featured",
  minimal: "Featured",
  tech: "Featured",
  academic: "Professional",
  clean: "Minimal",
  bold: "Modern",
  elegant: "Creative",
  contemporary: "Modern",
  corporate: "Professional",
  minimalist: "Minimal",
  stylish: "Creative",
  tech: "Modern",
  luxe: "Professional",
  ocean: "Professional",
  sunset: "Professional",
  monochrome: "Minimal",
  startup: "Creative",
  editorial: "Modern",
  serenity: "Minimal",
};

export default function TemplateSelect() {
  const { setTemplate } = useResume();
  const [selectedId, setSelectedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const select = (id) => {
    setSelectedId(id);
    setTemplate(id);
  };

  const filteredTemplates = activeFilter === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => TEMPLATE_CATEGORIES[t.id] === activeFilter);

  return (
    <div className="template-page">
      <nav className="top-nav">
        <div className="nav-logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">ResumePro</span>
        </div>
        <button className="login-btn" onClick={() => navigate("/login")}>
          <span>Sign In</span>
          <span className="btn-icon">👤</span>
        </button>
      </nav>

      <div className="template-header">
        <h1 className="animate-text-glow">Choose Your Resume Style</h1>
        <p className="subtitle">Select a template that matches your career goals</p>

        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="template-grid-container">
        {activeFilter === "All" && (
          <div className="section-label-wrapper">
            <h2 className="section-label">Top Tier Professional Designs</h2>
            <div className="label-line"></div>
          </div>
        )}

        <div className="template-grid">
          {filteredTemplates.map((t, index) => {
            const isFeatured = index < 9 && activeFilter === "All";
            return (
              <div
                key={t.id}
                className={`template-card ${selectedId === t.id ? "selected" : ""} ${isFeatured ? 'featured-premium' : ''}`}
                style={{ "--delay": `${index * 0.05}s` }}
                onClick={() => select(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && select(t.id)}
              >
                {isFeatured && <div className="premium-label">PRO DESIGN</div>}
                {BADGES[t.id] && <span className="card-badge">{BADGES[t.id]}</span>}
                <div className="card-inner">
                  <TemplatePreview id={t.id} color={t.color} accent={t.accent} />
                  <div className="card-info">
                    <span className="template-name">{t.name}</span>
                    <div className="color-dots">
                      <span style={{ background: t.color }} title="Primary Color" />
                      <span style={{ background: t.accent }} title="Accent Color" />
                    </div>
                  </div>
                </div>
                {selectedId === t.id && <div className="selected-check">✓ Selected</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="btn-container bottom-sticky">
        {selectedId ? (
          <button className="template-next-btn animate-in" onClick={() => navigate("/form")}>
            Continue with {TEMPLATES.find((t) => t.id === selectedId)?.name} →
          </button>
        ) : (
          <p className="selection-hint">Choose a style to continue</p>
        )}
      </div>
    </div>
  );
}
