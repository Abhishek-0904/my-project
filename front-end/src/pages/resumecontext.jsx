import { createContext, useContext, useState, useEffect, useRef } from "react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

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
  dob: "",
  nationality: "",
  gender: "",
  profileImage: "",
  profileShape: "square",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ school: "", degree: "", year: "" }],
  projects: [{ title: "", link: "", description: "" }],
  skills: "",
  languages: "",
  customSections: [],
  showQRCode: true,
  jobDescription: "",
  targetRole: "",
  sectionConfig: {
    order: ["Summary", "Projects", "Experience", "Education", "Technical Skills", "Languages"],
    visible: {
      Summary: true,
      Projects: true,
      Experience: true,
      Education: true,
      "Technical Skills": true,
      Languages: true
    },
    activeExtraFields: []
  },
  designSettings: {
    // Global
    fontFamily: "Inter",
    pageBackground: "#ffffff",
    textColor: "#334155",
    fontSize: 14,
    globalScale: 1.0,
    lineHeight: 1.5,
    letterSpacing: 0,
    sectionSpacing: 18,
    pagePadding: 25,
    layoutMode: "single", // single, double, mix
    iconStyle: "border", // fill, border
    sectionTitleStyle: "plain", // plain, underline, full-underline, background-shade, side-border
    bulletPointStyle: "dot", // dot, square, arrow, checkmark
    bulletPointColor: "",
    experienceStyle: "classic", // classic, timeline, grid
    educationStyle: "classic", // classic, timeline
    skillsStyle: "badges", // list, badges, progress, dots
    projectLayout: "list", // list, grid, featured
    contactLayout: "list", // list, grid, line
    documentDecoration: "none", // none, border, side-accent
    profileImageGrayscale: false,
    profileImageBrightness: 1.0,
    iconsOnly: false,

    // Profile/Personal Info
    profileFont: "Montserrat",
    profileNameSize: 2.8,
    profileTitleSize: 1.1,
    contactIconSize: 14,
    contactSpacing: 8,
    headerAlignment: "left", // left, center, right

    // Summary
    summaryFont: "Lora",
    summaryFontSize: 14,
    summaryLineHeight: 1.6,
    summaryFontStyle: "normal",
    summaryAlignment: "left",
    summaryColor: "",

    // Experience
    experienceTitleFont: "Montserrat",
    experienceTitleSize: 1.1,
    experienceCompanySize: 14,
    experienceBodySize: 13,
    experienceItemSpacing: 15,
    experienceAlignment: "left",
    experienceColor: "",

    // Education
    educationTitleSize: 1.1,
    educationInstitutionSize: 14,
    educationItemSpacing: 12,
    educationAlignment: "left",
    educationColor: "",

    // Projects
    projectTitleSize: 1.1,
    projectDescSize: 13,
    projectItemSpacing: 15,
    projectAlignment: "left",
    projectColor: "",

    // Technical Skills
    skillsAlignment: "left",
    skillsColor: "",

    // Languages
    languagesAlignment: "left",
    languagesColor: "",

    // Generic Section Headings (Fallback)
    sectionHeadingFont: "Montserrat",
    sectionHeadingSize: 1.0,
    sectionHeadingWeight: 700
  }
};

