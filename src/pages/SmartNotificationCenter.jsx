/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Search, AlertTriangle, Info, Calendar } from 'lucide-react';

export default function SmartNotificationCenter({ role = 'student' }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const tokenKey = `${role}Token`;
  const mockKey = `mock${role.charAt(0).toUpperCase() + role.slice(1)}Notifications`;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(tokenKey);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${role}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotifications(json);
      } else {
        throw new Error('API Error');
      }
    } catch (e) {
      console.warn(`Loading offline mock ${role} notifications:`, e);
      const stored = localStorage.getItem(mockKey);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 1,
            title: 'System Alert',
            message: `Welcome to the ${role} notification center.`,
            createdAt: new Date().toISOString(),
            status: 'Unread'
          }
        ];
        setNotifications(seed);
        localStorage.setItem(mockKey, JSON.stringify(seed));
      }
    } finally {
      setLoading(false);
    }
  }, [role, tokenKey, mockKey]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem(tokenKey);
      await fetch(import.meta.env.VITE_API_URL + '/notification/read-all', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role })
      });
      
      const localLeaves = JSON.parse(localStorage.getItem(mockKey) || '[]');
      const updated = localLeaves.map(n => ({ ...n, status: 'Read' }));
      localStorage.setItem(mockKey, JSON.stringify(updated));

      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Error marking read");
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem(tokenKey);
      await fetch(`${import.meta.env.VITE_API_URL}/notification/read/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      const localLeaves = JSON.parse(localStorage.getItem(mockKey) || '[]');
      const updated = localLeaves.map(n => n.id === id ? { ...n, status: 'Read' } : n);
      localStorage.setItem(mockKey, JSON.stringify(updated));

      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Error marking read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem(tokenKey);
      await fetch(`${import.meta.env.VITE_API_URL}/notification/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const localLeaves = JSON.parse(localStorage.getItem(mockKey) || '[]');
      const updated = localLeaves.filter(n => n.id !== id);
      localStorage.setItem(mockKey, JSON.stringify(updated));

      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  const getCategoryIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('security') || t.includes('alert')) return <AlertTriangle size={20} color="#ef4444" />;
    if (t.includes('leave') || t.includes('approval')) return <Check size={20} color="#10b981" />;
    return <Info size={20} color="#3b82f6" />;
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const filtered = safeNotifications.filter(n => {
    const title = n.title || '';
    const message = n.message || '';
    return (
      (title.toLowerCase().includes(searchTerm.toLowerCase()) || message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === 'All' || title.toLowerCase().includes(filterCategory.toLowerCase()))
    );
  });

  return (
    <div className="advanced-container animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={24} color="#f59e0b" /> Smart Notification Center</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Stay updated with real-time system alerts and messages.</p>
        </div>
        <button className="btn-secondary" onClick={markAllAsRead}><Check size={16} /> Mark All as Read</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="form-input-container" style={{ flex: 1 }}>
          <Search size={16} className="input-icon-left" />
          <input type="text" className="form-input" placeholder="Search notifications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Alert', 'Leave', 'System'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilterCategory(cat)}
              style={{ 
                padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #cbd5e1', cursor: 'pointer',
                background: filterCategory === cat ? '#1e293b' : '#fff', color: filterCategory === cat ? '#fff' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? <p>Loading...</p> : filtered.map(n => {
          const isUnread = n.status === 'Unread';
          return (
            <div key={n.id} className="history-item" style={{ background: isUnread ? '#f8fafc' : '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: isUnread ? '4px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', gap: '1rem' }}>
              <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '50%', height: 'fit-content' }}>
                {getCategoryIcon(n.title)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: isUnread ? '#0f172a' : '#475569' }}>{n.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12}/> {new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: '#475569', lineHeight: 1.5 }}>{n.message}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {isUnread && <button className="btn-link" onClick={() => markAsRead(n.id)} style={{ fontSize: '0.85rem' }}>Mark as read</button>}
                  <button className="btn-link" onClick={() => deleteNotification(n.id)} style={{ fontSize: '0.85rem', color: '#ef4444' }}>Delete</button>
                </div>
              </div>
            </div>
          )
        })}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>You're all caught up!</h3>
            <p style={{ margin: 0, color: '#94a3b8' }}>No new notifications to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
