/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Building, Plus, Edit2, Trash2, Users } from 'lucide-react';

export default function HostelManagement() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, hostelName: '', capacity: 0, occupiedRooms: 0, wardenId: '' });

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/hostels');
      if (res.ok) setHostels(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `http://localhost:5005/api/hostels/${formData.id}` : 'http://localhost:5005/api/hostels';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchHostels();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving hostel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hostel?')) return;
    try {
      const res = await fetch(`http://localhost:5005/api/hostels/${id}`, { method: 'DELETE' });
      if (res.ok) fetchHostels();
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const totalCapacity = hostels.reduce((acc, h) => acc + (Number(h.capacity) || 0), 0);
  const totalOccupied = hostels.reduce((acc, h) => acc + (Number(h.occupiedRooms) || 0), 0);
  const occupancyRate = totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : 0;

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={24} color="#ea580c" /> Advanced Hostel Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Manage hostel buildings, capacity, and warden assignments.</p>
        </div>
        <button className="btn-primary" onClick={() => { setFormData({ id: null, hostelName: '', capacity: 0, occupiedRooms: 0, wardenId: '' }); setShowModal(true); }}>
          <Plus size={16} /> Add New Hostel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Hostels</p>
          <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b', fontSize: '2rem' }}>{hostels.length}</h2>
        </div>
        <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Capacity</p>
          <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} color="#10b981" /> {totalCapacity}</h2>
        </div>
        <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Overall Occupancy</p>
          <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b', fontSize: '2rem' }}>{occupancyRate}%</h2>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '0.5rem' }}>
            <div style={{ height: '100%', width: `${occupancyRate}%`, background: '#f59e0b', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Hostel Name</th>
                  <th>Warden</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Occupancy %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostels.map(h => {
                  const cap = Number(h.capacity) || 0;
                  const occ = Number(h.occupiedRooms) || 0;
                  const avail = cap - occ;
                  const rate = cap > 0 ? ((occ / cap) * 100).toFixed(1) : 0;
                  return (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 600 }}>{h.hostelName}</td>
                      <td>{h.wardenName}</td>
                      <td>{cap}</td>
                      <td>{occ}</td>
                      <td><span style={{ color: avail > 10 ? '#10b981' : '#ef4444', fontWeight: 600 }}>{avail}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem' }}>{rate}%</span>
                          <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                            <div style={{ height: '100%', width: `${rate}%`, background: rate > 90 ? '#ef4444' : '#10b981', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-link" onClick={() => { setFormData(h); setShowModal(true); }}><Edit2 size={16} /></button>
                          <button className="btn-link" onClick={() => handleDelete(h.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{formData.id ? 'Edit Hostel' : 'Add New Hostel'}</h3>
              <button onClick={() => setShowModal(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Hostel Name</label>
                  <input type="text" className="form-input" value={formData.hostelName} onChange={e => setFormData({...formData, hostelName: e.target.value})} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Total Capacity</label>
                    <input type="number" className="form-input" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Occupied Rooms</label>
                    <input type="number" className="form-input" value={formData.occupiedRooms} onChange={e => setFormData({...formData, occupiedRooms: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Warden ID</label>
                  <input type="number" className="form-input" value={formData.wardenId || ''} onChange={e => setFormData({...formData, wardenId: e.target.value})} placeholder="e.g., 1" />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
