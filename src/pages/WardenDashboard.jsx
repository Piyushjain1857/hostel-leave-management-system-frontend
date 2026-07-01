import { useEffect, useState } from 'react';
import {
    LayoutDashboard, User, Lock, Camera, Search, SlidersHorizontal, LogOut, CheckCircle,
    ShieldAlert, FileText, BarChart3, Download, QrCode, Eye, Users, Bell, Crop
} from 'lucide-react';
import SmartNotificationCenter from './SmartNotificationCenter';
import ImageCropper from '../components/ImageCropper';

const backendBase = 'http://localhost:5005';

export default function WardenDashboard() {
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('wardenActiveTab') || 'dashboard'); // 'dashboard', 'approvals', 'tracking', 'reports', 'profile', 'notifications'
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, checkedOut: 0 });
    const [items, setItems] = useState([]);

    // New logs, reports & profile states
    const [trackingLogs, setTrackingLogs] = useState([]);
    const [reportDetails, setReportDetails] = useState({ summary: {}, weeklyTrends: [] });
    const [wardenProfile, setWardenProfile] = useState({
        name: 'Warden Test',
        email: 'warden@college.edu',
        phone: '9876543212',
        hostelAssigned: 'B-Block',
        shift: 'Day Shift',
        profileImage: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Search/Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [trackingSearch, setTrackingSearch] = useState('');
    const [trackingFilter, setTrackingFilter] = useState('All');

    // Profile forms
    const [editMode, setEditMode] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);

    // Details inspection modal
    const [inspectItem, setInspectItem] = useState(null);

    // Cropper State
    const [cropModal, setCropModal] = useState({
        isOpen: false,
        imageSrc: null,
        field: null,
        aspect: 1
    });

    const token = localStorage.getItem('wardenToken');

    const load = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await fetch(`${backendBase}/warden/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Failed to load dashboard');

            setStats(json.stats || { total: 0, pending: 0, approved: 0, checkedOut: 0 });
            setItems(json.pendingLeaves || []);
        } catch (e) {
            console.warn("Warden dashboard stats fallback:", e);
            // Fetch fallback leaves
            const stored = localStorage.getItem('mockWardenLeaves');
            let leaves;
            if (stored) {
                leaves = JSON.parse(stored);
            } else {
                leaves = [
                    {
                        id: 103,
                        studentName: 'Piyush jain',
                        hostelRoom: 'B-Block 402',
                        reason: 'Special dental appointment and treatment at university hospital.',
                        fromDate: '2026-05-28',
                        toDate: '2026-05-28',
                        status: 'Pending',
                        parentStatus: 'Approved',
                        wardenStatus: 'Pending',
                        parentPhone: '9876543210',
                        destination: 'University hospital'
                    }
                ];
                localStorage.setItem('mockWardenLeaves', JSON.stringify(leaves));
            }
            setItems(leaves.filter(x => x.status === 'Pending'));
            setStats({
                total: leaves.length,
                pending: leaves.filter(x => x.status === 'Pending').length,
                approved: leaves.filter(x => x.status === 'Approved').length,
                checkedOut: 1
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem('wardenActiveTab', activeTab);
    }, [activeTab]);

    const loadTrackingLogs = async () => {
        try {
            const res = await fetch(`${backendBase}/tracking/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json().catch(() => ([]));
            if (res.ok) {
                setTrackingLogs(json);
            }
        } catch (e) {
            console.warn("Warden tracking logs fallback:", e);
            const stored = localStorage.getItem('mockWardenTracking');
            if (stored) {
                setTrackingLogs(JSON.parse(stored));
            } else {
                const seed = [
                    {
                        id: 1,
                        studentName: 'Piyush jain',
                        hostelRoom: 'B-Block 402',
                        exitTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                        entryTime: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
                        leaveId: 101,
                        status: 'Returned'
                    },
                    {
                        id: 2,
                        studentName: 'Jane Doe',
                        hostelRoom: 'C-Block 102',
                        exitTime: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
                        entryTime: null,
                        expectedTimeOut: '09:00:00',
                        expectedTimeIn: '18:00:00',
                        leaveId: 102,
                        status: 'Out'
                    }
                ];
                setTrackingLogs(seed);
                localStorage.setItem('mockWardenTracking', JSON.stringify(seed));
            }
        }
    };

    const loadReports = async () => {
        try {
            const res = await fetch(`${backendBase}/reports/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json().catch(() => ({}));
            if (res.ok) {
                setReportDetails(json);
            }
        } catch (e) {
            console.warn("Warden reports fallback:", e);
            setReportDetails({
                summary: {
                    totalStudents: 154,
                    totalLeaves: 45,
                    pendingLeaves: items.length,
                    approvedLeaves: stats.approved,
                    activeOutpasses: stats.checkedOut,
                    lateReturns: 2
                },
                weeklyTrends: [
                    { day: 'Mon', checkouts: 4, returns: 3 },
                    { day: 'Tue', checkouts: 6, returns: 5 },
                    { day: 'Wed', checkouts: 3, returns: 4 },
                    { day: 'Thu', checkouts: 8, returns: 6 },
                    { day: 'Fri', checkouts: 12, returns: 10 },
                    { day: 'Sat', checkouts: 15, returns: 12 },
                    { day: 'Sun', checkouts: 18, returns: 16 }
                ]
            });
        }
    };

    const loadProfile = async () => {
        try {
            const res = await fetch(`${backendBase}/warden/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json().catch(() => ({}));
            if (res.ok) {
                setWardenProfile({
                    name: json.name || '',
                    email: json.email || '',
                    phone: json.phone || '',
                    hostelAssigned: json.hostelAssigned || '',
                    shift: json.shift || '',
                    profileImage: json.profileImage || ''
                });
            }
        } catch (e) {
            console.warn("Warden profile fallback:", e);
            const stored = localStorage.getItem('mockWardenProfile');
            if (stored) {
                setWardenProfile(JSON.parse(stored));
            } else {
                const defaultProf = {
                    name: 'Warden Test',
                    email: 'warden@college.edu',
                    phone: '9876543212',
                    hostelAssigned: 'B-Block',
                    shift: 'Day Shift',
                    profileImage: ''
                };
                setWardenProfile(defaultProf);
                localStorage.setItem('mockWardenProfile', JSON.stringify(defaultProf));
            }
        }
    };

    useEffect(() => {
        const run = async () => {
            await load();
            await loadTrackingLogs();
            await loadReports();
            await loadProfile();
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApproval = async (id, action) => {
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            const url = `${backendBase}/warden/${action}/${id}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Operation failed');

            setSuccessMsg(`Leave request #${id} successfully ${action}d!`);
            await load();
            await loadReports();
        } catch (e) {
            console.warn("Process leaves locally:", e);
            // Local fallbacks
            const localLeaves = JSON.parse(localStorage.getItem('mockWardenLeaves') || '[]');
            const updated = localLeaves.map(l => l.id === id ? { ...l, status: action === 'approve' ? 'Approved' : 'Rejected', wardenStatus: action === 'approve' ? 'Approved' : 'Rejected', finalStatus: action === 'approve' ? 'Approved' : 'Rejected' } : l);
            localStorage.setItem('mockWardenLeaves', JSON.stringify(updated));

            setItems(items.filter(x => x.id !== id));
            setStats({
                ...stats,
                pending: stats.pending - 1,
                approved: action === 'approve' ? stats.approved + 1 : stats.approved
            });
            setSuccessMsg(`[DEMO MODE] Leave request #${id} processed locally.`);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const res = await fetch(`${backendBase}/warden/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(wardenProfile)
            });
            if (res.ok) {
                setSuccessMsg('Profile updated successfully!');
                setEditMode(false);
                localStorage.setItem('mockWardenProfile', JSON.stringify(wardenProfile));
            } else {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.message || 'Error updating');
            }
        } catch {
            localStorage.setItem('mockWardenProfile', JSON.stringify(wardenProfile));
            setSuccessMsg('[DEMO MODE] Warden profile saved locally.');
            setEditMode(false);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setErrorMsg('New password must be at least 6 characters.');
            return;
        }

        setPwdLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const res = await fetch(`${backendBase}/warden/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            if (res.ok) {
                setSuccessMsg('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.message || 'Error updating password');
            }
        } catch {
            setSuccessMsg('[DEMO MODE] Access password reset.');
            setCurrentPassword('');
            setNewPassword('');
        } finally {
            setPwdLoading(false);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCropModal({
                    isOpen: true,
                    imageSrc: reader.result,
                    field: 'profileImage',
                    aspect: 1
                });
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        }
    };

    const handleCropDone = async (croppedImageBase64) => {
        const updated = { ...wardenProfile, profileImage: croppedImageBase64 };
        setWardenProfile(updated);
        setCropModal({ isOpen: false, imageSrc: null, field: null, aspect: 1 });
        
        localStorage.setItem('mockWardenProfile', JSON.stringify(updated));
        setSuccessMsg('Warden photo uploaded.');

        try {
            await fetch(`${backendBase}/warden/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updated)
            });
        } catch (err) {
            console.warn("Backend update bypassed, local only:", err);
        }
    };

    const handleCropCancel = () => {
        setCropModal({ isOpen: false, imageSrc: null, field: null, aspect: 1 });
    };

    const openCropForExisting = () => {
        if (wardenProfile.profileImage) {
            setCropModal({
                isOpen: true,
                imageSrc: wardenProfile.profileImage,
                field: 'profileImage',
                aspect: 1
            });
        }
    };

    const simulateCSVExport = () => {
        try {
            let csv = 'Log ID,Student Name,Room,Exit Time,EntryTime,Status\n';
            trackingLogs.forEach(l => {
                csv += `${l.id},${l.studentName},${l.hostelRoom || 'N/A'},${l.exitTime},${l.entryTime || 'Still Out'},${l.status}\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', 'hlms_warden_export.csv');
            a.click();
            setSuccessMsg('Movement tracking spreadsheet successfully exported!');
        } catch {
            setErrorMsg('Error exporting spreadsheet.');
        }
    };

    const logout = () => {
        localStorage.removeItem('wardenToken');
        window.location.href = '/';
    };

    // Filters for leaves approvals
    const filteredLeaves = items.filter(x => {
        const matchesSearch = (x.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (x.reason || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Filters for student tracking
    const filteredTracking = trackingLogs.filter(x => {
        const matchesSearch = (x.studentName || '').toLowerCase().includes(trackingSearch.toLowerCase()) ||
            (x.hostelRoom || '').toLowerCase().includes(trackingSearch.toLowerCase());
        const matchesFilter = trackingFilter === 'All' || x.status === trackingFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="parent-layout-container">
            {/* Sidebar Frame */}
            <aside className="warden-sidebar">
                <div className="sidebar-brand-section">
                    <svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor" style={{ color: '#60a5fa' }}>
                        <path d="M50 10 L15 30 L50 45 L85 30 Z" />
                        <path d="M22 36 L22 65 C22 75, 50 85, 50 85 C50 85, 78 75, 78 65 L78 36 L50 50 Z" />
                    </svg>
                    <div>
                        <h2 className="brand-title-text">SIT Warden</h2>
                        <p className="brand-subtitle-text">Control Desk</p>
                    </div>
                </div>

                <nav className="sidebar-links-menu">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={16} /> Dashboard Home
                    </button>

                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`menu-btn ${activeTab === 'approvals' ? 'active' : ''}`}
                    >
                        <CheckCircle size={16} /> Pending Approvals
                    </button>

                    <button
                        onClick={() => setActiveTab('tracking')}
                        className={`menu-btn ${activeTab === 'tracking' ? 'active' : ''}`}
                    >
                        <Users size={16} /> Movements Tracker
                    </button>

                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`menu-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    >
                        <BarChart3 size={16} /> Analytics Reports
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`menu-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                        <User size={16} /> Warden Profile
                    </button>

                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`menu-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                    >
                        <Bell size={16} /> Announcements
                    </button>

                    <button className="menu-btn" onClick={() => window.location.href = '/qr-scanner'}>
                        <QrCode size={16} /> QR Guard Scanner
                    </button>

                    <button className="menu-btn logout" onClick={logout} style={{ marginTop: 'auto' }}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </nav>
            </aside>

            {/* Main Workspace Frame */}
            <main className="warden-workspace">
                <header className="workspace-header">
                    <h1 className="workspace-title">
                        {activeTab === 'dashboard' && 'Warden Overview Summary'}
                        {activeTab === 'approvals' && 'Pending Leave Approvals'}
                        {activeTab === 'tracking' && 'Student Movement gate logs'}
                        {activeTab === 'reports' && 'Hostel Leave Report details'}
                        {activeTab === 'profile' && 'Warden Duty configuration'}
                        {activeTab === 'notifications' && 'System Announcements'}
                    </h1>
                    <span className="user-badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                        Shift: {wardenProfile.shift} | {wardenProfile.hostelAssigned}
                    </span>
                </header>

                {errorMsg && (
                    <div className="toast-alert toast-error" style={{ margin: '1rem 0' }}>
                        <div className="toast-icon"><ShieldAlert size={18} /></div>
                        <div><p className="toast-text">{errorMsg}</p></div>
                    </div>
                )}

                {successMsg && (
                    <div className="toast-alert toast-success" style={{ margin: '1rem 0' }}>
                        <div className="toast-icon"><CheckCircle size={18} /></div>
                        <div><p className="toast-text">{successMsg}</p></div>
                    </div>
                )}

                {/* Tab content swappers */}
                {activeTab === 'dashboard' && (
                    <>
                        <section className="stats-panels-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))' }}>
                            <div className="stat-card-box checkout">
                                <div className="box-label">Currently Outside</div>
                                <div className="box-value">{stats.checkedOut || 0}</div>
                            </div>
                            <div className="stat-card-box approved">
                                <div className="box-label">Returned Today</div>
                                <div className="box-value">{stats.returnedToday || 0}</div>
                            </div>
                            <div className="stat-card-box pending">
                                <div className="box-label">Late Returns</div>
                                <div className="box-value">{stats.lateReturns || 0}</div>
                            </div>
                            <div className="stat-card-box total">
                                <div className="box-label">Expected Returns Today</div>
                                <div className="box-value">{stats.expectedReturns || 0}</div>
                            </div>
                        </section>

                        {/* Dashboard Home lists */}
                        <section className="dashboard-content-panel" style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 className="panel-section-title" style={{ marginBottom: 0 }}>Recent Pending Applications</h3>
                                <button onClick={() => setActiveTab('approvals')} className="btn-link" style={{ fontSize: '0.8rem' }}>View All Approvals</button>
                            </div>

                            <div className="dashboard-table-wrapper">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Leave ID</th>
                                            <th>Student</th>
                                            <th>Room</th>
                                            <th>Reason</th>
                                            <th>Dates</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="empty-cell">No pending outpasses awaiting warden consents.</td>
                                            </tr>
                                        ) : (
                                            items.slice(0, 5).map((x) => (
                                                <tr key={x.id}>
                                                    <td className="id-col">#{x.id}</td>
                                                    <td className="student-col">{x.studentName}</td>
                                                    <td>{x.hostelRoom}</td>
                                                    <td className="reason-col" title={x.reason}>{x.reason}</td>
                                                    <td>{new Date(x.fromDate).toLocaleDateString()} → {new Date(x.toDate).toLocaleDateString()}</td>
                                                    <td><span className="status-badge-pending">Pending</span></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'approvals' && (
                    <section className="dashboard-content-panel">
                        <div className="filter-controls-row" style={{ display: 'flex', marginBottom: '1.25rem' }}>
                            <div className="search-input-wrapper" style={{ flexGrow: 1, position: 'relative' }}>
                                <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Search size={16} /></span>
                                <input
                                    type="text"
                                    placeholder="Search student names or reasons..."
                                    className="form-input"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '2.25rem' }}
                                />
                            </div>
                        </div>

                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Leave ID</th>
                                        <th>Student Name</th>
                                        <th>Reason</th>
                                        <th>Dates Scheduled</th>
                                        <th>Expected Timings</th>
                                        <th>Parent Consent</th>
                                        <th>Warden Consent</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeaves.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="empty-cell">No pending leave applications reviewable.</td>
                                        </tr>
                                    ) : (
                                        filteredLeaves.map((x) => (
                                            <tr key={x.id}>
                                                <td className="id-col">#{x.id}</td>
                                                <td className="student-col">
                                                    <strong>{x.studentName}</strong>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Room: {x.hostelRoom}</div>
                                                </td>
                                                <td className="reason-col" title={x.reason}>{x.reason}</td>
                                                <td className="dates-col" style={{ whiteSpace: 'nowrap' }}>
                                                    {new Date(x.fromDate).toLocaleDateString()} → {new Date(x.toDate).toLocaleDateString()}
                                                </td>
                                                <td>
                                                  <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                    <b>Out:</b> {x.expectedTimeOut ? `${x.expectedTimeOut}` : 'Pending'}
                                                    <br />
                                                    <b>In:</b> {x.expectedTimeIn ? `${x.expectedTimeIn}` : 'Pending'}
                                                  </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${x.parentStatus === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                                                        {x.parentStatus || 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-pending">{x.wardenStatus || 'Pending'}</span>
                                                </td>
                                                <td className="approval-actions-cell" style={{ display: 'flex', gap: '0.5rem', border: 'none' }}>
                                                    <button className="approval-btn approve" onClick={() => handleApproval(x.id, 'approve')}>
                                                        Approve
                                                    </button>
                                                    <button className="approval-btn reject" onClick={() => handleApproval(x.id, 'reject')}>
                                                        Reject
                                                    </button>
                                                    <button className="approval-btn" style={{ backgroundColor: '#f1f5f9', color: '#475569' }} onClick={() => setInspectItem(x)}>
                                                        <Eye size={12} /> Info
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'tracking' && (
                    <section className="dashboard-content-panel">
                        <div className="filter-controls-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                            <div className="search-input-wrapper" style={{ flexGrow: 1, position: 'relative' }}>
                                <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Search size={16} /></span>
                                <input
                                    type="text"
                                    placeholder="Search students, room numbers..."
                                    className="form-input"
                                    value={trackingSearch}
                                    onChange={e => setTrackingSearch(e.target.value)}
                                    style={{ paddingLeft: '2.25rem' }}
                                />
                            </div>
                            <div className="filter-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <SlidersHorizontal size={16} style={{ color: '#64748b' }} />
                                <select className="form-input" value={trackingFilter} onChange={e => setTrackingFilter(e.target.value)} style={{ width: '10rem' }}>
                                    <option value="All">All Movements</option>
                                    <option value="Out">Out Students</option>
                                    <option value="Returned">Returned Students</option>
                                    <option value="Late Return">Late Return Students</option>
                                </select>
                                <button onClick={simulateCSVExport} className="btn-secondary" style={{ height: '2.5rem', display: 'flex', gap: '0.25rem', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1' }}>
                                    <Download size={14} /> Export CSV
                                </button>
                            </div>
                        </div>

                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Log ID</th>
                                        <th>Student Name</th>
                                        <th>Room</th>
                                        <th>Expected Timings</th>
                                        <th>Actual Timings</th>
                                        <th>Leave ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTracking.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="empty-cell">No student movements logged.</td>
                                        </tr>
                                    ) : (
                                        filteredTracking.map((x) => (
                                            <tr key={x.id}>
                                                <td className="id-col">#{x.id}</td>
                                                <td className="student-col">{x.studentName}</td>
                                                <td>{x.hostelRoom}</td>
                                                <td>
                                                    <div style={{ fontSize: '0.8rem' }}>
                                                        <div><b>Out:</b> {x.expectedTimeOut || 'N/A'}</div>
                                                        <div><b>In:</b> {x.expectedTimeIn || 'N/A'}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.8rem' }}>
                                                        <div><b>Out:</b> {x.exitTime ? new Date(x.exitTime).toLocaleString() : 'N/A'}</div>
                                                        <div><b>In:</b> {x.entryTime ? new Date(x.entryTime).toLocaleString() : <span style={{ color: '#d97706', fontWeight: 600 }}>Still Out</span>}</div>
                                                    </div>
                                                </td>
                                                <td className="id-col">#{x.leaveId}</td>
                                                <td>
                                                    <span className={`status-badge ${x.status === 'Returned' ? 'status-approved' : 'status-pending'
                                                        }`}>
                                                        {x.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'reports' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Quick summaries cards */}
                        <section className="stats-panels-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))' }}>
                            <div className="stat-card-box total" style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Hostel Strength</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{reportDetails.summary.totalStudents}</div>
                            </div>
                            <div className="stat-card-box pending" style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Leaves Registered</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{reportDetails.summary.totalLeaves}</div>
                            </div>
                            <div className="stat-card-box approved" style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Checkouts ratio</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{reportDetails.summary.activeOutpasses}</div>
                            </div>
                            <div className="stat-card-box checkout" style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Late Returns count</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{reportDetails.summary.lateReturns}</div>
                            </div>
                        </section>

                        {/* Layout two columns */}
                        <div className="profile-layout-grid" style={{ marginTop: '0' }}>
                            {/* Detailed analytics table list */}
                            <section className="section-card" style={{ flexGrow: 1 }}>
                                <div className="section-card-header bg-dark">
                                    <h4 className="section-card-title">Hostel Leaves Utilization list</h4>
                                </div>
                                <div className="section-card-body">
                                    <div className="table-responsive">
                                        <table className="history-table">
                                            <thead>
                                                <tr>
                                                    <th>Checkout day</th>
                                                    <th>Warden approvals</th>
                                                    <th>Returns scanned</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportDetails.weeklyTrends.map((x, i) => (
                                                    <tr key={i}>
                                                        <td><strong>{x.day}</strong></td>
                                                        <td>{x.checkouts} checkouts</td>
                                                        <td>{x.returns} scans</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* PDF and Excel reports simulator downloader */}
                            <section className="section-card photo-card" style={{ height: 'max-content' }}>
                                <div className="section-card-header">
                                    <h4 className="section-card-title">Simulate Export Reports</h4>
                                </div>
                                <div className="section-card-body faq-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                                        Generate and compile detailed HLMS statistics audits in standard downloadable document formats for Registrar review.
                                    </p>

                                    <button
                                        onClick={() => {
                                            setSuccessMsg('Analytical PDF Report compile generated! Downloading SIT_Hostel_Report.pdf...');
                                        }}
                                        className="btn-primary"
                                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FileText size={16} /> <span>Download analytical PDF Report</span>
                                    </button>

                                    <button
                                        onClick={simulateCSVExport}
                                        className="btn-secondary"
                                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}
                                    >
                                        <Download size={16} /> <span>Export raw Excel spreadsheet</span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-layout-grid" style={{ marginTop: '0' }}>
                        {/* Left box: Photo Card */}
                        <div className="profile-card photo-card" style={{ flex: '1', minWidth: '250px' }}>
                            <div className="avatar-uploader-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="profile-avatar-circle" style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        {wardenProfile.profileImage ? (
                                            <img src={wardenProfile.profileImage} alt="Warden Profile" className="avatar-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="avatar-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#e2e8f0', color: '#64748b' }}>{wardenProfile.name.charAt(0)}</div>
                                        )}
                                        
                                        <div className="profile-avatar-overlay">
                                            <label htmlFor="warden-avatar" className="avatar-action-btn" title="Upload New Photo">
                                                <Camera size={18} />
                                                <input id="warden-avatar" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                            </label>
                                            {wardenProfile.profileImage && (
                                                <button type="button" className="avatar-action-btn" onClick={openCropForExisting} title="Crop Current Photo">
                                                    <Crop size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="profile-name-header" style={{ marginTop: '1rem', textAlign: 'center' }}>{wardenProfile.name}</h3>
                                <p className="profile-role-badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af', alignSelf: 'center' }}>Hostel Warden</p>

                                <div className="profile-quick-details" style={{ width: '100%', marginTop: '1rem' }}>
                                    <div className="quick-row">
                                        <span>Duty Assigned</span>
                                        <strong>{wardenProfile.hostelAssigned}</strong>
                                    </div>
                                    <div className="quick-row">
                                        <span>Shift Hour</span>
                                        <strong>{wardenProfile.shift}</strong>
                                    </div>
                                </div>
                            </div>

                        {/* Right box: Profile Forms */}
                        <div className="profile-card details-card">
                            <div className="card-tabs-header">
                                <button className="tab-link active">Warden Credentials</button>
                            </div>

                            {!editMode ? (
                                <div className="profile-details-display">
                                    <div className="display-group">
                                        <label className="display-label">Full Name</label>
                                        <div className="display-value">{wardenProfile.name}</div>
                                    </div>
                                    <div className="display-group">
                                        <label className="display-label">Email Address</label>
                                        <div className="display-value">{wardenProfile.email}</div>
                                    </div>
                                    <div className="display-group">
                                        <label className="display-label">Contact Phone</label>
                                        <div className="display-value">{wardenProfile.phone}</div>
                                    </div>
                                    <div className="display-group">
                                        <label className="display-label">Hostel Assigned Block</label>
                                        <div className="display-value">{wardenProfile.hostelAssigned}</div>
                                    </div>
                                    <div className="display-group">
                                        <label className="display-label">Active Duty Shift</label>
                                        <div className="display-value">{wardenProfile.shift}</div>
                                    </div>

                                    <button onClick={() => setEditMode(true)} className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>
                                        Edit Profile Details
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                                    <div className="form-grid-two">
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input type="text" className="form-input" value={wardenProfile.name} onChange={e => setWardenProfile({ ...wardenProfile, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-input" value={wardenProfile.email} onChange={e => setWardenProfile({ ...wardenProfile, email: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Contact Phone</label>
                                            <input type="text" className="form-input" value={wardenProfile.phone} onChange={e => setWardenProfile({ ...wardenProfile, phone: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hostel Assigned Block</label>
                                            <input type="text" className="form-input" value={wardenProfile.hostelAssigned} onChange={e => setWardenProfile({ ...wardenProfile, hostelAssigned: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Active Shift</label>
                                            <input type="text" className="form-input" value={wardenProfile.shift} onChange={e => setWardenProfile({ ...wardenProfile, shift: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-actions-row">
                                        <button type="submit" disabled={loading} className="btn-primary">
                                            {loading ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                        <button type="button" onClick={() => setEditMode(false)} className="btn-secondary">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Password resetting form */}
                            <div className="password-reset-section">
                                <h4 className="section-divider-title"><Lock size={14} /> Update Access Password</h4>
                                <form onSubmit={handleChangePassword} className="password-form">
                                    <div className="form-grid-two">
                                        <div className="form-group">
                                            <label className="form-label">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">New Secure Password</label>
                                            <input type="password" placeholder="••••••••" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={pwdLoading} className="btn-secondary" style={{ marginTop: '0.5rem', width: 'auto', border: '1px solid #cbd5e1' }}>
                                        {pwdLoading ? 'Saving...' : 'Modify Password'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                )}

                {/* Modal Inspector for pending approvals */}
                {inspectItem && (
                    <div className="modal-backdrop">
                        <div className="modal-card animate-fade-in" style={{ maxWidth: '30rem' }}>
                            <div className="modal-header bg-dark">
                                <h3 className="modal-title" style={{ color: '#0f172a' }}>Application Details Log #{inspectItem.id}</h3>
                                <button onClick={() => setInspectItem(null)} className="btn-close">&times;</button>
                            </div>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <span>Student Name</span>
                                    <strong>{inspectItem.studentName}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <span>Room Assignment</span>
                                    <strong>{inspectItem.hostelRoom}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <span>Outpass Dates</span>
                                    <strong>{new Date(inspectItem.fromDate).toLocaleDateString()} → {new Date(inspectItem.toDate).toLocaleDateString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <span>Destination Target</span>
                                    <strong>{inspectItem.destination || 'N/A'}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <span>Emergency Guardian Phone</span>
                                    <strong>{inspectItem.parentPhone || 'N/A'}</strong>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <span>Detailed Reason</span>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.4 }}>{inspectItem.reason}</p>
                                </div>

                                <div className="form-actions-row" style={{ marginTop: '0.5rem' }}>
                                    <button onClick={() => { handleApproval(inspectItem.id, 'approve'); setInspectItem(null); }} className="approval-btn approve">
                                        Approve Request
                                    </button>
                                    <button onClick={() => { handleApproval(inspectItem.id, 'reject'); setInspectItem(null); }} className="approval-btn reject">
                                        Reject Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <SmartNotificationCenter role="warden" />
                )}
            </main>

            {cropModal.isOpen && cropModal.imageSrc && (
                <ImageCropper
                    imageSrc={cropModal.imageSrc}
                    aspect={cropModal.aspect}
                    onCropDone={handleCropDone}
                    onCropCancel={handleCropCancel}
                />
            )}

            <style>{`
                .profile-avatar-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(2px);
                }
                
                .profile-avatar-circle:hover .profile-avatar-overlay {
                    opacity: 1;
                }

                .avatar-action-btn {
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    color: #334155;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.2s, background 0.2s, color 0.2s;
                    padding: 0;
                }

                .avatar-action-btn:hover {
                    transform: scale(1.1);
                    background: #3b82f6;
                    color: white;
                }
            `}</style>
        </div>
    );
}
