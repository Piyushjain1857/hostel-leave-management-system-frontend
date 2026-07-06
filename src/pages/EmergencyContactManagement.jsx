/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { PhoneCall, Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';

export default function EmergencyContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, studentId: '', name: '', relation: '', phone: '', address: '' });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/emergency-contacts');
      if (res.ok) setContacts(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${import.meta.env.VITE_API_URL}/api/emergency-contacts/${formData.id}` : import.meta.env.VITE_API_URL + '/api/emergency-contacts';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchContacts();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving contact');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this emergency contact?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency-contacts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.studentId.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#fffbeb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall className="text-amber-600" size={28} />
            Emergency Contacts
          </h2>
          <p style={{ color: '#b45309', marginTop: '0.25rem' }}>Critical contact records for student emergencies.</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: null, studentId: '', name: '', relation: '', phone: '', address: '' }); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#d97706', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Add Contact
        </button>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by student ID or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading contacts...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(c => (
              <div key={c.id} style={{ border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: '#fff', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{c.name}</h4>
                    <span style={{ display: 'inline-block', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem' }}>
                      {c.relation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setFormData(c); setShowModal(true); }} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem' }}><strong>Student ID:</strong> {c.studentId}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                    <PhoneCall size={16} className="text-amber-500" />
                    <a href={`tel:${c.phone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>{c.phone}</a>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                    <MapPin size={16} className="text-gray-400" style={{ marginTop: '0.125rem' }} />
                    <span>{c.address}</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No contacts found.</div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>{formData.id ? 'Edit Contact' : 'Add Contact'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Student ID</label>
                  <input required type="number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Relationship</label>
                  <input required type="text" value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Contact Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Address</label>
                <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', minHeight: '80px' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: '0.375rem', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: '#d97706', color: '#fff', borderRadius: '0.375rem', cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
