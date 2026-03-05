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

const SECTION_ICONS = {
  "Summary": "📝",
  "Projects": "🚀",
  "Experience": "💼",
  "Education": "🎓",
  "Skills": "🛠️",
  "Technical Skills": "🛠️",
  "Tech Skills": "🛠️",
  "Languages": "🗣️"
};

function Section({ title, icon, children, styleMode }) {
  const displayIcon = icon || SECTION_ICONS[title];
  return (
    <div className="resume-section" data-title={title} data-style={styleMode || 'plain'}>
      <h3>
        {displayIcon && <span className="section-icon">{displayIcon}</span>}
        {title}
      </h3>
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

export default function ResumePreview({ template, data, fullPage, customColorsOverride, selectedGradientOverride }) {
  const { customColors: contextColors, selectedGradient: contextGradient } = useResume();
  const t = getTemplate(template);

  // Use override (from props) or context (from builder)
  const customColors = customColorsOverride || contextColors || {};
  const selectedGradient = selectedGradientOverride || contextGradient || "none";

  const primaryColor = customColors[template] || t.color;

  const ds = data.designSettings || {
    fontFamily: "Inter", pageBackground: "#ffffff", textColor: "#334155", fontSize: 14, lineHeight: 1.5, letterSpacing: 0,
    sectionSpacing: 18, pagePadding: 25, layoutMode: "single",
    profileFont: "Montserrat", profileNameSize: 2.8, profileTitleSize: 1.1, contactIconSize: 14, contactSpacing: 8,
    headerAlignment: "left", iconStyle: "border",
    sectionTitleStyle: "plain", bulletPointStyle: "dot", bulletPointColor: "",
    summaryFont: "Lora", summaryFontSize: 14, summaryLineHeight: 1.6, summaryFontStyle: "normal",
    experienceTitleFont: "Montserrat", experienceTitleSize: 1.1, experienceCompanySize: 14, experienceBodySize: 13, experienceItemSpacing: 15,
    educationTitleSize: 1.1, educationInstitutionSize: 14, educationItemSpacing: 12,
    projectTitleSize: 1.1, projectDescSize: 13, projectItemSpacing: 15,
    sectionHeadingFont: "Montserrat", sectionHeadingSize: 1.0, sectionHeadingWeight: 700
  };

  const gradient = GRADIENT_MAP[selectedGradient];
  const style = {
    "--primary": primaryColor,
    "--accent": t.accent,
    "--primary-gradient": gradient || `linear-gradient(${primaryColor}, ${primaryColor})`,

    // Global
    "--page-bg": ds.pageBackground || "#ffffff",
    "--text-color": ds.textColor || "#334155",
    "--font-family": ds.fontFamily + ", sans-serif",
    "--base-font-size": ds.fontSize + "px",
    "--line-height": ds.lineHeight,
    "--letter-spacing": ds.letterSpacing + "px",
    "--global-scale": ds.globalScale || 1.0,
    "--section-title-style": ds.sectionTitleStyle || "plain",
    "--bullet-point-style": ds.bulletPointStyle || "dot",
    "--bullet-point-color": ds.bulletPointColor || primaryColor,
    "--exp-style": ds.experienceStyle || "classic",
    "--edu-style": ds.educationStyle || "classic",
    "--skills-style": ds.skillsStyle || "badges",
    "--proj-layout": ds.projectLayout || "list",
    "--contact-layout": ds.contactLayout || "list",

    // Profile
    "--profile-font": ds.profileFont + ", sans-serif",
    "--profile-name-size": ds.profileNameSize + "rem",
    "--profile-title-size": ds.profileTitleSize + "rem",
    "--contact-icon-size": ds.contactIconSize + "px",
    "--contact-spacing": ds.contactSpacing + "px",
    "--profile-img-grayscale": ds.profileImageGrayscale ? "100%" : "0%",
    "--profile-img-brightness": ds.profileImageBrightness || 1.0,

    // Summary
    "--summary-font": ds.summaryFont + ", sans-serif",
    "--summary-font-size": ds.summaryFontSize + "px",
    "--summary-line-height": ds.summaryLineHeight,
    "--summary-font-style": ds.summaryFontStyle,
    "--summary-align": ds.summaryAlignment || "left",
    "--summary-color": ds.summaryColor || "inherit",

    // Experience
    "--exp-title-font": ds.experienceTitleFont + ", sans-serif",
    "--exp-title-size": ds.experienceTitleSize + "rem",
    "--exp-company-size": ds.experienceCompanySize + "px",
    "--exp-body-size": ds.experienceBodySize + "px",
    "--exp-item-spacing": ds.experienceItemSpacing + "px",
    "--exp-align": ds.experienceAlignment || "left",
    "--exp-color": ds.experienceColor || "inherit",

    // Education
    "--edu-title-size": ds.educationTitleSize + "rem",
    "--edu-institution-size": ds.educationInstitutionSize + "px",
    "--edu-item-spacing": ds.educationItemSpacing + "px",
    "--edu-align": ds.educationAlignment || "left",
    "--edu-color": ds.educationColor || "inherit",

    // Projects
    "--proj-title-size": ds.projectTitleSize + "rem",
    "--proj-desc-size": ds.projectDescSize + "px",
    "--proj-item-spacing": ds.projectItemSpacing + "px",
    "--proj-align": ds.projectAlignment || "left",
    "--proj-color": ds.projectColor || "inherit",

    // Headings
    "--heading-font": ds.sectionHeadingFont + ", sans-serif",
    "--heading-size": ds.sectionHeadingSize + "rem",
    "--heading-weight": ds.sectionHeadingWeight,
    "--skills-align": ds.skillsAlignment || "left",
    "--skills-color": ds.skillsColor || "inherit",
    "--lang-align": ds.languagesAlignment || "left",
    "--lang-color": ds.languagesColor || "inherit",
  };

  const formatDescription = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const isList = lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•'));

    if (isList) {
      return (
        <ul className="resume-list" data-style={ds.bulletPointStyle || 'dot'}>
          {lines.filter(l => l.trim()).map((line, idx) => {
            const cleanLine = line.trim().replace(/^[-*•]\s*/, "");
            return <li key={idx} className="resume-list-item">{cleanLine}</li>;
          })}
        </ul>
      );
    }
    return text;
  };

  const renderSkills = (skills) => {
    const isProgress = ds.skillsStyle === 'progress';
    const isDots = ds.skillsStyle === 'dots';

    // Convert to normalized array of objects {name, level}
    let skillList = [];
    if (typeof skills === 'string') {
      skillList = skills.split(',').map(s => ({ name: s.trim(), level: 85 }));
    } else if (Array.isArray(skills)) {
      skillList = skills.map(s => typeof s === 'object' ? s : { name: s, level: 85 });
    }

    if (isProgress || isDots) {
      return (
        <div className={`skills-visual-container mode-${ds.skillsStyle}`}>
          {skillList.map((skill, idx) => (
            <div key={idx} className="skill-visual-item">
              <div className="skill-info-row">
                <span className="skill-name">{skill.name}</span>
                {isProgress && <span className="skill-percentage">{skill.level}%</span>}
              </div>
              {isProgress && (
                <div className="skill-progress-track">
                  <div className="skill-progress-bar" style={{ width: `${skill.level}%`, background: primaryColor }}></div>
                </div>
              )}
              {isDots && (
                <div className="skill-dots-track">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={`skill-dot ${i <= Math.round(skill.level / 20) ? 'filled' : ''}`}
                      style={i <= Math.round(skill.level / 20) ? { background: primaryColor } : {}}></span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Default: Badges
    return (
      <div className="skills-badges-container">
        {skillList.map((s, idx) => (
          <span key={idx} className="skill-badge-premium">{s.name}</span>
        ))}
      </div>
    );
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
        <div className={`resume-contact layout-${ds.contactLayout || 'list'}`}>
          {data.email && (
            <span className="contact-item" title={data.email}>
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </span>
              {!ds.iconsOnly && data.email}
            </span>
          )}
          {data.phone && (
            <span className="contact-item" title={data.phone}>
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </span>
              {!ds.iconsOnly && data.phone}
            </span>
          )}
          {data.address && (
            <span className="contact-item" title={data.address}>
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </span>
              {!ds.iconsOnly && data.address}
            </span>
          )}
        </div>
        {(data.linkedin || data.github || data.website) && (
          <div className="resume-socials">
            {data.linkedin && (
              <span className="social-link" title={data.linkedin}>
                <span className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </span>
                {!ds.iconsOnly && data.linkedin.replace("https://", "").replace("www.", "")}
              </span>
            )}
            {data.github && (
              <span className="social-link" title={data.github}>
                <span className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                </span>
                {!ds.iconsOnly && data.github.replace("https://", "").replace("www.", "")}
              </span>
            )}
            {data.website && (
              <span className="social-link" title={data.website}>
                <span className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </span>
                {!ds.iconsOnly && data.website.replace("https://", "").replace("www.", "")}
              </span>
            )}
            {data.dob && (
              <span className="social-link" title={data.dob}>
                <span className="contact-icon-text">📅</span>
                {!ds.iconsOnly && data.dob}
              </span>
            )}
            {data.nationality && (
              <span className="social-link" title={data.nationality}>
                <span className="contact-icon-text">🌍</span>
                {!ds.iconsOnly && data.nationality}
              </span>
            )}
            {data.gender && (
              <span className="social-link" title={data.gender}>
                <span className="contact-icon-text">👤</span>
                {!ds.iconsOnly && data.gender}
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
          <Section title="Summary" styleMode={ds.sectionTitleStyle}>
            <div className="resume-summary-text">{formatDescription(data.summary)}</div>
          </Section>
        ) : null;
      case "Projects":
        return data.projects && data.projects.length > 0 && data.projects[0].title ? (
          <Section title="Projects" styleMode={ds.sectionTitleStyle}>
            <div className={`projects-grid mode-${ds.projectLayout || 'list'}`}>
              {data.projects.map((proj, i) => (
                <div key={i} className="resume-item project-item">
                  <div className="item-header">
                    <span className="item-title">{proj.title}</span>
                    {proj.link && <span className="item-link">{proj.link.replace("https://", "")}</span>}
                  </div>
                  {proj.description && <div className="item-description">{formatDescription(proj.description)}</div>}
                </div>
              ))}
            </div>
          </Section>
        ) : null;
      case "Experience":
        return data.experience && data.experience.length > 0 && data.experience[0].role ? (
          <Section title="Experience" styleMode={ds.sectionTitleStyle}>
            <div className={`experience-list style-${ds.experienceStyle || 'classic'}`}>
              {ds.experienceStyle === 'timeline' && <div className="timeline-spine"></div>}
              {data.experience.map((exp, i) => (
                <div key={i} className={`resume-item experience-item ${ds.experienceStyle === 'timeline' ? 'timeline-node' : ''}`}>
                  {ds.experienceStyle === 'timeline' && <div className="timeline-dot" style={{ background: primaryColor }}></div>}
                  <div className="item-header">
                    <span className="item-title">{exp.role || "Role"}</span>
                    {exp.duration && <span className="item-meta">{exp.duration}</span>}
                  </div>
                  {exp.company && <div className="item-subtitle">{exp.company}</div>}
                  {exp.description && <div className="item-description">{formatDescription(exp.description)}</div>}
                </div>
              ))}
            </div>
          </Section>
        ) : null;
      case "Education":
        return data.education && data.education.length > 0 && data.education[0].degree ? (
          <Section title="Education" styleMode={ds.sectionTitleStyle}>
            <div className={`experience-list style-${ds.educationStyle || 'classic'}`}>
              {ds.educationStyle === 'timeline' && <div className="timeline-spine"></div>}
              {data.education.map((edu, i) => (
                <div key={i} className={`resume-item education-item ${ds.educationStyle === 'timeline' ? 'timeline-node' : ''}`}>
                  {ds.educationStyle === 'timeline' && <div className="timeline-dot" style={{ background: primaryColor }}></div>}
                  <div className="item-header">
                    <span className="item-title">{edu.degree || "Degree"}</span>
                    {edu.year && <span className="item-meta">{edu.year}</span>}
                  </div>
                  {edu.school && <div className="item-subtitle">{edu.school}</div>}
                </div>
              ))}
            </div>
          </Section>
        ) : null;
      case "Technical Skills":
        return data.skills ? (
          <Section title="Technical Skills" styleMode={ds.sectionTitleStyle}>
            {renderSkills(data.skills)}
          </Section>
        ) : null;
      case "Skills":
        // Only show skills from the default field if NOT a custom section
        if (!data.customSections?.some(s => s.title === "Skills")) {
          return data.skills ? (
            <Section title="Skills" styleMode={ds.sectionTitleStyle}>
              {renderSkills(data.skills)}
            </Section>
          ) : null;
        }
        break;
      case "Languages":
        // Only show languages if it's the default Languages section
        if (!data.customSections?.some(s => s.title === "Languages")) {
          return data.languages ? (
            <Section title="Languages" styleMode={ds.sectionTitleStyle}>
              <div className="languages-content">{data.languages}</div>
            </Section>
          ) : null;
        }
        break;
      default:
        break;
    }

    // Check if it's a custom section
    const customSec = data.customSections?.find(s => s.title === sectionName);
    if (customSec) {
      return (
        <Section title={customSec.title} icon={customSec.icon} styleMode={ds.sectionTitleStyle}>
          {customSec.isList ? (
            <div className="custom-list-preview">
              {customSec.items?.map((item, iIdx) => (
                <div key={iIdx} className="resume-item custom-list-item">
                  <div className="item-header">
                    <span className="item-title">{item.field0 || ""}</span>
                    <span className="item-meta">{item.field2 || ""}</span>
                  </div>
                  {item.field1 && <div className="item-subtitle">{item.field1}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="resume-summary-text">{customSec.content}</div>
          )}
        </Section>
      );
    }

    return null;
  };

  const mainContent = (
    <>
      {(data.sectionConfig?.order || ["Summary", "Projects", "Experience", "Education", "Technical Skills", "Languages"]).map((sectionName, index) => {
        const isVisible = data.sectionConfig?.visible ? data.sectionConfig.visible[sectionName] : true;
        if (isVisible === false) return null;

        const content = getSectionContent(sectionName);
        if (!content) return null;

        return (
          <div key={sectionName} className="animate-in grid-section" data-title={sectionName} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
            {content}
          </div>
        );
      })}
    </>
  );

  const containerClasses = [
    `resume-preview`,
    `resume-${template}`,
    `layout-${layout}`,
    data.designSettings?.layoutMode ? `layout-mode-${data.designSettings.layoutMode}` : 'layout-mode-single',
    data.designSettings?.headerAlignment ? `align-${data.designSettings.headerAlignment}` : 'align-left',
    data.designSettings?.iconStyle ? `icons-${data.designSettings.iconStyle}` : 'icons-border',
    ds.iconsOnly ? 'icons-only-active' : '',
    fullPage ? "full-page" : "",
    gradient ? "has-gradient" : ""
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`${containerClasses} decoration-${ds.documentDecoration || 'none'}`}
      style={style}
      id="resume-content-print"
    >
      {ds.documentDecoration === 'border' && <div className="premium-border-frame" style={{ borderColor: primaryColor }}></div>}
      {ds.documentDecoration === 'top-bar' && <div className="premium-top-accent" style={{ background: primaryColor }}></div>}
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
