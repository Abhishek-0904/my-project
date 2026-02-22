import { getTemplate } from "../templates";
import useResume from "../pages/resumecontext";
import { QRCodeCanvas } from "qrcode.react";
import "./ResumePreview.css";

// Layout types mapping - matches template selection page designs
const LAYOUT_MAP = {
  modern: "header-top",
  classic: "sidebar",
  minimal: "minimal",
  professional: "two-column",
  creative: "diagonal",
  executive: "header-top",
  academic: "academic",
  clean: "bordered",
  bold: "header-accent",
  elegant: "elegant",
  contemporary: "strip",
  corporate: "grid",
  minimalist: "minimal",
  stylish: "rounded",
  tech: "dark-angular",
  luxe: "dark-gold",
  ocean: "ocean",
  sunset: "sunset",
  monochrome: "monochrome",
  startup: "startup",
  editorial: "strip",
  serenity: "serenity",
};

function Section({ title, children }) {
  return (
    <div className="resume-section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const GRADIENT_MAP = {
  none: null,
  midnight: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  sunset: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
  ocean: "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)",
  royal: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  slate: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
  aura: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)"
};

export default function ResumePreview({ template, data, fullPage }) {
  const { customColors, selectedGradient } = useResume();
  const t = getTemplate(template);
  const primaryColor = customColors[template] || t.color;

  const gradient = GRADIENT_MAP[selectedGradient];
  const style = {
    "--primary": primaryColor,
    "--accent": t.accent,
    "--primary-gradient": gradient || `linear-gradient(${primaryColor}, ${primaryColor})`
  };
  const layout = LAYOUT_MAP[template] || "header-top";

  const qrValue = data.website || data.linkedin || data.github;
  const qrCodeContent = data.showQRCode && qrValue ? (
    <div className="resume-qr-code animate-in">
      <QRCodeCanvas
        value={qrValue}
        size={50}
        level={"H"}
        includeMargin={false}
        style={{ width: '100%', height: '100%' }}
      />
      <span className="qr-label">Scan to View</span>
    </div>
  ) : null;

  const headerContent = (
    <div className="resume-header-flex animate-in">
      {data.profileImage && (
        <div className={`resume-profile-img ${data.profileShape || 'square'}`}>
          <img src={data.profileImage} alt="Profile" />
        </div>
      )}
      <div className="resume-header-info">
        <div className="header-text-with-qr">
          <div className="header-titles">
            <h1>{(data && data.name) ? data.name : "Your Name"}</h1>
            {data.title && <p className="resume-title">{data.title}</p>}
          </div>
          {qrCodeContent}
        </div>
        <div className="resume-contact">
          {data.email && (
            <span className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              {data.email}
            </span>
          )}
          {data.phone && (
            <span className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {data.phone}
            </span>
          )}
          {data.address && (
            <span className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {data.address}
            </span>
          )}
        </div>
        {(data.linkedin || data.github || data.website) && (
          <div className="resume-socials">
            {data.linkedin && (
              <span className="social-link">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                {data.linkedin.replace("https://", "").replace("www.", "")}
              </span>
            )}
            {data.github && (
              <span className="social-link">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                {data.github.replace("https://", "").replace("www.", "")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const getSectionContent = (sectionName) => {
    switch (sectionName) {
      case "Summary":
        return data.summary ? (
          <Section title="Summary">
            <p>{data.summary}</p>
          </Section>
        ) : null;
      case "Projects":
        return data.projects && data.projects.length > 0 && data.projects[0].title ? (
          <Section title="Projects">
            {data.projects.map((proj, i) => (
              <div key={i} className="resume-item">
                <strong>{proj.title}</strong> {proj.link && <span className="muted">| {proj.link.replace("https://", "")}</span>}
                {proj.description && <p>{proj.description}</p>}
              </div>
            ))}
          </Section>
        ) : null;
      case "Experience":
        return data.experience && data.experience.length > 0 && data.experience[0].role ? (
          <Section title="Experience">
            {data.experience.map((exp, i) => (
              <div key={i} className="resume-item">
                <strong>{exp.role || "Role"}</strong> {exp.company && `— ${exp.company}`}
                {exp.duration && <span className="muted">{exp.duration}</span>}
                {exp.description && <p>{exp.description}</p>}
              </div>
            ))}
          </Section>
        ) : null;
      case "Education":
        return data.education && data.education.length > 0 && data.education[0].degree ? (
          <Section title="Education">
            {data.education.map((edu, i) => (
              <div key={i} className="resume-item">
                <strong>{edu.degree || "Degree"}</strong> {edu.school && `— ${edu.school}`}
                {edu.year && <span className="muted">{edu.year}</span>}
              </div>
            ))}
          </Section>
        ) : null;
      case "Skills":
        return (data.skills || data.languages) ? (
          <div className="skills-languages-grid">
            {data.skills && (
              <Section title="Tech Skills">
                <p>
                  {Array.isArray(data.skills)
                    ? data.skills.map(s => typeof s === 'object' ? s.name : s).join(", ")
                    : typeof data.skills === 'object'
                      ? "Check Skills format"
                      : data.skills}
                </p>
              </Section>
            )}
            {data.languages && (
              <Section title="Languages">
                <p>{data.languages}</p>
              </Section>
            )}
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const mainContent = (
    <>
      {(data.sectionConfig?.order || ["Summary", "Projects", "Experience", "Education", "Skills"]).map((sectionName, index) => {
        const isVisible = data.sectionConfig?.visible ? data.sectionConfig.visible[sectionName] : true;
        if (isVisible === false) return null;

        const content = getSectionContent(sectionName);
        if (!content) return null;

        return (
          <div key={sectionName} className="animate-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
            {content}
          </div>
        );
      })}
    </>
  );

  return (
    <div className={`resume-preview resume-${template} layout-${layout}${fullPage ? " full-page" : ""}`} style={style}>
      {/* Header-top: Modern, Executive - full width bar */}
      {(layout === "header-top" || layout === "header-accent") && (
        <>
          <div className="resume-header-bar">{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </>
      )}

      {/* Sidebar: Classic - left 30% colored */}
      {layout === "sidebar" && (
        <>
          <div className="resume-sidebar">{headerContent}</div>
          <div className="resume-main">{mainContent}</div>
        </>
      )}

      {/* Strip: Contemporary, Editorial - thin left strip */}
      {layout === "strip" && (
        <>
          <div className="resume-strip" />
          <div className="resume-main">{headerContent}{mainContent}</div>
        </>
      )}

      {/* Two-column: Professional */}
      {layout === "two-column" && (
        <>
          <div className="resume-header-bar">{headerContent}</div>
          <div className="resume-two-col">
            <div className="col">{mainContent}</div>
          </div>
        </>
      )}

      {/* Diagonal: Creative */}
      {layout === "diagonal" && (
        <div className="resume-diagonal">
          <div className="diagonal-header">{headerContent}</div>
          <div className="diagonal-content">{mainContent}</div>
        </div>
      )}

      {/* Minimal, Minimalist */}
      {layout === "minimal" && (
        <>
          <div className="resume-minimal-header">{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </>
      )}

      {/* Academic */}
      {layout === "academic" && (
        <>
          <div className="resume-academic-bar" />
          <div className="resume-body">{headerContent}{mainContent}</div>
        </>
      )}

      {/* Bordered: Clean */}
      {layout === "bordered" && (
        <div className="resume-bordered">
          <div className="bordered-header">{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </div>
      )}

      {/* Elegant */}
      {layout === "elegant" && (
        <>
          <div className="resume-elegant-header">{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </>
      )}

      {/* Grid: Corporate */}
      {layout === "grid" && (
        <>
          <div className="resume-header-bar">{headerContent}</div>
          <div className="resume-grid-body">{mainContent}</div>
        </>
      )}

      {/* Rounded: Stylish */}
      {layout === "rounded" && (
        <>
          <div className="resume-rounded-header">{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </>
      )}

      {/* Dark angular: Tech */}
      {layout === "dark-angular" && (
        <>
          <div className="resume-tech-header">{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </>
      )}

      {/* Ocean, Sunset, Monochrome, Startup, Serenity */}
      {(layout === "ocean" || layout === "sunset" || layout === "monochrome" || layout === "startup" || layout === "serenity") && (
        <>
          <div className={`resume-special-header ${layout}`}>{headerContent}</div>
          <div className="resume-body">{mainContent}</div>
        </>
      )}
    </div>
  );
}
