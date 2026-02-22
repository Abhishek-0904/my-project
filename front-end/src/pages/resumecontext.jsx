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

  // 3. Auto-Save to Backend (Debounced)
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
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [subField]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, defaultItem) => setResumeData(prev => ({ ...prev, [field]: [...prev[field], defaultItem] }));

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
        toggleSection,
        isSyncing,
        toast,
        showToast,
        setToast,
        confirmAction
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
