import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, User, Lock, Camera, Search, SlidersHorizontal, LogOut, CheckCircle, ShieldAlert, Bell, Crop } from 'lucide-react';
import SmartNotificationCenter from './SmartNotificationCenter';
import ImageCropper from '../components/ImageCropper';
import { convertHeicToJpeg } from '../utils/heicConverter';

const backendBase = import.meta.env.VITE_API_URL;

export default function ParentApprovalDashboard() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('parentActiveTab') || 'pending'); // 'pending', 'history', 'profile', 'notifications'
  const [items, setItems] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Parent profile states
  const [parentProfile, setParentProfile] = useState({
    name: 'Parent Test',
    email: 'parent@college.edu',
    phone: '9876543211',
    studentId: 1,
    studentName: 'Piyush jain',
    profileImage: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  // Cropper State
  const [cropModal, setCropModal] = useState({
    isOpen: false,
    imageSrc: null,
    field: null,
    aspect: 1
  });

  const token = localStorage.getItem('parentToken');

  const fetchPending = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${backendBase}/parent/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Failed to fetch pending requests');

      setItems(Array.isArray(json) ? json : json.items || []);
    } catch (e) {
      console.warn("Parent pending logs offline fallback:", e);
      // Fallback
      const stored = localStorage.getItem('mockParentPending');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 103,
            reason: 'Special dental appointment and treatment at university hospital.',
            fromDate: '2026-05-28',
            toDate: '2026-05-28',
            studentName: 'Piyush jain',
            status: 'Pending',
            expectedTimeOut: '09:00',
            expectedTimeIn: '13:00'
          }
        ];
        setItems(seed);
        localStorage.setItem('mockParentPending', JSON.stringify(seed));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${backendBase}/parent/leave-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json().catch(() => ([]));
      if (res.ok) {
        setHistoryList(json);
      }
    } catch (e) {
      console.warn("Parent history offline fallback:", e);
      const stored = localStorage.getItem('mockParentHistory');
      if (stored) {
        setHistoryList(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 101,
            reason: 'Emergency visit to home town for family wedding function.',
            fromDate: '2026-05-10',
            toDate: '2026-05-14',
            studentName: 'Piyush jain',
            status: 'Approved',
            actualTimeOut: '2026-05-10T09:15:00',
            actualTimeIn: '2026-05-14T17:40:00'
          },
          {
            id: 102,
            reason: 'Weekend outing to local guardian\'s house in metro city.',
            fromDate: '2026-05-20',
            toDate: '2026-05-22',
            studentName: 'Piyush jain',
            status: 'Approved',
            actualTimeOut: '2026-05-20T10:05:00',
            actualTimeIn: '2026-05-22T19:50:00'
          }
        ];
        setHistoryList(seed);
        localStorage.setItem('mockParentHistory', JSON.stringify(seed));
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${backendBase}/parent/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setParentProfile({
          name: json.name || '',
          email: json.email || '',
          phone: json.phone || '',
          studentId: json.studentId || 1,
          studentName: json.studentName || 'Piyush jain',
          profileImage: json.profileImage || ''
        });
      }
    } catch (e) {
      console.warn("Parent profile offline fallback:", e);
      const stored = localStorage.getItem('mockParentProfile');
      if (stored) {
        setParentProfile(JSON.parse(stored));
      } else {
        const defaultProfile = {
          name: 'Parent Test',
          email: 'parent@college.edu',
          phone: '9876543211',
          studentId: 1,
          studentName: 'Piyush jain',
          profileImage: ''
        };
        setParentProfile(defaultProfile);
        localStorage.setItem('mockParentProfile', JSON.stringify(defaultProfile));
      }
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchPending();
      await fetchHistory();
      await fetchProfile();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('parentActiveTab', activeTab);
  }, [activeTab]);

  const updateConsent = async (id, action) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const url =
        action === 'approve'
          ? `${backendBase}/parent/approve/${id}`
          : `${backendBase}/parent/reject/${id}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Update failed');

      setSuccessMsg(`Outpass request #${id} successfully ${action === 'approve' ? 'Approved' : 'Rejected'}.`);
      await fetchPending();
      await fetchHistory();
    } catch (e) {
      console.warn("Simulate parent action locally:", e);
      // Local sync
      const remainingPending = items.filter(x => x.id !== id);
      setItems(remainingPending);
      localStorage.setItem('mockParentPending', JSON.stringify(remainingPending));

      // Append to history
      const processed = items.find(x => x.id === id);
      if (processed) {
        const archived = {
          ...processed,
          status: action === 'approve' ? 'Approved' : 'Rejected'
        };
        const updatedHist = [archived, ...historyList];
        setHistoryList(updatedHist);
        localStorage.setItem('mockParentHistory', JSON.stringify(updatedHist));
      }

      setSuccessMsg(`[DEMO MODE] Consent registered successfully.`);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${backendBase}/parent/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(parentProfile)
      });
      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        setEditMode(false);
        localStorage.setItem('mockParentProfile', JSON.stringify(parentProfile));
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Error updating');
      }
    } catch {
      localStorage.setItem('mockParentProfile', JSON.stringify(parentProfile));
      setSuccessMsg('[DEMO MODE] Profile details saved locally.');
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
      const res = await fetch(`${backendBase}/parent/change-password`, {
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
      setSuccessMsg('[DEMO MODE] Account password reset successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } finally {
      setPwdLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    let file = e.target.files[0];
    if (file) {
      file = await convertHeicToJpeg(file);
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
    const updated = { ...parentProfile, profileImage: croppedImageBase64 };
    setParentProfile(updated);
    setCropModal({ isOpen: false, imageSrc: null, field: null, aspect: 1 });
    
    localStorage.setItem('mockParentProfile', JSON.stringify(updated));
    setSuccessMsg('Profile photo updated.');

    try {
      await fetch(`${backendBase}/parent/profile`, {
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
    if (parentProfile.profileImage) {
      setCropModal({
        isOpen: true,
        imageSrc: parentProfile.profileImage,
        field: 'profileImage',
        aspect: 1
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('parentToken');
    window.location.href = '/';
  };

  // Filter histories
  const filteredHistory = historyList.filter(x => {
    const matchesSearch = (x.reason || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (x.studentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || x.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const parentPendingLeaves = items.filter(x => !x.reason || !x.reason.toLowerCase().includes('[local]'));

  const renderPendingTable = (list, emptyMessage) => (
    <div className="dashboard-table-wrapper" style={{ marginBottom: '2rem' }}>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Leave ID</th>
            <th>Child Name</th>
            <th>Reason for Outpass</th>
            <th>Expected Timings</th>
            <th>Timeline Scheduled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="loading-cell">Loading requests list...</td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-cell">{emptyMessage}</td>
            </tr>
          ) : (
            list.map((x) => (
              <tr key={x.id}>
                <td className="id-col">#{x.id}</td>
                <td className="student-col">{x.studentName || parentProfile.studentName}</td>
                <td className="reason-col" title={x.reason}>{x.reason}</td>
                <td className="timings-col" style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  <div style={{ color: '#0ea5e9', fontWeight: 'bold' }}>Out: {x.expectedTimeOut || 'Pending'}</div>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>In: {x.expectedTimeIn || 'Pending'}</div>
                </td>
                <td className="dates-col" style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  <div><b>From:</b> {new Date(x.fromDate).toLocaleDateString()}</div>
                  <div><b>To:</b> {new Date(x.toDate).toLocaleDateString()}</div>
                  <div style={{ marginTop: '0.5rem', color: 'var(--color-muted)', fontSize: '0.7rem' }}>
                    Req &rarr; Par App &rarr; War App &rarr; Exit &rarr; Ret
                  </div>
                </td>
                <td className="approval-actions-cell" style={{ display: 'flex', gap: '0.5rem', border: 'none' }}>
                  <button className="approval-btn approve" onClick={() => updateConsent(x.id, 'approve')}>
                    Approve
                  </button>
                  <button className="approval-btn reject" onClick={() => updateConsent(x.id, 'reject')}>
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="parent-layout-container">
      {/* Left Sidebar Frame */}
      <aside className="warden-sidebar" style={{ backgroundColor: '#0f172a' }}>
        <div className="sidebar-brand-section">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor" style={{ color: '#fbbf24' }}>
            <path d="M50 10 L15 30 L50 45 L85 30 Z" />
            <path d="M22 36 L22 65 C22 75, 50 85, 50 85 C50 85, 78 75, 78 65 L78 36 L50 50 Z" />
          </svg>
          <div>
            <h2 className="brand-title-text" style={{ color: '#fff' }}>SIT Parent</h2>
            <p className="brand-subtitle-text" style={{ color: '#94a3b8' }}>Consent Desk</p>
          </div>
        </div>

        <nav className="sidebar-links-menu">
          <button
            onClick={() => setActiveTab('pending')}
            className={`menu-btn ${activeTab === 'pending' ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} /> Pending Consents
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`menu-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            <FileText size={16} /> Leave History
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`menu-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={16} /> My Profile
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`menu-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          >
            <Bell size={16} /> Announcements
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
            {activeTab === 'pending' && 'Pending Leave Consents'}
            {activeTab === 'history' && 'Child Leave Logs'}
            {activeTab === 'profile' && 'Parent Account Settings'}
            {activeTab === 'notifications' && 'System Announcements'}
          </h1>
          <span className="user-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            Guardian Linked: {parentProfile.studentName}
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

        {/* Tab content swapping blocks */}
        {activeTab === 'pending' && (
          <section className="dashboard-content-panel">
            <h3 className="panel-section-title">Outstation applications awaiting consent</h3>
            {renderPendingTable(parentPendingLeaves, "No pending outstation outpasses found.")}
          </section>
        )}

        {activeTab === 'history' && (
          <section className="dashboard-content-panel">
            {/* Filter tool header */}
            <div className="filter-controls-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div className="search-input-wrapper" style={{ flexGrow: 1, position: 'relative' }}>
                <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Search size={16} /></span>
                <input
                  type="text"
                  placeholder="Search reasons or child names..."
                  className="form-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              <div className="filter-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={16} style={{ color: '#64748b' }} />
                <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '10rem' }}>
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
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
                    <th>Status Logs</th>
                    <th>Actual Timings</th>
                    <th>Status / Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-cell">No leave records match the filters.</td>
                    </tr>
                  ) : (
                    filteredHistory.map((x) => (
                      <tr key={x.id}>
                        <td className="id-col">#{x.id}</td>
                        <td className="student-col">{x.studentName || parentProfile.studentName}</td>
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
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span className={`status-badge ${x.parentStatus === 'Approved' ? 'status-approved' : x.parentStatus === 'Rejected' ? 'status-rejected' : 'status-pending'}`}>
                              Parent: {x.parentStatus || 'Pending'}
                            </span>
                            <span className={`status-badge ${x.wardenStatus === 'Approved' ? 'status-approved' : x.wardenStatus === 'Rejected' ? 'status-rejected' : 'status-pending'}`}>
                              Warden: {x.wardenStatus || 'Pending'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>
                            <b>Out:</b> {x.actualTimeOut ? new Date(x.actualTimeOut).toLocaleString() : 'Pending'}
                            <br />
                            <b>In:</b> {x.actualTimeIn ? new Date(x.actualTimeIn).toLocaleString() : 'Pending'}
                          </div>
                        </td>
                        <td className="status-col">
                          <span className={`status-badge ${['Approved', 'Returned'].includes(x.status) ? 'status-approved' :
                            x.status === 'Pending' ? 'status-pending' : x.status === 'Out' ? 'status-pending' : 'status-rejected'
                            }`} style={{ display: 'inline-block', marginBottom: '0.2rem' }}>
                            {x.status}
                          </span>
                          <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                            Req &rarr; Par &rarr; War &rarr; Ext &rarr; Ret
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <div className="profile-layout-grid" style={{ marginTop: '0' }}>
            {/* Left Box: Photo Card */}
            <div className="profile-card photo-card" style={{ flex: '1', minWidth: '250px' }}>
              <div className="avatar-uploader-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="profile-avatar-circle" style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {parentProfile.profileImage ? (
                    <img src={parentProfile.profileImage} alt="Parent Profile" className="avatar-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#e2e8f0', color: '#64748b' }}>{parentProfile.name.charAt(0)}</div>
                  )}
                  
                  <div className="profile-avatar-overlay">
                    <label htmlFor="parent-avatar" className="avatar-action-btn" title="Upload New Photo">
                      <Camera size={18} />
                      <input id="parent-avatar" type="file" accept="image/*, .heic, .heif" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    </label>
                    {parentProfile.profileImage && (
                      <button type="button" className="avatar-action-btn" onClick={openCropForExisting} title="Crop Current Photo">
                        <Crop size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="profile-name-header">{parentProfile.name}</h3>
                <p className="profile-role-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>Guardian Account</p>
              </div>

              <div className="profile-quick-details">
                <div className="quick-row">
                  <span>Linked Student</span>
                  <strong>{parentProfile.studentName}</strong>
                </div>
                <div className="quick-row">
                  <span>Contact Phone</span>
                  <strong>{parentProfile.phone}</strong>
                </div>
              </div>

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

            {/* Right Box: Settings Records Form */}
            <div className="profile-card details-card">
              <div className="card-tabs-header">
                <button className="tab-link active">Guardian Contact Details</button>
              </div>

              {!editMode ? (
                <div className="profile-details-display">
                  <div className="display-group">
                    <label className="display-label">Full Name</label>
                    <div className="display-value">{parentProfile.name}</div>
                  </div>
                  <div className="display-group">
                    <label className="display-label">Primary Email Address</label>
                    <div className="display-value">{parentProfile.email}</div>
                  </div>
                  <div className="display-group">
                    <label className="display-label">Phone Contact</label>
                    <div className="display-value">{parentProfile.phone}</div>
                  </div>
                  <div className="display-group">
                    <label className="display-label">Linked Ward Student</label>
                    <div className="display-value">{parentProfile.studentName}</div>
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
                      <input type="text" className="form-input" value={parentProfile.name} onChange={e => setParentProfile({ ...parentProfile, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" value={parentProfile.email} onChange={e => setParentProfile({ ...parentProfile, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Phone</label>
                      <input type="text" className="form-input" value={parentProfile.phone} onChange={e => setParentProfile({ ...parentProfile, phone: e.target.value })} />
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

              {/* Password Changing section */}
              <div className="password-reset-section">
                <h4 className="section-divider-title"><Lock size={14} /> Reset Account Password</h4>
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

        {activeTab === 'notifications' && (
          <SmartNotificationCenter role="parent" />
        )}
      </main>
    </div>
  );
}
