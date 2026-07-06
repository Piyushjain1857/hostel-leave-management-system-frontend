/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle, XCircle, Search, Clock } from 'lucide-react';

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ visitorName: '', phone: '', studentId: '', purpose: '', visitDate: '' });

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/visitors');
      if (res.ok) setVisitors(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchVisitors();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error registering visitor');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/visitors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchVisitors();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = visitors.filter(v => 
    v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.studentId.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#fdf4ff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#86198f', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users className="text-fuchsia-600" size={28} />
            Visitor Management System
          </h2>
          <p style={{ color: '#a21caf', marginTop: '0.25rem' }}>Track and approve campus guests.</p>
        </div>
        <button 
          onClick={() => { setFormData({ visitorName: '', phone: '', studentId: '', purpose: '', visitDate: '' }); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#c026d3', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <UserPlus size={18} /> Register Visitor
        </button>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input 
              type="text" 
              placeholder="Search visitor name or student ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading records...</div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#faf5ff', borderBottom: '2px solid #e9d5ff' }}>
                  <th style={{ padding: '1rem', color: '#6b21a8', fontWeight: 600 }}>Visitor Info</th>
                  <th style={{ padding: '1rem', color: '#6b21a8', fontWeight: 600 }}>Student ID</th>
                  <th style={{ padding: '1rem', color: '#6b21a8', fontWeight: 600 }}>Purpose</th>
                  <th style={{ padding: '1rem', color: '#6b21a8', fontWeight: 600 }}>Visit Date</th>
                  <th style={{ padding: '1rem', color: '#6b21a8', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem', color: '#6b21a8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{v.visitorName}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{v.phone}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontWeight: 500 }}>#{v.studentId}</td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>{v.purpose}</td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>{v.visitDate}</td>
                    <td style={{ padding: '1rem' }}>
                      {v.status === 'Approved' ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Approved</span> :
                       v.status === 'Rejected' ? <span style={{ color: '#dc2626', fontWeight: 600 }}>Rejected</span> :
                       <span style={{ color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> Pending</span>}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {v.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => updateStatus(v.id, 'Approved')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '0.375rem', border: '1px solid #bbf7d0', cursor: 'pointer' }}>
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button onClick={() => updateStatus(v.id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.375rem', border: '1px solid #fecaca', cursor: 'pointer' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No visitors found.</td>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#86198f' }}>Register Visitor</h3>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Visitor Name</label>
                <input required type="text" value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Student ID</label>
                  <input required type="number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Date of Visit</label>
                <input required type="date" value={formData.visitDate} onChange={e => setFormData({...formData, visitDate: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Purpose</label>
                <input required type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: '0.375rem', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: '#c026d3', color: '#fff', borderRadius: '0.375rem', cursor: 'pointer' }}>Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
