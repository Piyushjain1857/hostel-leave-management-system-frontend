/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Megaphone, Search, Filter, Pin, Clock, User, Plus, X, Edit2, Trash2, AlertCircle } from 'lucide-react';

export default function HostelAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', priority: 'Normal', postedBy: '' });
  const [viewingItem, setViewingItem] = useState(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/announcements');
      if (res.ok) setAnnouncements(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${import.meta.env.VITE_API_URL}/api/announcements/${formData.id}` : import.meta.env.VITE_API_URL + '/api/announcements';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchAnnouncements();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAnnouncements();
        setViewingItem(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const filtered = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || a.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const pinned = filtered.filter(a => a.priority === 'High');
  const regular = filtered.filter(a => a.priority !== 'High');

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#f4f4f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#18181b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone className="text-orange-500" size={28} />
            Hostel Announcements
          </h2>
          <p style={{ color: '#52525b', marginTop: '0.25rem' }}>Stay updated with the latest notices and alerts.</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: null, title: '', description: '', priority: 'Normal', postedBy: 'Admin' }); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#f97316', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Post Announcement
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} size={20} />
          <input 
            type="text" 
            placeholder="Search titles or content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e4e4e7', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e4e4e7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Filter size={18} color="#a1a1aa" style={{ marginLeft: '0.5rem' }} />
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '0.25rem', border: 'none', outline: 'none', backgroundColor: 'transparent', fontWeight: 500, color: '#3f3f46' }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High (Pinned)</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#71717a' }}>Loading announcements...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {pinned.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#18181b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pin size={20} color="#ef4444" fill="#ef4444" /> Pinned Announcements
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {pinned.map(a => (
                  <div key={a.id} onClick={() => setViewingItem(a)} style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.2)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12}/> {a.priority}</span>
                      <span style={{ color: '#991b1b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12}/> {new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#7f1d1d', marginBottom: '0.5rem' }}>{a.title}</h4>
                    <p style={{ color: '#991b1b', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b91c1c', fontSize: '0.75rem', fontWeight: 500 }}>
                      <User size={14} /> Posted by {a.postedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#18181b', marginBottom: '1rem' }}>General Announcements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {regular.map(a => (
                <div key={a.id} onClick={() => setViewingItem(a)} style={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '0.75rem', padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ backgroundColor: '#f4f4f5', color: '#52525b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>{a.priority}</span>
                    <span style={{ color: '#a1a1aa', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12}/> {new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#27272a', marginBottom: '0.5rem' }}>{a.title}</h4>
                  <p style={{ color: '#52525b', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#71717a', fontSize: '0.75rem', fontWeight: 500 }}>
                    <User size={14} /> Posted by {a.postedBy}
                  </div>
                </div>
              ))}
              {regular.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#a1a1aa', backgroundColor: '#fff', borderRadius: '0.75rem', border: '1px dashed #e4e4e7' }}>No general announcements found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa' }}><X size={20}/></button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#18181b' }}>{formData.id ? 'Edit Announcement' : 'Post Announcement'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46' }}>Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d4d4d8' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46' }}>Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d4d4d8', backgroundColor: '#fff' }}>
                    <option value="High">High (Pinned)</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46' }}>Posted By</label>
                  <input required type="text" value={formData.postedBy} onChange={e => setFormData({...formData, postedBy: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d4d4d8' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46' }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={5} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d4d4d8', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid #d4d4d8', backgroundColor: '#fff', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500, color: '#3f3f46' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#f97316', color: '#fff', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '1rem', width: '100%', maxWidth: '600px', position: 'relative' }}>
            <button onClick={() => setViewingItem(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa' }}><X size={24}/></button>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ backgroundColor: viewingItem.priority === 'High' ? '#fee2e2' : '#f4f4f5', color: viewingItem.priority === 'High' ? '#b91c1c' : '#52525b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {viewingItem.priority === 'High' && <Pin size={14}/>} {viewingItem.priority} Priority
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181b', marginBottom: '1rem' }}>{viewingItem.title}</h2>
            
            <div style={{ display: 'flex', gap: '1.5rem', color: '#71717a', fontSize: '0.875rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e4e4e7' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><User size={16}/> {viewingItem.postedBy}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={16}/> {new Date(viewingItem.createdAt).toLocaleString()}</span>
            </div>
            
            <div style={{ color: '#3f3f46', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
              {viewingItem.description}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e4e4e7' }}>
              <button onClick={() => { setFormData(viewingItem); setViewingItem(null); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', border: '1px solid #d4d4d8', backgroundColor: '#fff', color: '#3f3f46', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                <Edit2 size={16}/> Edit
              </button>
              <button onClick={() => handleDelete(viewingItem.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', border: 'none', backgroundColor: '#ef4444', color: '#fff', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <Trash2 size={16}/> Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
