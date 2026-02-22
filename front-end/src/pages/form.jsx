import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useResume from "./resumecontext";
import ResumePreview from "../components/ResumePreview";
import AIAssistant from "../components/AIAssistant";
import ResumeTipsWidget from "../components/ResumeTipsWidget";
import { getTemplate } from "../templates";
import confetti from "canvas-confetti";
import "./form.css";
import CustomDropdown from "../components/CustomDropdown";

export default function Form() {
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
    createNewProfile,
    deleteProfile,
    renameProfile,
    template,
    resumeData,
    updateResume,
    updateArrayField,
    addArrayItem,
    customColors,
    updateCustomColor,
    resetData,
    selectedGradient,
    setSelectedGradient,
    moveSection,
    reorderSections,
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
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!template) {
      navigate("/");
    }
  }, [template, navigate]);

  const t = getTemplate(template || "modern");
  if (!template) return null;

  const currentThemeColor = customColors[template] || t.color;

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const themeStyle = {
    "--theme-primary": currentThemeColor,
    "--theme-accent": t.accent
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
    const encodedData = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const link = `${window.location.origin}/view?shared=${btoa(encodeURIComponent(JSON.stringify(shareData)))}`;
    navigator.clipboard.writeText(link);
    showToast("Shareable link copied to clipboard!", "success");
  };

  return (
    <div className={`form-page theme-${template}`} style={themeStyle}>
      <header className="form-header">
        <button className="back-btn" onClick={() => navigate("/")}>
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
                <div className="strength-label">Strength: <span className={`score score-${Math.floor(strength / 20)}`}>{strength}%</span></div>
                <div className="strength-hints">
                  {strength < 100 ? `Tip: ${getHints()[0]}` : "Perfect! 🚀"}
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
              {[1, 2, 3, 4].map(s => (
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
          <p className="template-badge" style={{ background: currentThemeColor, color: "white" }}>
            {t.name}
          </p>
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
                            reader.onloadend = () => updateResume("profileImage", reader.result);
                            reader.readAsDataURL(file);
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
                  <input
                    type="text"
                    placeholder="Job Title*"
                    value={resumeData.title}
                    onChange={(e) => updateResume("title", e.target.value)}
                    required
                  />
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
                <input
                  type="text"
                  placeholder="Address"
                  value={resumeData.address}
                  onChange={(e) => updateResume("address", e.target.value)}
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="LinkedIn"
                    value={resumeData.linkedin}
                    onChange={(e) => updateResume("linkedin", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="GitHub"
                    value={resumeData.github}
                    onChange={(e) => updateResume("github", e.target.value)}
                  />
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
                  <AIAssistant
                    field="summary"
                    currentData={resumeData}
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
                  <div key={i} className="form-row-group">
                    <div className="field-with-ai">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updateArrayField("projects", i, "title", e.target.value)}
                      />
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
                  <div key={i} className="form-row-group">
                    <div className="field-with-ai">
                      <input
                        type="text"
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => updateArrayField("experience", i, "role", e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateArrayField("experience", i, "company", e.target.value)}
                    />
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
                  <div key={i} className="form-row-group">
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
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content animate-in">
              <div className="form-section">
                <h3>Manage Sections</h3>
                <p className="hint">Drag and drop sections to reorder how they appear on your resume.</p>
                <div className="section-manager">
                  {(resumeData.sectionConfig?.order || ["Summary", "Projects", "Experience", "Education", "Skills"]).map((section, index) => (
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

          <div className="wizard-actions">
            <button
              className={`wizard-btn prev ${currentStep === 1 ? 'disabled' : ''}`}
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button className="wizard-btn next" onClick={nextStep}>
              {currentStep === totalSteps ? 'Preview Resume →' : 'Next Step'}
            </button>
          </div>
        </div>

        <div className="preview-side">
          <div className="preview-sticky">
            <ResumePreview template={template} data={resumeData} />
          </div>
        </div>
      </div>

      {showModal && (
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
      )}

      <ResumeTipsWidget resumeData={resumeData} />
    </div>
  );
}
