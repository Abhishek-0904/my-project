import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useResume from "./resumecontext";
import ResumePreview from "../components/ResumePreview";
import AIAssistant from "../components/AIAssistant";
import DesignSettings from "../components/DesignSettings";
import ResumeTipsWidget from "../components/ResumeTipsWidget";
import ATSAnalyzer from "../components/ATSAnalyzer";
import CoverLetterGenerator from "../components/CoverLetterGenerator";
import { getTemplate, TEMPLATES } from "../templates";
import confetti from "canvas-confetti";
import "./form.css";
import CustomDropdown from "../components/CustomDropdown";
import { ROLE_TEMPLATES } from "../components/AIAssistant";
import ImageCropper from "../components/ImageCropper";
import AIToneEnhancer from "../components/AIToneEnhancer";
import LZString from "lz-string";

export default function Form() {
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
    createNewProfile,
    deleteProfile,
    renameProfile,
    template,
    setTemplate,
    resumeData,
    updateResume,
    updateArrayField,
    addArrayItem,
    removeArrayItem,
    customColors,
    updateCustomColor,
    resetData,
    selectedGradient,
    setSelectedGradient,
    moveSection,
    reorderSections,
    reorderArrayItems,
    toggleSection,
    isSyncing,
    toast,
    showToast,
    setToast,
    confirmAction
  } = useResume();

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [modalMode, setModalMode] = useState(""); // "add" or "rename"
  const [modalPlaceholder, setModalPlaceholder] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSectionField, setDraggedSectionField] = useState(null);
  const [draggedCustomIdx, setDraggedCustomIdx] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showThemeGallery, setShowThemeGallery] = useState(false);
  const [showFullScreenPreview, setShowFullScreenPreview] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const navigate = useNavigate();

  // Auto-detect best starting step when profile data loads
  useEffect(() => {
    const hasPersonalInfo = resumeData.name && resumeData.email && resumeData.title;
    const hasProjectsOrExp = (resumeData.projects?.[0]?.title || resumeData.experience?.[0]?.role);
    const hasEducation = (resumeData.education?.[0]?.degree || resumeData.skills);
    if (hasPersonalInfo) {
      setShowWelcomeBack(true);
      if (hasEducation) setCurrentStep(4);
      else if (hasProjectsOrExp) setCurrentStep(3);
      else setCurrentStep(2);
    } else {
      setShowWelcomeBack(false);
      setCurrentStep(1);
    }
  }, [activeProfileId]);

  const calculateStrength = () => {
    let score = 0;
    const rd = resumeData;

    if (rd.name) score += 10;
    if (rd.title) score += 5;
    if (rd.email) score += 5;
    if (rd.phone) score += 5;
    if (rd.address) score += 5;
    if (rd.profileImage) score += 10;
    if (rd.summary?.length > 50) score += 10;
    if (rd.experience?.length > 0 && rd.experience[0].role) score += 15;
    if (rd.education?.length > 0 && rd.education[0].degree) score += 10;
    if (rd.projects?.length > 0 && rd.projects[0].title) score += 15;
    if (rd.skills?.length > 10) score += 10;

    return Math.min(score, 100);
  };

  const strength = calculateStrength();

  const getHints = () => {
    const hints = [];
    if (!resumeData.profileImage) hints.push("Add photo");
    if (!resumeData.summary || resumeData.summary.length < 50) hints.push("Longer summary");
    if (!resumeData.experience[0]?.role) hints.push("Add experience");
    if (!resumeData.projects[0]?.title) hints.push("Add projects");
    if (!resumeData.skills) hints.push("Add skills");
    return hints.slice(0, 1);
  };

  const handleTemplateSelect = (id) => {
    setTemplate(id);
    setShowThemeGallery(false);
    fireConfetti();
    showToast(`Switched to premium theme!`, "success");
  };

  useEffect(() => {
    if (!template) {
      navigate("/templates");
    }
  }, [template, navigate]);

  const t = getTemplate(template || "modern");
  if (!template) return null;

  const currentThemeColor = customColors[template] || t.color;

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const themeStyle = {
    "--theme-primary": currentThemeColor,
    "--theme-accent": t.accent
  };

  const handleSmartFill = () => {
    if (!resumeData.title) {
      showToast("Please enter a Job Title first!", "warning");
      return;
    }

    setSaveStatus("AI Generating...");
    showToast("AI is crafting your profile...", "success");

    const title = resumeData.title.toLowerCase();

    // Simulate complex AI generation
    setTimeout(() => {
      // Find matches in our local templates
      const matchedRoleKey = Object.keys(ROLE_TEMPLATES).find(role => title.includes(role));

      let suggestedSummary = "";
      let suggestedExp = [];
      let suggestedSkills = "";

      if (matchedRoleKey) {
        suggestedSummary = ROLE_TEMPLATES[matchedRoleKey].summary[0];
        suggestedExp = ROLE_TEMPLATES[matchedRoleKey].experience.map((desc, idx) => ({
          role: idx === 0 ? resumeData.title : `Previous ${resumeData.title}`,
          company: idx === 0 ? "Tech Innovators Inc." : "Global Solutions Corp.",
          duration: idx === 0 ? "2022 - Present" : "2019 - 2022",
          description: desc
        }));
        suggestedSkills = "Leadership, Strategy, Professional Excellence";
      } else {
        // Fallback for unknown roles
        suggestedSummary = `Results-oriented ${resumeData.title} with a proven track record. Dedicated to technical excellence and strategic growth.`;
        suggestedExp = [
          {
            role: resumeData.title,
            company: "Premier Enterprises",
            duration: "2021 - Present",
            description: "Successfully led high-impact projects, increasing overall efficiency by 25%. Streamlined operations and mentored cross-functional teams."
          }
        ];
        suggestedSkills = "Problem Solving, Collaboration, Adaptability";
      }

      updateResume("summary", suggestedSummary);
      updateResume("experience", suggestedExp);
      if (!resumeData.skills) updateResume("skills", suggestedSkills);

      fireConfetti();
      showToast("Smart Fill completed! 🚀", "success");
      setSaveStatus("Saved");
    }, 1500);
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const nextStep = () => {
    // Basic validation for the first step
    if (currentStep === 1) {
      if (!resumeData.name || !resumeData.email || !resumeData.title) {
        showToast("Please fill in Name, Email, and Title!", "warning");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      fireConfetti();
      setTimeout(() => navigate("/view"), 1500);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleShare = () => {
    const shareData = {
      template,
      data: resumeData,
      gradient: selectedGradient
    };

    try {
      let link = "";

      // If we have a database ID, use the ultra-short link
      if (activeProfileId && !activeProfileId.startsWith('temp_')) {
        link = `${window.location.origin}/view?id=${activeProfileId}`;
      } else {
        // Fallback: Use LZString for compression (standalone link)
        const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(shareData));
        link = `${window.location.origin}/view?zshared=${compressedData}`;
      }

      setShareLink(link);
      setShowShareModal(true);

      navigator.clipboard.writeText(link);
      showToast("Portfolio link generated! 🚀", "success");
    } catch (err) {
      console.error("Sharing failed:", err);
      showToast("Failed to generate link. Resume might be too large.", "error");
    }
  };

  const toggleExtraField = (field) => {
    const currentFields = resumeData.sectionConfig?.activeExtraFields || [];
    let newFields;
    if (currentFields.includes(field)) {
      newFields = currentFields.filter(f => f !== field);
    } else {
      newFields = [...currentFields, field];
    }
    updateResume("sectionConfig", { ...resumeData.sectionConfig, activeExtraFields: newFields });
  };

  return (
    <div className={`form-page theme-${template}`} style={themeStyle}>
      <header className="form-header">
        <button className="back-btn" onClick={() => navigate("/templates")}>
          ← Back
        </button>
        <div className="header-center">
          <div className="profile-switcher">
            <CustomDropdown
              options={profiles.map(p => ({ label: p.title, value: p._id }))}
              value={activeProfileId}
              onChange={(val) => setActiveProfileId(val)}
              className="small"
              style={{ width: '180px' }}
            />
            <button className="add-profile-btn" onClick={() => {
              setModalTitle("Create New Profile");
              setModalPlaceholder("e.g. Developer Resume");
              setModalValue("");
              setModalMode("add");
              setShowModal(true);
            }} title="New Profile">+</button>
            <button className="rename-profile-btn" onClick={() => {
              const currentName = profiles.find(p => p._id === activeProfileId)?.title || "";
              setModalTitle("Rename Profile");
              setModalPlaceholder("Enter new name");
              setModalValue(currentName);
              setModalMode("rename");
              setShowModal(true);
            }} title="Rename Profile">✎</button>
            <button className="delete-profile-btn" onClick={() => {
              if (profiles.length > 1) {
                confirmAction({
                  title: "Delete Resume?",
                  message: "This action cannot be undone. All your data for this profile will be permanently removed.",
                  onConfirm: () => deleteProfile(activeProfileId)
                });
              }
            }} title="Delete Profile" disabled={profiles.length <= 1}>×</button>
          </div>
          <div className="status-bar">
            <div className="title-group">
              <h1>Build Your Resume</h1>
              <div className="resume-strength-meter">
                <div className="strength-header">
                  <span className="strength-label">Strength: <span className={`score score-${Math.floor(strength / 20)}`}>{strength}%</span></span>
                </div>
                <div className="strength-bar-container">
                  <div className={`strength-fill fill-${Math.floor(strength / 20)}`} style={{ width: `${strength}%` }}></div>
                </div>
                <div className="strength-hints">
                  {strength < 100 ? `Tip: ${getHints()[0]}` : "Ready to Go! 🎯"}
                </div>
              </div>
            </div>
            <div className={`save-status ${isSyncing ? 'saving' : ''}`}>
              {isSyncing ? (
                <>
                  <span className="sync-spinner"></span>
                  ● Saving...
                </>
              ) : (
                '✓ Saved to cloud'
              )}
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <div className="step-indicators">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} className={`step-dot ${currentStep >= s ? 'active' : ''}`}>
                  {s < currentStep ? '✓' : s}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="gradient-tool" title="Choose Premium Gradient">
            {['none', 'midnight', 'sunset', 'ocean', 'royal', 'slate', 'aura'].map(g => (
              <button
                key={g}
                className={`grad-btn ${g} ${selectedGradient === g ? 'active' : ''}`}
                onClick={() => setSelectedGradient(g)}
              >
                {g === 'none' && '∅'}
              </button>
            ))}
          </div>
          <div className="color-tool">
            <input
              type="color"
              value={currentThemeColor}
              onChange={(e) => updateCustomColor(template, e.target.value)}
              title="Change Theme Color"
            />
          </div>
          <button
            className="template-chooser-btn"
            style={{ background: currentThemeColor, color: "white" }}
            onClick={() => setShowThemeGallery(true)}
            title="Open Theme Explorer"
          >
            🎨 {t.name}
          </button>
          <button className="share-btn" onClick={handleShare} title="Get Shareable Link">
            🔗 Share Link
          </button>
          <button className="reset-btn" onClick={() => {
            confirmAction({
              title: "Clear All Data?",
              message: "Are you sure you want to reset this resume? You will lose all current progress.",
              onConfirm: () => resetData()
            });
          }} title="Clear All Data">
            🗑
          </button>
        </div>
      </header>

      <div className="form-layout">
        <div className="form-side">
          {/* Welcome Back Banner */}
          {showWelcomeBack && (
            <div className="welcome-back-banner">
              <div className="welcome-back-content">
                <div className="welcome-back-left">
                  <span className="welcome-back-icon">👋</span>
                  <div>
                    <strong>Welcome back, {resumeData.name || "there"}!</strong>
                    <p>Your progress is saved. Jump to any section:</p>
                  </div>
                </div>
                <div className="welcome-back-steps">
                  <button onClick={() => { setCurrentStep(1); setShowWelcomeBack(false); }} className="wb-step-btn" title="Personal Info">
                    <span>1</span> Personal
                  </button>
                  <button onClick={() => { setCurrentStep(2); setShowWelcomeBack(false); }} className="wb-step-btn" title="Experience & Projects">
                    <span>2</span> Content
                  </button>
                  <button onClick={() => { setCurrentStep(3); setShowWelcomeBack(false); }} className="wb-step-btn" title="Education">
                    <span>3</span> Education
                  </button>
                  <button onClick={() => { setCurrentStep(4); setShowWelcomeBack(false); }} className="wb-step-btn" title="Layout & Sections">
                    <span>4</span> Layout
                  </button>
                  <button onClick={() => { setCurrentStep(5); setShowWelcomeBack(false); }} className="wb-step-btn" title="ATS Analysis">
                    <span>5</span> ATS Opt
                  </button>
                  <button onClick={() => { setCurrentStep(6); setShowWelcomeBack(false); }} className="wb-step-btn" title="Cover Letter">
                    <span>6</span> AI Letter
                  </button>
                </div>
                <button className="wb-close-btn" onClick={() => setShowWelcomeBack(false)} title="Dismiss">×</button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="profile-upload-container">
                  <div className={`profile-preview ${resumeData.profileShape} ${resumeData.profileImage ? 'has-image' : ''}`}
                    style={resumeData.profileImage ? { backgroundImage: `url(${resumeData.profileImage})` } : {}}>
                    {!resumeData.profileImage && <span>+</span>}
                  </div>
                  <div className="upload-controls">
                    <label className="upload-label">
                      {resumeData.profileImage ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImageToCrop(reader.result);
                            reader.readAsDataURL(file);
                            // Reset input so same file can be selected again if needed
                            e.target.value = null;
                          }
                        }}
                      />
                    </label>
                    <div className="shape-selector">
                      <div className="shape-options">
                        <button
                          className={`shape-btn circle ${resumeData.profileShape === 'circle' ? 'active' : ''}`}
                          onClick={() => updateResume("profileShape", "circle")}
                          title="Circular"
                        >C</button>
                        <button
                          className={`shape-btn square ${resumeData.profileShape === 'square' ? 'active' : ''}`}
                          onClick={() => updateResume("profileShape", "square")}
                          title="Square"
                        >S</button>
                      </div>
                    </div>
                  </div>
                  {resumeData.profileImage && (
                    <button className="remove-photo" onClick={() => updateResume("profileImage", "")}>×</button>
                  )}
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Full Name*"
                    value={resumeData.name}
                    onChange={(e) => updateResume("name", e.target.value)}
                    required
                  />
                  <div className="field-with-smart-action">
                    <input
                      type="text"
                      placeholder="Job Title*"
                      value={resumeData.title}
                      onChange={(e) => updateResume("title", e.target.value)}
                      required
                    />
                    <button
                      className="smart-fill-btn"
                      onClick={handleSmartFill}
                      title="AI Smart Fill (Summary & Experience)"
                    >
                      ✨ Smart Fill
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <input
                    type="email"
                    placeholder="Email Address*"
                    value={resumeData.email}
                    onChange={(e) => updateResume("email", e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={resumeData.phone}
                    onChange={(e) => updateResume("phone", e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Address / Location"
                    value={resumeData.address}
                    onChange={(e) => updateResume("address", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Portfolio / Website"
                    value={resumeData.website}
                    onChange={(e) => updateResume("website", e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={resumeData.linkedin}
                    onChange={(e) => updateResume("linkedin", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={resumeData.github}
                    onChange={(e) => updateResume("github", e.target.value)}
                  />
                </div>

                {/* Extra Fields Rendering */}
                <div className="extra-fields-form">
                  {(resumeData.sectionConfig?.activeExtraFields || []).map(field => (
                    <div key={field} className="form-row animate-in">
                      <div className="extra-field-input-wrapper">
                        <input
                          type="text"
                          placeholder={field === 'dob' ? 'Date of Birth (e.g. 15 Jan 1995)' :
                            field === 'nationality' ? 'Nationality' :
                              field === 'gender' ? 'Gender' : field}
                          value={resumeData[field] || ""}
                          onChange={(e) => updateResume(field, e.target.value)}
                        />
                        <button className="remove-item-btn small" onClick={() => toggleExtraField(field)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="smart-feature-toggle animate-in">
                  <div className="feature-info">
                    <span className="feature-icon">📱</span>
                    <div className="feature-text">
                      <strong>AI QR Code</strong>
                      <p>Generate a scanable QR for your profile</p>
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={resumeData.showQRCode}
                      onChange={(e) => updateResume("showQRCode", e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h3>Summary</h3>
                  <AIToneEnhancer
                    type="summary"
                    title={resumeData.title}
                    onApply={(text) => updateResume("summary", text)}
                  />
                </div>
                <textarea
                  placeholder="Professional summary..."
                  value={resumeData.summary}
                  onChange={(e) => updateResume("summary", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <div className="section-header">
                  <h3>Projects</h3>
                  <AIAssistant
                    field="projects"
                    currentData={resumeData}
                    onApply={(text) => addArrayItem("projects", { title: "New Project", description: text })}
                  />
                </div>
                {resumeData.projects?.map((project, i) => (
                  <div
                    key={i}
                    className={`form-row-group draggable-item ${draggedIndex === i && draggedSectionField === 'projects' ? 'dragging' : ''}`}
                    draggable="true"
                    onDragStart={() => {
                      setDraggedIndex(i);
                      setDraggedSectionField('projects');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedSectionField === 'projects' && draggedIndex !== null && draggedIndex !== i) {
                        reorderArrayItems('projects', draggedIndex, i);
                      }
                      setDraggedIndex(null);
                      setDraggedSectionField(null);
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDraggedSectionField(null);
                    }}
                  >
                    <div className="item-drag-handle">⠿</div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updateArrayField("projects", i, "title", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Project Link"
                        value={project.link}
                        onChange={(e) => updateArrayField("projects", i, "link", e.target.value)}
                      />
                      <button className="remove-item-btn" onClick={() => removeArrayItem("projects", i)} title="Remove Item">🗑</button>
                    </div>
                    <textarea
                      placeholder="Description..."
                      value={project.description}
                      onChange={(e) => updateArrayField("projects", i, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addArrayItem("projects", { title: "", link: "", description: "" })}
                >
                  + Add Project
                </button>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h3>Experience</h3>
                  <AIAssistant
                    field="experience"
                    currentData={resumeData}
                    onApply={(text) => addArrayItem("experience", { company: "New Company", role: resumeData.title || "Specialist", description: text })}
                  />
                </div>
                {resumeData.experience?.map((exp, i) => (
                  <div
                    key={i}
                    className={`form-row-group draggable-item ${draggedIndex === i && draggedSectionField === 'experience' ? 'dragging' : ''}`}
                    draggable="true"
                    onDragStart={() => {
                      setDraggedIndex(i);
                      setDraggedSectionField('experience');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedSectionField === 'experience' && draggedIndex !== null && draggedIndex !== i) {
                        reorderArrayItems('experience', draggedIndex, i);
                      }
                      setDraggedIndex(null);
                      setDraggedSectionField(null);
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDraggedSectionField(null);
                    }}
                  >
                    <div className="item-drag-handle">⠿</div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => updateArrayField("experience", i, "role", e.target.value)}
                      />
                      <AIToneEnhancer
                        type="experience"
                        title={exp.role || resumeData.title}
                        onApply={(text) => updateArrayField("experience", i, "description", text)}
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateArrayField("experience", i, "company", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={(e) => updateArrayField("experience", i, "duration", e.target.value)}
                      />
                      <button className="remove-item-btn" onClick={() => removeArrayItem("experience", i)} title="Remove Item">🗑</button>
                    </div>
                    <textarea
                      placeholder="Description..."
                      value={exp.description}
                      onChange={(e) => updateArrayField("experience", i, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addArrayItem("experience", { company: "", role: "", duration: "", description: "" })}
                >
                  + Add Experience
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <h3>Education</h3>
                {resumeData.education?.map((edu, i) => (
                  <div
                    key={i}
                    className={`form-row-group draggable-item ${draggedIndex === i && draggedSectionField === 'education' ? 'dragging' : ''}`}
                    draggable="true"
                    onDragStart={() => {
                      setDraggedIndex(i);
                      setDraggedSectionField('education');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedSectionField === 'education' && draggedIndex !== null && draggedIndex !== i) {
                        reorderArrayItems('education', draggedIndex, i);
                      }
                      setDraggedIndex(null);
                      setDraggedSectionField(null);
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDraggedSectionField(null);
                    }}
                  >
                    <div className="item-drag-handle">⠿</div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateArrayField("education", i, "degree", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="School"
                        value={edu.school}
                        onChange={(e) => updateArrayField("education", i, "school", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => updateArrayField("education", i, "year", e.target.value)}
                      />
                      <button className="remove-item-btn" onClick={() => removeArrayItem("education", i)} title="Remove Item">🗑</button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addArrayItem("education", { school: "", degree: "", year: "" })}
                >
                  + Add Education
                </button>
              </div>

              <div className="form-section">
                <h3>Technical Skills</h3>
                <input
                  type="text"
                  placeholder="Skills (e.g. React, Node.js, Python)"
                  value={resumeData.skills}
                  onChange={(e) => updateResume("skills", e.target.value)}
                />
              </div>
              <div className="form-section">
                <h3>Languages</h3>
                <input
                  type="text"
                  placeholder="Languages (e.g. English, Hindi)"
                  value={resumeData.languages}
                  onChange={(e) => updateResume("languages", e.target.value)}
                />
              </div>

              {resumeData.customSections?.map((section, i) => (
                <div key={i} className="form-section animate-in">
                  <div className="section-header">
                    <h3 style={{ textTransform: 'capitalize' }}>{section.title}</h3>
                    <button type="button" className="remove-item-btn small" onClick={() => removeArrayItem("customSections", i)}>🗑</button>
                  </div>
                  {section.isList ? (
                    <div className="custom-list-items">
                      {(section.items || [{}]).map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className={`custom-item-row draggable-item ${draggedIndex === itemIdx && draggedCustomIdx === i ? 'dragging' : ''}`}
                          draggable="true"
                          onDragStart={() => {
                            setDraggedIndex(itemIdx);
                            setDraggedCustomIdx(i);
                            setDraggedSectionField('custom');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedSectionField === 'custom' && draggedCustomIdx === i && draggedIndex !== null && draggedIndex !== itemIdx) {
                              reorderArrayItems('customSections', draggedIndex, itemIdx, i);
                            }
                            setDraggedIndex(null);
                            setDraggedCustomIdx(null);
                            setDraggedSectionField(null);
                          }}
                          onDragEnd={() => {
                            setDraggedIndex(null);
                            setDraggedCustomIdx(null);
                            setDraggedSectionField(null);
                          }}
                        >
                          <div className="item-drag-handle">⠿</div>
                          <div className="form-row">
                            {(section.fieldLabels || ['Field 1', 'Field 2', 'Field 3']).map((label, fIdx) => (
                              <input
                                key={fIdx}
                                type="text"
                                placeholder={label}
                                value={item[`field${fIdx}`] || ""}
                                onChange={(e) => {
                                  const newItems = [...section.items];
                                  newItems[itemIdx] = { ...newItems[itemIdx], [`field${fIdx}`]: e.target.value };
                                  updateArrayField("customSections", i, "items", newItems);
                                }}
                              />
                            ))}
                            {section.items?.length > 1 && (
                              <button
                                type="button"
                                className="remove-item-btn small"
                                onClick={() => {
                                  const newItems = section.items.filter((_, idx) => idx !== itemIdx);
                                  updateArrayField("customSections", i, "items", newItems);
                                }}
                              >×</button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="add-btn small"
                        onClick={() => {
                          const newItems = [...(section.items || []), {}];
                          updateArrayField("customSections", i, "items", newItems);
                        }}
                      >+ Add {section.title} Item</button>
                    </div>
                  ) : (
                    <textarea
                      placeholder={`${section.title} details...`}
                      value={section.content}
                      onChange={(e) => updateArrayField("customSections", i, "content", e.target.value)}
                      rows={3}
                    />
                  )}
                </div>
              ))}

              <div className="add-content-container">
                <button
                  type="button"
                  className={`add-more-content-btn ${showAddContent ? 'active' : ''}`}
                  onClick={() => setShowAddContent(!showAddContent)}
                >
                  {showAddContent ? '× Close Menu' : '+ Add More Content'}
                </button>

                {showAddContent && (
                  <div className="add-content-menu animate-in">
                    <h4>Add Personal Details</h4>
                    <div className="add-content-options">
                      {[
                        { id: 'dob', label: 'Date of Birth', icon: '📅' },
                        { id: 'nationality', label: 'Nationality', icon: '🌍' },
                        { id: 'gender', label: 'Gender', icon: '👤' }
                      ].map(opt => (
                        <button
                          type="button"
                          key={opt.id}
                          className={`addition-option ${(resumeData.sectionConfig?.activeExtraFields || []).includes(opt.id) ? 'selected' : ''}`}
                          onClick={() => {
                            toggleExtraField(opt.id);
                            setShowAddContent(false);
                          }}
                        >
                          <span className="add-opt-icon">{opt.icon}</span>
                          <span className="add-opt-label">{opt.label}</span>
                          {(resumeData.sectionConfig?.activeExtraFields || []).includes(opt.id) && <span className="add-opt-check">✓</span>}
                        </button>
                      ))}
                    </div>

                    <h4 className="mt-1">Add Content Sections</h4>
                    <div className="add-content-options">
                      {[
                        { id: 'certifications', label: 'Certifications', icon: '📜', isList: true, fields: ['Title', 'Issuer', 'Year'] },
                        { id: 'awards', label: 'Awards', icon: '🏆', isList: true, fields: ['Title', 'Organization', 'Year'] },
                        { id: 'projects_extra', label: 'Additional Projects', icon: '🚀', isList: true, fields: ['Project Title', 'Tech Stack', 'Link'] },
                        { id: 'volunteer', label: 'Volunteer Work', icon: '🤝', isList: true, fields: ['Role', 'Organization', 'Duration'] },
                        { id: 'publications', label: 'Publications', icon: '📚', isList: true, fields: ['Title', 'Publisher', 'Year'] },
                        { id: 'courses', label: 'Courses', icon: '🎓', isList: true, fields: ['Course Name', 'Platform', 'Year'] },
                        { id: 'hobbies', label: 'Interests', icon: '🎨', isList: false },
                        { id: 'references', label: 'References', icon: '👥', isList: true, fields: ['Name', 'Title / Contact'] },
                      ].map(opt => {
                        const isAdded = (resumeData.customSections || []).some(s => s.title === opt.label);
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            className={`addition-option ${isAdded ? 'selected' : ''}`}
                            onClick={() => {
                              if (!isAdded) {
                                if (opt.isList) {
                                  addArrayItem("customSections", {
                                    title: opt.label,
                                    icon: opt.icon,
                                    isList: true,
                                    items: [{}],
                                    fieldLabels: opt.fields
                                  });
                                } else {
                                  addArrayItem("customSections", { title: opt.label, icon: opt.icon, content: "", isList: false });
                                }
                              }
                              setShowAddContent(false);
                            }}
                          >
                            <span className="add-opt-icon">{opt.icon}</span>
                            <span className="add-opt-label">{opt.label}</span>
                            {isAdded && <span className="add-opt-check">✓</span>}
                          </button>
                        );
                      })}
                      <button type="button" className="addition-option" onClick={() => {
                        const title = window.prompt("Enter Section Title (e.g. Publications)");
                        if (title) {
                          addArrayItem("customSections", { title, content: "" });
                          setShowAddContent(false);
                        }
                      }}>
                        <span className="add-opt-icon">➕</span>
                        <span className="add-opt-label">Other Section</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <h3>Manage Sections</h3>
                <p className="hint">Drag and drop sections to reorder how they appear on your resume.</p>
                <div className="section-manager">
                  {(resumeData.sectionConfig?.order || []).map((section, index) => (
                    <div
                      key={section}
                      className={`section-config-item ${draggedIndex === index ? 'dragging' : ''}`}
                      draggable="true"
                      onDragStart={(e) => {
                        setDraggedIndex(index);
                        e.dataTransfer.effectAllowed = "move";
                        // Firefox requires some data to be set
                        e.dataTransfer.setData("text/plain", index);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedIndex !== index) {
                          reorderSections(draggedIndex, index);
                        }
                      }}
                      onDragEnd={() => setDraggedIndex(null)}
                    >
                      <div className="section-info">
                        <span className="drag-handle">☰</span>
                        <span className="section-name">{section}</span>
                      </div>
                      <div className="section-controls">
                        <button
                          className={`visibility-toggle ${(resumeData.sectionConfig?.visible?.[section] ?? true) ? 'on' : 'off'}`}
                          onClick={() => toggleSection(section)}
                          title={(resumeData.sectionConfig?.visible?.[section] ?? true) ? "Hide Section" : "Show Section"}
                        >
                          {(resumeData.sectionConfig?.visible?.[section] ?? true) ? '👁' : '👁‍🗨'}
                        </button>
                        <div className="order-btns">
                          <button
                            className="order-btn"
                            disabled={index === 0}
                            onClick={() => moveSection("up", index)}
                          >
                            ↑
                          </button>
                          <button
                            className="order-btn"
                            disabled={index === resumeData.sectionConfig.order.length - 1}
                            onClick={() => moveSection("down", index)}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <div className="section-header">
                  <h3>ATS & Role Optimization 🚀</h3>
                </div>
                <p className="section-hint">Paste the Job Description of your target role to see how well your resume matches and what keywords are missing.</p>
                <div className="ats-optimization-wrapper">
                  <ATSAnalyzer resumeData={resumeData} updateResume={updateResume} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <div className="section-header">
                  <h3>AI Cover Letter ✉️</h3>
                </div>
                <p className="section-hint">Generate a professionally crafted cover letter tailored to your current resume and a target company.</p>
                <CoverLetterGenerator profiles={profiles} />
              </div>
            </div>
          )}

          <div className="wizard-actions">
            <button
              className={`wizard-btn prev ${currentStep === 1 ? 'disabled' : ''}`}
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button className="wizard-btn next" onClick={nextStep}>
              {currentStep === 6 ? 'Preview Resume →' : 'Next Step'}
            </button>
          </div>
        </div>

        <div className="preview-side">
          <div className="preview-sticky" onClick={() => setShowFullScreenPreview(true)} title="Click to View Full Screen">
            <div className="preview-zoom-indicator">🔍 Click to Enlarge</div>
            <ResumePreview template={template} data={resumeData} />
          </div>
        </div>
      </div>

      {
        showModal && (
          <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
              <h3>{modalTitle}</h3>
              <input
                type="text"
                value={modalValue}
                placeholder={modalPlaceholder}
                onChange={(e) => setModalValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && modalValue.trim()) {
                    const val = modalValue.trim();
                    if (modalMode === "add") createNewProfile(val);
                    else renameProfile(activeProfileId, val);
                    setShowModal(false);
                  }
                }}
              />
              <div className="modal-actions">
                <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="modal-btn confirm"
                  disabled={!modalValue.trim()}
                  onClick={() => {
                    const val = modalValue.trim();
                    if (modalMode === "add") createNewProfile(val);
                    else renameProfile(activeProfileId, val);
                    setShowModal(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showThemeGallery && (
          <div className="custom-modal-overlay gallery-overlay" onClick={() => setShowThemeGallery(false)}>
            <div className="theme-gallery-modal animate-in" onClick={(e) => e.stopPropagation()}>
              <div className="gallery-header">
                <div>
                  <h3>Explore Premium Themes</h3>
                  <p>Choose a design that best represents your professional brand</p>
                </div>
                <button className="gallery-close" onClick={() => setShowThemeGallery(false)}>×</button>
              </div>

              <div className="gallery-content">
                <div className="theme-category">
                  <h4>💼 Executive & Professional</h4>
                  <div className="template-grid">
                    {TEMPLATES.slice(0, 24).map(t => (
                      <div
                        key={t.id}
                        className={`template-card ${template === t.id ? 'active' : ''}`}
                        onClick={() => handleTemplateSelect(t.id)}
                      >
                        <div className="template-preview-shimmer" style={{ background: t.color }}>
                          <div className="preview-accent" style={{ background: t.accent }}></div>
                          {template === t.id && <div className="active-badge">Selected</div>}
                        </div>
                        <div className="template-info">
                          <h5>{t.name}</h5>
                          <span className="template-tag">Professional</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="theme-category mt-2">
                  <h4>🎨 Creative & Modern</h4>
                  <div className="template-grid">
                    {TEMPLATES.slice(24).map(t => (
                      <div
                        key={t.id}
                        className={`template-card ${template === t.id ? 'active' : ''}`}
                        onClick={() => handleTemplateSelect(t.id)}
                      >
                        <div className="template-preview-shimmer" style={{ background: t.color }}>
                          <div className="preview-accent" style={{ background: t.accent }}></div>
                          {template === t.id && <div className="active-badge">Selected</div>}
                        </div>
                        <div className="template-info">
                          <h5>{t.name}</h5>
                          <span className="template-tag">Creative</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <DesignSettings
        settings={resumeData.designSettings || {
          fontFamily: "Inter",
          fontSize: 14,
          lineHeight: 1.5,
          letterSpacing: 0,
          sectionSpacing: 18,
          pagePadding: 25,
          headerSize: 2.2
        }}
        onUpdate={(newSettings) => updateResume("designSettings", newSettings)}
      />
      <ResumeTipsWidget resumeData={resumeData} />

      {showFullScreenPreview && (
        <div className="full-screen-preview-overlay" onClick={() => setShowFullScreenPreview(false)}>
          <button className="close-full-preview">×</button>
          <div className="full-screen-preview-container" onClick={(e) => e.stopPropagation()}>
            <ResumePreview template={template} data={resumeData} fullPage={true} />
          </div>
        </div>
      )}

      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCrop={(croppedImage) => {
            updateResume("profileImage", croppedImage);
            setImageToCrop(null);
            showToast("Photo cropped successfully!", "success");
          }}
          onCancel={() => setImageToCrop(null)}
        />
      )}

      {showShareModal && (
        <div className="custom-modal-overlay share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-portfolio-card animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="share-header">
              <span className="share-rocket">🚀</span>
              <h3>Your Portfolio is Ready!</h3>
              <p>Anyone with this link can view your professional resume online.</p>
            </div>

            <div className="share-link-box">
              <input type="text" value={shareLink} readOnly />
              <button className="copy-btn-premium" onClick={() => {
                navigator.clipboard.writeText(shareLink);
                showToast("Link copied to clipboard!", "success");
              }}>
                Copy Link
              </button>
            </div>

            <div className="share-features">
              <div className="share-feature-item">
                <span className="feat-icon">📱</span>
                <span>Mobile Responsive</span>
              </div>
              <div className="share-feature-item">
                <span className="feat-icon">⚡</span>
                <span>Real-time Loading</span>
              </div>
              <div className="share-feature-item">
                <span className="feat-icon">🔗</span>
                <span>Social Media Ready</span>
              </div>
            </div>

            <div className="share-footer">
              <button className="done-btn" onClick={() => setShowShareModal(false)}>Awesome!</button>
              <p className="share-hint">Link is automatically copied to your clipboard.</p>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}