export function ResumeProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [template, setTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState(defaultResume);
  const [selectedGradient, setSelectedGradient] = useState("none");
  const [customColors, setCustomColors] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const confirmAction = (config) => {
    setConfirmModal({ ...config, isOpen: true });
  };

  const saveTimeoutRef = useRef(null);

  const getAuthToken = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === "undefined") return null;
      const user = JSON.parse(userStr);
      return user?.token;
    } catch (e) {
      console.error("Error getting auth token:", e);
      return null;
    }
  };

  // 1. Initial Load and Session Sync
  const fetchProfiles = async () => {
    const token = getAuthToken();

    // If no token (logged out), clear all data
    if (!token) {
      setProfiles([]);
      setActiveProfileId(null);
      setResumeData(defaultResume);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfiles(data);
        if (data.length > 0) {
          const lastActiveId = localStorage.getItem("activeProfileId");
          const initialId = data.find(p => p._id === lastActiveId)?._id || data[0]._id;
          setActiveProfileId(initialId);
        } else {
          setActiveProfileId(null);
          setResumeData(defaultResume);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    }
  };

  useEffect(() => {
    fetchProfiles();

    // Listen for storage changes (for cross-tab logout/login)
    const handleStorageChange = (e) => {
      if (e.key === 'user') fetchProfiles();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2. Switch Active Profile (Only when ID changes or first load)
  useEffect(() => {
    if (!activeProfileId || profiles.length === 0) return;

    const active = profiles.find(p => p._id === activeProfileId);
    if (active) {
      // Only set if it's actually different or if we don't have data yet
      setTemplate(active.template || "modern");
      setResumeData(active.data || defaultResume);
      setSelectedGradient(active.gradient || "none");
      localStorage.setItem("activeProfileId", activeProfileId);
    }
  }, [activeProfileId, profiles.length]); // Only react to ID change or initial list load

  // 3. Safety Sync: Ensure custom sections show up in Manage Sections
  useEffect(() => {
    if (resumeData.customSections?.length > 0) {
      setResumeData(prev => {
        const order = prev.sectionConfig?.order || ["Summary", "Projects", "Experience", "Education", "Technical Skills", "Languages"];
        const visible = prev.sectionConfig?.visible || {};
        let updated = false;

        const newOrder = [...order];
        const newVisible = { ...visible };

        prev.customSections.forEach(sec => {
          if (sec.title && !newOrder.includes(sec.title)) {
            newOrder.push(sec.title);
            if (newVisible[sec.title] === undefined) newVisible[sec.title] = true;
            updated = true;
          }
        });

        if (updated) {
          return {
            ...prev,
            sectionConfig: { ...prev.sectionConfig, order: newOrder, visible: newVisible }
          };
        }
        return prev;
      });
    }
  }, [resumeData.customSections]);

  // 4. Migration: Rename 'Skills' to 'Technical Skills' in order/visible for existing profiles
  useEffect(() => {
    setResumeData(prev => {
      const order = prev.sectionConfig?.order || [];
      const visible = prev.sectionConfig?.visible || {};
      let changed = false;

      // Update order
      const newOrder = order.map(item => {
        if (item === "Skills") {
          // Only rename if it's NOT a custom section already named Skills
          const isCustom = prev.customSections?.some(s => s.title === "Skills");
          if (!isCustom) {
            changed = true;
            return "Technical Skills";
          }
        }
        return item;
      });

      // Update visible keys
      const newVisible = { ...visible };
      if (visible["Skills"] !== undefined && visible["Technical Skills"] === undefined) {
        const isCustom = prev.customSections?.some(s => s.title === "Skills");
        if (!isCustom) {
          newVisible["Technical Skills"] = visible["Skills"];
          delete newVisible["Skills"];
          changed = true;
        }
      }

      if (changed) {
        return {
          ...prev,
          sectionConfig: {
            ...prev.sectionConfig,
            order: newOrder,
            visible: newVisible
          }
        };
      }
      return prev;
    });
  }, []); // Run once on load/init

  // 5. Auto-Save to Backend (Debounced)
  useEffect(() => {
    if (!activeProfileId) return;

    // Debounce API call
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    setIsSyncing(true); // Start showing "Saving..."

    saveTimeoutRef.current = setTimeout(async () => {
      const token = getAuthToken();
      if (!token) {
        setIsSyncing(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/resumes/${activeProfileId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: resumeData.name ? `${resumeData.name}'s Resume` : 'Untitled Resume',
            template,
            data: resumeData,
            gradient: selectedGradient
          })
        });

        if (res.ok) {
          const updated = await res.json();
          setProfiles(prev => prev.map(p => p._id === activeProfileId ? updated : p));
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setIsSyncing(false); // Done saving
      }
    }, 2000);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [resumeData, template, selectedGradient, activeProfileId]);

  const createNewProfile = async (profileName = "New Resume", templateId = "modern") => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: profileName,
          template: templateId,
          data: defaultResume
        })
      });
      const newProfile = await res.json();
      if (res.ok) {
        setProfiles(prev => [newProfile, ...prev]);
        setActiveProfileId(newProfile._id);
        showToast("New resume created!", "success");
      }
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const deleteProfile = async (id) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProfiles(prev => {
          const filtered = prev.filter(p => p._id !== id);
          if (activeProfileId === id) {
            setActiveProfileId(filtered.length > 0 ? filtered[0]._id : null);
          }
          return filtered;
        });
        showToast("Resume deleted successfully", "success");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Delete failed", "error");
    }
  };

  const renameProfile = async (id, newName) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newName })
      });
      if (res.ok) {
        setProfiles(prev => prev.map(p => p._id === id ? { ...p, title: newName } : p));
        showToast("Resume renamed successfully", "success");
      }
    } catch (err) {
      console.error("Rename failed:", err);
      showToast("Rename failed", "error");
    }
  };

  const updateResume = (field, value) => setResumeData(prev => ({ ...prev, [field]: value }));

  const updateArrayField = (field, index, subField, value) => {
    setResumeData(prev => {
      const arr = [...(prev[field] || [])];
      if (arr[index]) {
        arr[index] = { ...arr[index], [subField]: value };
      }
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, defaultItem) => {
    setResumeData(prev => {
      const newData = { ...prev, [field]: [...(prev[field] || []), defaultItem] };

      // If adding a custom section, also add it to the section order/config
      if (field === "customSections" && defaultItem.title) {
        const sectionName = defaultItem.title;
        if (!newData.sectionConfig.order.includes(sectionName)) {
          newData.sectionConfig = {
            ...newData.sectionConfig,
            order: [...newData.sectionConfig.order, sectionName],
            visible: { ...newData.sectionConfig.visible, [sectionName]: true }
          };
        }
      }
      return newData;
    });
  };

  const removeArrayItem = (field, index) => {
    setResumeData(prev => {
      const newList = [...(prev[field] || [])];
      const removedItem = newList[index];
      newList.splice(index, 1);

      const newData = { ...prev, [field]: newList };

      // If removing a custom section, also remove it from the section order
      if (field === "customSections" && removedItem?.title) {
        const sectionName = removedItem.title;
        newData.sectionConfig = {
          ...newData.sectionConfig,
          order: newData.sectionConfig.order.filter(name => name !== sectionName),
          visible: { ...newData.sectionConfig.visible }
        };
        delete newData.sectionConfig.visible[sectionName];
      }
      return newData;
    });
  };

  const updateCustomColor = (templateId, color) => setCustomColors(prev => ({ ...prev, [templateId]: color }));

  const resetData = () => {
    // We can't easily toast a confirmation without more logic, but we can replace the internal alerts later.
    if (window.confirm("Clear all data in this resume?")) {
      setResumeData(defaultResume);
      showToast("Data reset successful", "info");
    }
  };

  const moveSection = (direction, index) => {
    setResumeData((prev) => {
      const newOrder = [...prev.sectionConfig.order];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newOrder.length) {
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      }
      return { ...prev, sectionConfig: { ...prev.sectionConfig, order: newOrder } };
    });
  };

  const reorderSections = (startIndex, endIndex) => {
    setResumeData((prev) => {
      const newOrder = [...prev.sectionConfig.order];
      const [removed] = newOrder.splice(startIndex, 1);
      newOrder.splice(endIndex, 0, removed);
      return { ...prev, sectionConfig: { ...prev.sectionConfig, order: newOrder } };
    });
  };

  const reorderArrayItems = (field, startIndex, endIndex, customSectionIdx = null) => {
    setResumeData(prev => {
      if (customSectionIdx !== null) {
        const sections = [...prev.customSections];
        const items = [...sections[customSectionIdx].items];
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);
        sections[customSectionIdx] = { ...sections[customSectionIdx], items };
        return { ...prev, customSections: sections };
      } else {
        const list = [...(prev[field] || [])];
        const [removed] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, removed);
        return { ...prev, [field]: list };
      }
    });
  };

  const toggleSection = (sectionName) => {
    setResumeData((prev) => ({
      ...prev,
      sectionConfig: {
        ...prev.sectionConfig,
        visible: { ...prev.sectionConfig.visible, [sectionName]: !prev.sectionConfig.visible[sectionName] }
      }
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        profiles,
        activeProfileId,
        setActiveProfileId,
        template,
        setTemplate,
        resumeData,
        updateResume,
        updateArrayField,
        addArrayItem,
        removeArrayItem,
        createNewProfile,
        deleteProfile,
        renameProfile,
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
        confirmAction,
        fetchProfiles
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </ResumeContext.Provider>
  );
}

export default function useResume() {
  return useContext(ResumeContext);
}
