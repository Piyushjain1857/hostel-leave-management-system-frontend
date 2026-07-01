/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Home, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHostel, setFilterHostel] = useState('');
  const [formData, setFormData] = useState({ id: null, roomNumber: '', hostelId: '', capacity: 1, occupied: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, hRes] = await Promise.all([
        fetch('http://localhost:5005/api/rooms'),
        fetch('http://localhost:5005/api/hostels')
      ]);
      if (rRes.ok) setRooms(await rRes.json());
      if (hRes.ok) setHostels(await hRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `http://localhost:5005/api/rooms/${formData.id}` : 'http://localhost:5005/api/rooms';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchData();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving room');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      const res = await fetch(`http://localhost:5005/api/rooms/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const filtered = rooms.filter(r => 
    r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterHostel === '' || String(r.hostelId) === filterHostel)
  );

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Home size={24} color="#6366f1" /> Advanced Room Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Manage individual room allocations and availability.</p>
        </div>
        <button className="btn-primary" onClick={() => { setFormData({ id: null, roomNumber: '', hostelId: '', capacity: 1, occupied: 0 }); setShowModal(true); }}>
          <Plus size={16} /> Add New Room
        </button>
      </div>

      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-input-container" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={16} className="input-icon-left" />
            <input type="text" className="form-input" placeholder="Search room number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="form-input-container" style={{ width: '200px' }}>
            <Filter size={16} className="input-icon-left" />
            <select className="form-input" value={filterHostel} onChange={e => setFilterHostel(e.target.value)}>
              <option value="">All Hostels</option>
              {hostels.map(h => <option key={h.id} value={h.id}>{h.hostelName}</option>)}
            </select>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Hostel</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Availability</th>
                  <th>Status Visual</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const avail = r.capacity - r.occupied;
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.roomNumber}</td>
                      <td>{r.hostelName}</td>
                      <td>{r.capacity}</td>
                      <td>{r.occupied}</td>
                      <td>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600,
                          background: avail > 0 ? '#dcfce7' : '#fee2e2',
                          color: avail > 0 ? '#16a34a' : '#ef4444'
                        }}>
                          {avail > 0 ? `${avail} Bed(s) Available` : 'Full'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {Array.from({length: r.capacity}).map((_, i) => (
                            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: i < r.occupied ? '#6366f1' : '#e2e8f0' }} title={i < r.occupied ? 'Occupied' : 'Vacant'}></div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-link" onClick={() => { setFormData(r); setShowModal(true); }}><Edit2 size={16} /></button>
                          <button className="btn-link" onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No rooms found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{formData.id ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setShowModal(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Room Number</label>
                  <input type="text" className="form-input" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Hostel</label>
                  <select className="form-input" value={formData.hostelId} onChange={e => setFormData({...formData, hostelId: e.target.value})} required>
                    <option value="">Select Hostel</option>
                    {hostels.map(h => <option key={h.id} value={h.id}>{h.hostelName}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input type="number" className="form-input" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Occupied</label>
                    <input type="number" className="form-input" value={formData.occupied} onChange={e => setFormData({...formData, occupied: e.target.value})} required min="0" />
                  </div>
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
