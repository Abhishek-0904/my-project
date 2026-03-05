import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useResume from './resumecontext';
import {
    PlusIcon,
    LayoutIcon,
    UserIcon,
    LogoutIcon,
    TrashIcon,
    EditIcon,
    SettingsIcon,
    FileTextIcon
} from '../components/DashboardIcons';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import './UserDashboard.css';

export default function UserDashboard() {
    const { profiles, deleteProfile, setActiveProfileId, showToast, confirmAction } = useResume();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('resumes');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) return;

            try {
                const res = await fetch('http://localhost:5000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${storedUser.token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setUser({ ...data, token: storedUser.token });
                } else {
                    setUser(storedUser);
                }
            } catch (err) {
                setUser(storedUser);
            }
        };
        fetchProfile();
    }, []);

    const handleEdit = (id) => {
        setActiveProfileId(id);
        navigate('/form');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                showToast("Account settings updated successfully!", "success");
            } else {
                showToast(data.message || "Failed to update profile", "error");
            }
        } catch (err) {
            showToast("Connection error", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return (
        <div className="ud-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="ud-avatar-large animate-in">📜</div>
        </div>
    );

    return (
        <div className="ud-container">
            {/* ── SIDEBAR ── */}
            <aside className="ud-sidebar">
                <div className="ud-brand" onClick={() => navigate('/templates')}>
                    <div className="ud-brand-logo">📄</div>
                    <h1>ResumePro</h1>
                </div>

                <p className="ud-nav-label">Workspace</p>
                <nav className="ud-nav">
                    <button
                        className={`ud-nav-btn ${activeTab === 'resumes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resumes')}
                    >
                        <LayoutIcon size={20} />
                        <span>My Resumes</span>
                    </button>
                    <button
                        className="ud-nav-btn"
                        onClick={() => navigate('/templates')}
                    >
                        <PlusIcon size={20} />
                        <span>Browse Templates</span>
                    </button>
                    <button
                        className={`ud-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <UserIcon size={20} />
                        <span>Account Settings</span>
                    </button>
                    <button
                        className={`ud-nav-btn ${activeTab === 'coverletter' ? 'active' : ''}`}
                        onClick={() => setActiveTab('coverletter')}
                    >
                        <FileTextIcon size={20} />
                        <span>AI Cover Letter</span>
                    </button>
                </nav>

                <div className="ud-sidebar-footer">
                    <div className="ud-user-pill">
                        <div className="ud-avatar-small">{(user.name || 'U')[0]}</div>
                        <div className="ud-user-details">
                            <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user.name}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--up-text-muted)' }}>Pro Member</p>
                        </div>
                    </div>
                    <button className="ud-logout-btn-full" onClick={handleLogout}>
                        <LogoutIcon size={18} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="ud-main">

                {/* ── MY RESUMES TAB ── */}
                {activeTab === 'resumes' && (
                    <div className="animate-in">
                        <header className="ud-header">
                            <div>
                                <h2>Your Dashboard</h2>
                                <p>Manage your professional applications in one place</p>
                            </div>
                            <button className="ud-create-main-btn" onClick={() => navigate('/templates')}>
                                <PlusIcon size={24} />
                                <span>Build New Resume</span>
                            </button>
                        </header>

                        <div className="ud-resumes-grid">
                            {profiles.map((resume, idx) => (
                                <div key={resume._id} className="ud-resume-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="ud-resume-visual">
                                        <span className="ud-visual-icon">📄</span>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'var(--up-primary)'
                                        }} />
                                    </div>
                                    <div className="ud-resume-info">
                                        <h3>{resume.title}</h3>
                                        <div className="ud-time-badge">
                                            🕒 Last Modified: {new Date(resume.lastModified).toLocaleDateString()}
                                        </div>
                                        <div className="ud-card-actions">
                                            <button className="ud-edit-btn" onClick={() => handleEdit(resume._id)}>
                                                <EditIcon size={16} /> Edit
                                            </button>
                                            <button
                                                className="ud-delete-mini-btn"
                                                onClick={() => {
                                                    confirmAction({
                                                        title: "Delete Resume?",
                                                        message: "Are you sure you want to delete this resume permanently?",
                                                        onConfirm: () => deleteProfile(resume._id)
                                                    });
                                                }}
                                                title="Delete Resume"
                                            >
                                                <TrashIcon size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {profiles.length === 0 && (
                                <div className="ud-empty-state">
                                    <div className="ud-empty-icon">📝</div>
                                    <h3>No resumes found</h3>
                                    <p>Start your professional journey by picking a template</p>
                                    <button className="ud-create-main-btn" onClick={() => navigate('/templates')}>
                                        Explore Templates
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── ACCOUNT TAB ── */}
                {activeTab === 'account' && (
                    <div className="animate-in">
                        <header className="ud-header">
                            <div>
                                <h2>Security & Profile</h2>
                                <p>Manage your account credentials and basic information</p>
                            </div>
                        </header>

                        <div className="ud-account-grid">
                            <div className="ud-account-card">
                                <div className="ud-account-header">
                                    <div className="ud-avatar-large">{(user.name || 'U')[0]}</div>
                                    <div className="ud-profile-info">
                                        <h3>{user.name}</h3>
                                        <span className="ud-badge-premium">PREMIUM MEMBER</span>
                                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                            <div className="ud-time-badge">📧 {user.email}</div>
                                            <div className="ud-time-badge">📅 Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ud-account-card">
                                <form onSubmit={handleUpdateAccount}>
                                    <div className="ud-form-group">
                                        <label>Display Name</label>
                                        <input
                                            type="text"
                                            className="ud-input-v2"
                                            value={user.name || ''}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="ud-form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            className="ud-input-v2"
                                            value={user.email || ''}
                                            readOnly
                                            style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }}
                                        />
                                        <p style={{ fontSize: '0.7rem', color: 'var(--up-text-muted)', marginTop: '0.5rem' }}>
                                            Email cannot be changed for security reasons.
                                        </p>
                                    </div>

                                    <div className="ud-form-group" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--up-border)' }}>
                                        <label>Update Password</label>
                                        <input
                                            type="password"
                                            className="ud-input-v2"
                                            placeholder="Enter new password"
                                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                                        />
                                        <p style={{ fontSize: '0.7rem', color: 'var(--up-text-muted)', marginTop: '0.5rem' }}>
                                            Keep empty if you don't want to change it.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="ud-save-profile-btn"
                                        disabled={saving}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        {saving ? "Updating Security..." : "Save Account Changes"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── COVER LETTER TAB ── */}
                {activeTab === 'coverletter' && (
                    <div className="animate-in">
                        <header className="ud-header">
                            <div>
                                <h2>AI Cover Letter Generator</h2>
                                <p>Generate a tailored cover letter using your resume data</p>
                            </div>
                        </header>

                        <CoverLetterGenerator profiles={profiles} />
                    </div>
                )}

            </main>
        </div>
    );
}
