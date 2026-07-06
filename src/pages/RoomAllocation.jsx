/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Home, Users, Plus, BedDouble, Search } from 'lucide-react';

export default function RoomAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, studentId: '', roomId: '', allocationDate: '' });

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/room-allocation');
      if (res.ok) setAllocations(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${import.meta.env.VITE_API_URL}/api/room-allocation/${formData.id}` : import.meta.env.VITE_API_URL + '/api/room-allocation';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchAllocations();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving allocation');
    }
  };

  const filtered = allocations.filter(a => a.studentId.toString().includes(searchTerm) || a.roomId.toString().includes(searchTerm));

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#f0fdfa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BedDouble className="text-teal-600" size={28} />
            Room Allocation
          </h2>
          <p style={{ color: '#0d9488', marginTop: '0.25rem' }}>Manage and assign hostel rooms to students.</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: null, studentId: '', roomId: '', allocationDate: '' }); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#0d9488', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Allocate Room
        </button>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by student or room ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading allocations...</div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#ccfbf1', borderBottom: '2px solid #99f6e4' }}>
                  <th style={{ padding: '1rem', color: '#0f766e', fontWeight: 600 }}>Allocation ID</th>
                  <th style={{ padding: '1rem', color: '#0f766e', fontWeight: 600 }}>Student ID</th>
                  <th style={{ padding: '1rem', color: '#0f766e', fontWeight: 600 }}>Room ID</th>
                  <th style={{ padding: '1rem', color: '#0f766e', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem', color: '#0f766e', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>#{a.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} className="text-teal-500" /> #{a.studentId}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Home size={16} className="text-teal-500" /> #{a.roomId}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>{a.allocationDate}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => { setFormData(a); setShowModal(true); }} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Change Room</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No allocations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f766e' }}>{formData.id ? 'Change Room' : 'Allocate Room'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Student ID</label>
                <input required type="number" disabled={!!formData.id} value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: formData.id ? '#f3f4f6' : '#fff' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Room ID</label>
                <input required type="number" value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
              </div>
              {!formData.id && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Allocation Date</label>
                  <input required type="date" value={formData.allocationDate} onChange={e => setFormData({...formData, allocationDate: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: '0.375rem', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: '#0d9488', color: '#fff', borderRadius: '0.375rem', cursor: 'pointer' }}>{formData.id ? 'Update' : 'Allocate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
