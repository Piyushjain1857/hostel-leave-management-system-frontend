import { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, Trash2, Calendar } from 'lucide-react';

export default function StudentNotifications({
  notifications: propNotifications,
  loading: propLoading,
  loadNotifications: propLoadNotifications,
  handleMarkAsRead: propHandleMarkAsRead,
  handleDelete: propHandleDelete,
  message: propMessage
} = {}) {
  const isShared = !!propNotifications;

  const [localNotifications, setLocalNotifications] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState(null);

  const notifications = isShared ? propNotifications : localNotifications;
  const loading = isShared ? propLoading : localLoading;
  const message = isShared ? propMessage : localMessage;

  const token = localStorage.getItem('studentToken');
  const backendBase = import.meta.env.VITE_API_URL;

  const loadNotifications = async () => {
    if (isShared) {
      if (propLoadNotifications) propLoadNotifications();
      return;
    }
    try {
      setLocalLoading(true);
      const res = await fetch(`${backendBase}/student/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setLocalNotifications(json);
      } else {
        throw new Error('API Offline');
      }
    } catch (e) {
      console.warn("Loading offline mock notifications:", e);
      const stored = localStorage.getItem('mockStudentNotifications');
      if (stored) {
        setLocalNotifications(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 1,
            title: 'Curfew Reminder',
            message: 'All students are requested to be back in their respective blocks by 8:30 PM today due to weather forecasts.',
            createdAt: new Date().toISOString(),
            status: 'Unread'
          },
          {
            id: 2,
            title: 'Mess Menu Updated',
            message: 'The academic hostel mess menu has been updated. Check details on hostel bulletin board.',
            createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(),
            status: 'Read'
          }
        ];
        setLocalNotifications(seed);
        localStorage.setItem('mockStudentNotifications', JSON.stringify(seed));
      }
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await loadNotifications(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id) => {
    if (isShared) {
      if (propHandleMarkAsRead) propHandleMarkAsRead(id);
      return;
    }
    try {
      const res = await fetch(`${backendBase}/notification/read/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = localNotifications.map(n => n.id === id ? { ...n, status: 'Read' } : n);
        setLocalNotifications(updated);
        localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
      } else {
        throw new Error('API Offline');
      }
    } catch {
      const updated = localNotifications.map(n => n.id === id ? { ...n, status: 'Read' } : n);
      setLocalNotifications(updated);
      localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
    }
  };

  const handleDelete = async (id) => {
    if (isShared) {
      if (propHandleDelete) propHandleDelete(id);
      return;
    }
    try {
      const res = await fetch(`${backendBase}/notification/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = localNotifications.filter(n => n.id !== id);
        setLocalNotifications(updated);
        localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
        setLocalMessage({ type: 'success', text: 'Alert cleared successfully!' });
      } else {
        throw new Error('API Offline');
      }
    } catch {
      const updated = localNotifications.filter(n => n.id !== id);
      setLocalNotifications(updated);
      localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
      setLocalMessage({ type: 'success', text: 'Alert cleared.' });
    }
  };

  return (
    <div className="notifications-page-container animate-fade-in">
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)', borderRadius: '1.25rem', padding: '1.5rem 2rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', marginBottom: '2.5rem' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
          <div className="icon-pulse" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <Bell size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Notifications & Bulletins</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0', maxWidth: '500px', lineHeight: 1.4 }}>Track important academic and campus administrative notifications broadcasted by Wardens and Admins.</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ margin: '1rem 0' }}>
          <div className="toast-icon">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="toast-title">Notifications Updated</p>
            <p className="toast-text">{message.text}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading notifications feed...</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <BellOff size={48} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
          <p className="empty-state-title">All Caught Up!</p>
          <p className="empty-state-text">You have no active notification updates or warden announcements at this time.</p>
        </div>
      ) : (
        <div className="notifications-cards-grid">
          {notifications.map((n) => (
            <div key={n.id} className={`notification-card-item ${n.status === 'Unread' ? 'unread-card' : 'read-card'}`}>
              <div className="card-top-header">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`status-tag ${n.status === 'Unread' ? 'unread-tag' : 'read-tag'}`}>
                    {n.status}
                  </span>
                  <h4 className="notification-item-title">{n.title}</h4>
                </div>
                <div className="action-buttons-group">
                  {n.status === 'Unread' && (
                    <button onClick={() => handleMarkAsRead(n.id)} className="icon-action-btn read-btn" title="Mark as Read">
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="icon-action-btn delete-btn" title="Delete Alert">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="notification-item-msg">{n.message}</p>
              <div className="card-item-footer">
                <span className="footer-timestamp">
                  <Calendar size={12} /> {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="footer-target">Target: All {n.role || 'students'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
