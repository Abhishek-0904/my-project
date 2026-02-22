import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useResume from "./resumecontext";
import { TEMPLATES } from "../templates";
import "./templete.css";

const TEMPLATE_PREVIEW_MAP = {
  vanguard: "executive",
  horizon: "professional",
  apex: "executive",
  stark: "minimal",
  slate: "professional",
  navy: "modern",
  emerald: "clean",
  ruby: "bold",
  indigo: "modern",
  charcoal: "professional",
  platinum: "luxe",
  forest: "clean",
  midnight: "minimal",
  coffee: "classic",
  graphite: "tech",
  royal: "luxe",
  titan: "tech",
  marble: "minimal",
  copper: "classic",
  neon: "creative",
  candy: "creative",
  galaxy: "creative",
  mint: "clean",
  gold: "luxe",
  lavender: "modern",
  sky: "modern",
  lemon: "clean",
  rose: "modern",
  clay: "bold",
  vivid: "creative",
  quartz: "creative",
  obsidian: "minimal",
  aurora: "creative",
  plasma: "creative",
  retro: "creative",
  bamboo: "clean",
  spice: "classic",
  frost: "clean",
  vintage: "academic",
  carbon: "tech",
};

function TemplatePreview({ id, color, accent }) {
  const previewClass = TEMPLATE_PREVIEW_MAP[id] || id;
  const style = { "--primary": color, "--accent": accent };
  return (
    <div className={`preview preview-${previewClass}`} style={style}>
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
  vanguard: "🛡️ Executive",
  horizon: "📡 Elite",
  apex: "🏔️ Peak",
  stark: "🎹 Contrast",
  slate: "🧥 Corporate",
  navy: "⚓ Deep",
  emerald: "🌿 Growth",
  ruby: "💎 Ruby",
  indigo: "🌌 Flow",
  charcoal: "🌫️ Business",
  platinum: "⚪ Platinum",
  forest: "🌲 Manager",
  midnight: "🌑 Noir",
  coffee: "☕ Roast",
  graphite: "✏️ Tech",
  royal: "👑 Crown",
  titan: "🦾 Industrial",
  marble: "🏛️ Marble",
  copper: "⚒️ Craft",
  neon: "⚡ Cyber",
  candy: "🍬 Sweet",
  galaxy: "🛸 Space",
  mint: "🍃 Fresh",
  gold: "💰 Wealth",
  lavender: "🌸 Soft",
  sky: "🌦️ Airy",
  lemon: "🍋 Zest",
  rose: "🥀 Desert",
  clay: "🏺 Clay",
  vivid: "🌈 Pulse",
  quartz: "🔮 Mystic",
  obsidian: "🖤 Dark",
  aurora: "🌌 Borealis",
  plasma: "🧪 Plasma",
  retro: "📻 80s",
  bamboo: "🎍 Zen",
  spice: "🍁 Spice",
  frost: "❄️ Frost",
  vintage: "📜 Old",
  carbon: "🏎️ Race",
};

const CATEGORIES = ["All", "Professional", "Creative", "Modern", "Minimal"];

const TEMPLATE_CATEGORIES = {
  executive: "Professional",
  professional: "Professional",
  classic: "Professional",
  modern: "Modern",
  corporate: "Professional",
  luxe: "Professional",
  minimal: "Minimal",
  tech: "Modern",
  academic: "Professional",
  clean: "Minimal",
  bold: "Modern",
  elegant: "Creative",
  contemporary: "Modern",
  minimalist: "Minimal",
  stylish: "Creative",
  ocean: "Professional",
  sunset: "Professional",
  monochrome: "Minimal",
  startup: "Creative",
  editorial: "Modern",
  serenity: "Minimal",
  vanguard: "Professional",
  horizon: "Professional",
  apex: "Professional",
  stark: "Professional",
  slate: "Professional",
  navy: "Professional",
  emerald: "Professional",
  ruby: "Professional",
  indigo: "Professional",
  charcoal: "Professional",
  platinum: "Professional",
  forest: "Professional",
  midnight: "Professional",
  coffee: "Professional",
  graphite: "Professional",
  royal: "Professional",
  titan: "Professional",
  marble: "Professional",
  copper: "Professional",
  neon: "Creative",
  candy: "Creative",
  galaxy: "Creative",
  mint: "Creative",
  gold: "Creative",
  lavender: "Creative",
  sky: "Creative",
  lemon: "Creative",
  rose: "Creative",
  clay: "Creative",
  vivid: "Creative",
  quartz: "Creative",
  obsidian: "Creative",
  aurora: "Creative",
  plasma: "Creative",
  retro: "Creative",
  bamboo: "Creative",
  spice: "Creative",
  frost: "Creative",
  vintage: "Creative",
  carbon: "Creative",
};

export default function TemplateSelect() {
  const { setTemplate, createNewProfile } = useResume();
  const [selectedId, setSelectedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const select = (id) => {
    setSelectedId(id);
    setTemplate(id);
  };

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesFilter = activeFilter === "All" || TEMPLATE_CATEGORIES[t.id] === activeFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categoriesToShow = activeFilter === "All" && searchQuery === ""
    ? ["Professional", "Creative", "Modern", "Minimal"]
    : [activeFilter];

  return (
    <div className="template-page">
      <nav className="top-nav">
        <div className="nav-logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">ResumePro</span>
        </div>
        {!JSON.parse(localStorage.getItem('user')) ? (
          <button className="login-btn" onClick={() => navigate("/login")}>
            <span>Sign In</span>
            <span className="btn-icon">👤</span>
          </button>
        ) : (
          <button className="login-btn" onClick={() => navigate("/dashboard")}>
            <span>Dashboard</span>
            <span className="btn-icon">🏠</span>
          </button>
        )}
      </nav>

      <div className="template-header">
        <h1 className="animate-text-glow">Premium Design Gallery</h1>
        <p className="subtitle">Discover {TEMPLATES.length} premium resume layouts</p>

        <div className="discovery-tools">
          <div className="search-box-v2">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
      </div>

      <div className="template-gallery-container">
        {categoriesToShow.map((cat) => {
          const tempsInCat = filteredTemplates.filter(t =>
            (activeFilter === "All" && searchQuery === "") ? TEMPLATE_CATEGORIES[t.id] === cat : true
          );
          if (tempsInCat.length === 0) return null;

          return (
            <div key={cat} className="category-section">
              <div className="section-label-wrapper">
                <h2 className="section-label">{cat} Styles</h2>
                <div className="label-line"></div>
              </div>
              <div className="template-grid">
                {tempsInCat.map((t, index) => (
                  <div
                    key={t.id}
                    className={`template-card ${selectedId === t.id ? "selected" : ""}`}
                    style={{ "--delay": `${(index % 10) * 0.05}s` }}
                    onClick={() => select(t.id)}
                  >
                    {BADGES[t.id] && <span className="card-badge">{BADGES[t.id]}</span>}
                    <div className="card-inner">
                      <TemplatePreview id={t.id} color={t.color} accent={t.accent} />
                      <div className="card-info">
                        <span className="template-name">{t.name}</span>
                        <div className="color-dots">
                          <span style={{ background: t.color }} />
                          <span style={{ background: t.accent }} />
                        </div>
                      </div>
                    </div>
                    {selectedId === t.id && <div className="selected-check">✓ Selected</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-sticky-bar">
        {selectedId ? (
          <button className="template-next-btn animate-in" onClick={async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
              const tName = TEMPLATES.find((t) => t.id === selectedId)?.name || 'New Resume';
              await createNewProfile(tName, selectedId);
              navigate("/form");
            } else { navigate("/login"); }
          }}>
            Continue with {TEMPLATES.find((t) => t.id === selectedId)?.name} →
          </button>
        ) : (
          <p className="selection-hint">Choose your design to start</p>
        )}
      </div>
    </div>
  );
}
