import { createContext, useContext, useState, useEffect } from "react";

const ResumeContext = createContext(null);

const defaultResume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  website: "",
  profileImage: "",
  profileShape: "square",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ school: "", degree: "", year: "" }],
  projects: [{ title: "", link: "", description: "" }],
  skills: "",
  languages: "",
  showQRCode: true,
  sectionConfig: {
    order: ["Summary", "Projects", "Experience", "Education", "Skills"],
    visible: {
      Summary: true,
      Projects: true,
      Experience: true,
      Education: true,
      Skills: true
    }
  }
};

export function ResumeProvider({ children }) {
  // Profiles state
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem("resumeProfiles");
    if (saved) return JSON.parse(saved);

    // Migration: If old data exists, create a profile from it
    const oldData = localStorage.getItem("resumeData");
    if (oldData) {
      const initialProfile = {
        id: "default-" + Date.now(),
        name: "My First Resume",
        data: JSON.parse(oldData),
        template: localStorage.getItem("resumeTemplate") || "modern",
        gradient: localStorage.getItem("resumeGradient") || "none",
        color: null, // Custom color if any
        lastModified: Date.now()
      };
      return [initialProfile];
    }

    return [];
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem("activeProfileId") || (profiles.length > 0 ? profiles[0].id : null);
  });

  // Derived active profile
  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  // Active Profile States (for performance and easier binding)
  const [template, setTemplate] = useState(activeProfile?.template || null);
  const [resumeData, setResumeData] = useState(activeProfile?.data || defaultResume);
  const [selectedGradient, setSelectedGradient] = useState(activeProfile?.gradient || "none");
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem("resumeColors");
    return saved ? JSON.parse(saved) : {};
  });

  // Update active profile states when activeProfileId changes
  useEffect(() => {
    if (activeProfile) {
      setTemplate(activeProfile.template);
      setResumeData(activeProfile.data);
      setSelectedGradient(activeProfile.gradient);
    }
  }, [activeProfileId]);

  // Auto-Save to Profiles list and LocalStorage
  useEffect(() => {
    if (!activeProfileId) return;

    setProfiles(prev => prev.map(p =>
      p.id === activeProfileId
        ? { ...p, data: resumeData, template, gradient: selectedGradient, lastModified: Date.now() }
        : p
    ));
  }, [resumeData, template, selectedGradient]);

  useEffect(() => {
    localStorage.setItem("resumeProfiles", JSON.stringify(profiles));
    if (activeProfileId) localStorage.setItem("activeProfileId", activeProfileId);
  }, [profiles, activeProfileId]);

  useEffect(() => {
    localStorage.setItem("resumeColors", JSON.stringify(customColors));
  }, [customColors]);

  const createNewProfile = (profileName = "New Resume", templateId = "modern") => {
    const newId = "profile-" + Date.now();
    const newProfile = {
      id: newId,
      name: profileName,
      data: defaultResume,
      template: templateId,
      gradient: "none",
      lastModified: Date.now()
    };
    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfileId(newId);
  };

  const deleteProfile = (id) => {
    setProfiles(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (activeProfileId === id) {
        setActiveProfileId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const renameProfile = (id, newName) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const updateResume = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, subField, value) => {
    setResumeData((prev) => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [subField]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, defaultItem) => {
    setResumeData((prev) => ({ ...prev, [field]: [...prev[field], defaultItem] }));
  };

  const updateCustomColor = (templateId, color) => {
    setCustomColors(prev => ({ ...prev, [templateId]: color }));
  };

  const resetData = () => {
    if (window.confirm("This will clear THIS profile data. Continue?")) {
      setResumeData(defaultResume);
      setSelectedGradient("none");
    }
  };

  const moveSection = (direction, index) => {
    setResumeData((prev) => {
      const newOrder = [...prev.sectionConfig.order];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newOrder.length) {
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      }
      return {
        ...prev,
        sectionConfig: { ...prev.sectionConfig, order: newOrder }
      };
    });
  };

  const reorderSections = (startIndex, endIndex) => {
    setResumeData((prev) => {
      const newOrder = [...prev.sectionConfig.order];
      const [removed] = newOrder.splice(startIndex, 1);
      newOrder.splice(endIndex, 0, removed);
      return {
        ...prev,
        sectionConfig: { ...prev.sectionConfig, order: newOrder }
      };
    });
  };

  const toggleSection = (sectionName) => {
    setResumeData((prev) => ({
      ...prev,
      sectionConfig: {
        ...prev.sectionConfig,
        visible: {
          ...prev.sectionConfig.visible,
          [sectionName]: !prev.sectionConfig.visible[sectionName]
        }
      }
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        profiles,
        activeProfileId,
        setActiveProfileId,
        createNewProfile,
        deleteProfile,
        renameProfile,
        template,
        setTemplate,
        resumeData,
        setResumeData,
        updateResume,
        updateArrayField,
        addArrayItem,
        customColors,
        updateCustomColor,
        resetData,
        moveSection,
        reorderSections,
        toggleSection,
        selectedGradient,
        setSelectedGradient
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export default function useResume() {
  return useContext(ResumeContext);
}
