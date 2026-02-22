import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useResume from './resumecontext';
import './AdminDashboard.css';

/* ── SVG ICONS ── */
const UsersIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const FileIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const ActivityIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const DashboardIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
);

const SettingsIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const TrashIcon = ({ size = 16 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);

const LogoutIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

const SearchIcon = ({ size = 16 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);

/* ── PAGE TITLES ── */
const PAGE_META = {
    dashboard: { title: 'Overview', subtitle: 'Welcome back, Administrator' },
    users: { title: 'Manage Users', subtitle: 'View, search, and manage all accounts' },
    reports: { title: 'Reports', subtitle: 'Analytics and system insights' },
    settings: { title: 'Settings', subtitle: 'Configure system preferences' },
};

/* ── MAIN COMPONENT ── */
export default function AdminDashboard() {
    const { showToast, confirmAction } = useResume();
    const [stats, setStats] = useState({ totalUsers: 0, totalResumes: 0 });
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState({ userGrowth: [], templateStats: [], summary: {} });
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        emailNotifications: true,
        allowRegistrations: true,
        twoFactor: false,
        siteTitle: 'AdminPro'
    });
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined') return;

        let storedUser;
        try { storedUser = JSON.parse(userStr); } catch { return; }
        if (!storedUser || storedUser.role !== 'admin') return;

        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${storedUser.token}` };
                const [statsRes, usersRes, reportsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/users/stats', { headers }),
                    fetch('http://localhost:5000/api/users', { headers }),
                    fetch('http://localhost:5000/api/admin/reports', { headers }),
                ]);

                if (statsRes.status === 401 || usersRes.status === 401) {
                    setError('Unauthorized: Session expired. Please log in again.');
                    return;
                }

                if (statsRes.ok && usersRes.ok) {
                    const [statsData, usersData] = await Promise.all([statsRes.json(), usersRes.json()]);
                    setStats(statsData);
                    setUsers(usersData);

                    if (reportsRes.ok) {
                        const reportsData = await reportsRes.json();
                        setReports(reportsData);
                    }

                    // Fetch settings
                    const settingsRes = await fetch('http://localhost:5000/api/admin/settings', { headers });
                    if (settingsRes.ok) {
                        const settingsData = await settingsRes.json();
                        setSettings(settingsData);
                    }

                    setError(null);
                } else {
                    setError('Server error: Failed to load data.');
                }
            } catch {
                setError('Could not connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        confirmAction({
            title: "Delete User?",
            message: "Permanently delete this user account? All their resumes will also be removed.",
            onConfirm: async () => {
                try {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${storedUser.token}` },
                    });
                    if (res.ok) {
                        setUsers(prev => prev.filter(u => u._id !== id));
                        showToast("User deleted successfully", "success");
                    } else {
                        const data = await res.json();
                        showToast(data.message || 'Delete failed', "error");
                    }
                } catch { showToast('Network error. Please try again.', "error"); }
            }
        });
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const res = await fetch('http://localhost:5000/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedUser.token}`
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                const updatedData = await res.json();
                setSettings(updatedData);
                showToast('Settings saved successfully!', "success");
            } else {
                const data = await res.json();
                showToast(data.message || 'Failed to save settings', "error");
            }
        } catch (err) {
            showToast('Network error. Please try again.', "error");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { title, subtitle } = PAGE_META[activeTab] || PAGE_META.dashboard;

    /* Loading screen */
    if (loading) return (
        <div className="ad-loading-screen">
            <div className="ad-loading-spinner" />
            <p className="ad-loading-text">Loading Admin Panel…</p>
        </div>
    );

    return (
        <div className="ad-container">
            {/* ── SIDEBAR ── */}
            <aside className="ad-sidebar">
                <div className="ad-brand">
                    <div className="ad-brand-icon">📜</div>
                    <h1>{settings.siteTitle}</h1>
                </div>

                <p className="ad-nav-label">Main Menu</p>
                <nav className="ad-nav">
                    {[
                        { id: 'dashboard', label: 'Overview', Icon: DashboardIcon },
                        { id: 'users', label: 'Manage Users', Icon: UsersIcon },
                        { id: 'reports', label: 'Reports', Icon: FileIcon },
                        { id: 'settings', label: 'Settings', Icon: SettingsIcon },
                    ].map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            className={`ad-nav-btn ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={20} /> <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="ad-sidebar-divider" />
                <button className="ad-logout-btn" onClick={handleLogout}>
                    <LogoutIcon size={18} /> <span>Logout</span>
                </button>
            </aside>

            {/* ── MAIN ── */}
            <main className="ad-main">
                {/* Header */}
                <header className="ad-header">
                    <div className="ad-header-left">
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>
                    <div className="ad-user-info">
                        <div className="ad-user-avatar-pill">A</div>
                        <span>Administrator</span>
                        <div className="ad-online-dot" title="Online" />
                    </div>
                </header>

                {/* Error Banner */}
                {error && (
                    <div className="ad-error-banner animate-in">
                        <span>⚠️ {error}</span>
                        <button className="ad-retry-btn" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                )}

                {/* ── DASHBOARD TAB ── */}
                {activeTab === 'dashboard' && (
                    <>
                        {/* Stats */}
                        <div className="ad-stats-grid">
                            <div className="ad-stat-card card-purple">
                                <div>
                                    <p className="ad-stat-label">Total Users</p>
                                    <p className="ad-stat-value">{stats.totalUsers}</p>
                                    <p className="ad-stat-sub">↑ Registered accounts</p>
                                </div>
                                <div className="ad-stat-icon purple"><UsersIcon size={22} /></div>
                            </div>
                            <div className="ad-stat-card card-cyan">
                                <div>
                                    <p className="ad-stat-label">Total Resumes</p>
                                    <p className="ad-stat-value">{stats.totalResumes}</p>
                                    <p className="ad-stat-sub">↑ Created documents</p>
                                </div>
                                <div className="ad-stat-icon cyan"><FileIcon size={22} /></div>
                            </div>
                            <div className="ad-stat-card card-green">
                                <div>
                                    <p className="ad-stat-label">System Status</p>
                                    <p className="ad-stat-value" style={{ fontSize: '1.5rem', color: 'var(--ad-success)' }}>Healthy</p>
                                    <p className="ad-stat-sub">● All systems operational</p>
                                </div>
                                <div className="ad-stat-icon green"><ActivityIcon size={22} /></div>
                            </div>
                        </div>

                        {/* Recent Users Table */}
                        <div className="ad-section-card animate-in">
                            <div className="ad-section-header">
                                <div>
                                    <h3 className="ad-section-title">Recent User Activity</h3>
                                    <p className="ad-section-subtitle">Latest 5 registered accounts</p>
                                </div>
                                <span className="ad-badge-count">{Math.min(users.length, 5)} users</span>
                            </div>
                            <div className="ad-table-container">
                                <table className="ad-users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.slice(0, 5).map(user => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="ad-user-cell">
                                                        <div className="ad-user-avatar">{(user.name || '?')[0].toUpperCase()}</div>
                                                        <div>
                                                            <div className="ad-user-name">{user.name || 'Unknown'}</div>
                                                            <div className="ad-user-email">{user.email || '—'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className={`ad-role-badge ${user.role}`}>{user.role}</span></td>
                                                <td style={{ color: 'var(--ad-text-muted)', fontSize: '0.85rem' }}>
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td>
                                                    <div className="ad-actions">
                                                        <button onClick={() => handleDeleteUser(user._id)} className="ad-delete-btn" title="Delete User">
                                                            <TrashIcon size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ad-text-muted)', padding: '2.5rem' }}>
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ── USERS TAB ── */}
                {activeTab === 'users' && (
                    <div className="ad-section-card animate-in">
                        <div className="ad-section-header">
                            <div>
                                <h3 className="ad-section-title">All Registered Users</h3>
                                <p className="ad-section-subtitle">Manage accounts and permissions</p>
                            </div>
                            <div className="ad-search-wrapper">
                                <span className="ad-search-icon"><SearchIcon size={16} /></span>
                                <input
                                    type="text"
                                    className="ad-search-input"
                                    placeholder="Search by name or email…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="ad-table-container">
                            <table className="ad-users-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Email Address</th>
                                        <th>Joined Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="ad-user-cell">
                                                    <div className="ad-user-avatar purple">{(user.name || '?')[0].toUpperCase()}</div>
                                                    <div className="ad-user-name">{user.name || 'Unknown User'}</div>
                                                </div>
                                            </td>
                                            <td><span className={`ad-role-badge ${user.role}`}>{user.role}</span></td>
                                            <td><span className="ad-email-text">{user.email}</span></td>
                                            <td style={{ color: 'var(--ad-text-muted)', fontSize: '0.85rem' }}>
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td>
                                                <div className="ad-actions">
                                                    <button onClick={() => handleDeleteUser(user._id)} className="ad-delete-full-btn">
                                                        <TrashIcon size={14} /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ad-text-muted)', padding: '2.5rem' }}>
                                                {searchTerm ? `No results for "${searchTerm}"` : 'No users found'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── REPORTS TAB ── */}
                {activeTab === 'reports' && (
                    <div className="animate-in">
                        <div className="ad-reports-summary-grid">
                            <div className="ad-summary-mini-card">
                                <span className="ad-mini-label">Avg. Resumes/User</span>
                                <span className="ad-mini-value">{reports.summary?.avgResumesPerUser || 0}</span>
                            </div>
                            <div className="ad-summary-mini-card">
                                <span className="ad-mini-label">Active (24h)</span>
                                <span className="ad-mini-value">{reports.summary?.activeUsersLast24h || 0}</span>
                            </div>
                            <div className="ad-summary-mini-card">
                                <span className="ad-mini-label">Growth (7d)</span>
                                <span className="ad-mini-value">+{reports.userGrowth?.length || 0}</span>
                            </div>
                        </div>

                        <div className="ad-reports-grid">
                            <div className="ad-report-card highlight">
                                <div className="ad-report-header">
                                    <div className="ad-report-icon">📊</div>
                                    <h3 className="ad-report-title">User Growth (Last 7 Days)</h3>
                                </div>
                                <div className="ad-report-content">
                                    {reports.userGrowth?.length > 0 ? (
                                        <div className="ad-growth-list">
                                            {reports.userGrowth.map(item => (
                                                <div key={item._id} className="ad-growth-item">
                                                    <span className="ad-growth-date">{new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    <div className="ad-growth-bar-wrapper">
                                                        <div className="ad-growth-bar" style={{ width: `${(item.count / Math.max(...reports.userGrowth.map(g => g.count))) * 100}%` }}></div>
                                                    </div>
                                                    <span className="ad-growth-count">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="ad-no-data">No growth data available</p>
                                    )}
                                </div>
                            </div>

                            <div className="ad-report-card">
                                <div className="ad-report-header">
                                    <div className="ad-report-icon">📄</div>
                                    <h3 className="ad-report-title">Template Popularity</h3>
                                </div>
                                <div className="ad-report-content">
                                    {reports.templateStats?.length > 0 ? (
                                        <div className="ad-templates-list">
                                            {reports.templateStats.map(item => (
                                                <div key={item._id} className="ad-template-item">
                                                    <span className="ad-template-name">{item._id || 'Default'}</span>
                                                    <div className="ad-template-progress">
                                                        <div className="ad-template-progress-bar" style={{ width: `${(item.count / reports.summary.totalResumes) * 100}%` }}></div>
                                                    </div>
                                                    <span className="ad-template-count">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="ad-no-data">No template data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── SETTINGS TAB ── */}
                {activeTab === 'settings' && (
                    <div className="ad-section-card animate-in">
                        <div className="ad-section-header">
                            <div>
                                <h3 className="ad-section-title">System Settings</h3>
                                <p className="ad-section-subtitle">Configure global preferences and branding</p>
                            </div>
                            <button
                                className={`ad-save-settings-btn ${savingSettings ? 'saving' : ''}`}
                                onClick={handleSaveSettings}
                                disabled={savingSettings}
                            >
                                {savingSettings ? 'Saving...' : 'Save All Changes'}
                            </button>
                        </div>

                        <div className="ad-settings-grid">
                            <div className="ad-settings-group">
                                <h4 className="ad-settings-group-title">General Settings</h4>
                                <div className="ad-setting-item">
                                    <div className="ad-setting-info">
                                        <label className="ad-setting-label">Site Title</label>
                                        <p className="ad-setting-desc">The name of your application shown in the sidebar.</p>
                                    </div>
                                    <input
                                        type="text"
                                        className="ad-settings-input"
                                        value={settings.siteTitle}
                                        onChange={e => setSettings({ ...settings, siteTitle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="ad-settings-group">
                                <h4 className="ad-settings-group-title">Permissions & Security</h4>
                                {[
                                    { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable app access for non-admin users.' },
                                    { id: 'emailNotifications', label: 'Email Notifications', desc: 'Send automated emails to users on account changes.' },
                                    { id: 'allowRegistrations', label: 'Allow New Registrations', desc: 'Enable or disable new user sign-ups.' },
                                    { id: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins.' },
                                ].map(({ id, label, desc }) => (
                                    <div key={id} className="ad-setting-item">
                                        <div className="ad-setting-info">
                                            <div className="ad-setting-label">{label}</div>
                                            <div className="ad-setting-desc">{desc}</div>
                                        </div>
                                        <label className="ad-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings[id]}
                                                onChange={() => setSettings({ ...settings, [id]: !settings[id] })}
                                            />
                                            <span className="ad-slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
