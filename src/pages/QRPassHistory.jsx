/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { QrCode, Search, Download, RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function QRPassHistory() {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchQRs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('wardenToken');
      const res = await fetch('http://localhost:5005/api/qr/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setQrs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  const regenerateQR = async (id, leaveId) => {
    if (!window.confirm("Regenerating will invalidate the old QR. Continue?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5005/api/qr/regenerate/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ leaveId })
      });
      if (res.ok) {
        alert("QR Pass Regenerated");
        fetchQRs();
      }
    } catch (err) {
      console.error(err);
      alert("Error regenerating");
    }
  };

  const downloadQR = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5005/api/qr/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const a = document.createElement('a');
        a.href = data.qrCode;
        a.download = `qr_pass_${id}.png`;
        a.click();
      }
    } catch (err) {
      console.error(err);
      alert("Error downloading");
    }
  };

  const filtered = qrs.filter(q => 
    q.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(q.id).includes(searchTerm)
  );

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><QrCode size={24} color="#0f766e" /> QR Pass History & Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Track, view, and regenerate secure QR gate passes.</p>
        </div>
      </div>

      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-input-container" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={16} className="input-icon-left" />
            <input type="text" className="form-input" placeholder="Search by student name or QR ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>QR ID</th>
                  <th>Student Name</th>
                  <th>Leave Purpose</th>
                  <th>Generated Date</th>
                  <th>Expiry Date</th>
                  <th>Validity Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => {
                  const isActive = q.status === 'Active' && new Date(q.expiryDate) > new Date();
                  return (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 600 }}>QR-{q.id}</td>
                      <td>{q.studentName}</td>
                      <td>{q.leaveDetails.substring(0, 20)}...</td>
                      <td>{new Date(q.generatedAt).toLocaleDateString()}</td>
                      <td>{q.expiryDate ? new Date(q.expiryDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {isActive ? (
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}><CheckCircle size={14}/> Active</span>
                        ) : (
                          <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}><XCircle size={14}/> Expired</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-link" onClick={() => setSelectedQR(q)} title="View QR"><Eye size={16} /></button>
                          <button className="btn-link" onClick={() => downloadQR(q.id)} title="Download QR"><Download size={16} /></button>
                          <button className="btn-link" onClick={() => regenerateQR(q.id, q.leaveId)} title="Regenerate QR" style={{ color: '#f59e0b' }}><RefreshCw size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No QR Passes found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedQR && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-header">
              <h3 className="modal-title">QR Pass #{selectedQR.id}</h3>
              <button onClick={() => setSelectedQR(null)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <img src={selectedQR.qrCode} alt="QR Code" style={{ width: '200px', height: '200px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>{selectedQR.studentName}</p>
              <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>Valid until: {new Date(selectedQR.expiryDate).toLocaleString()}</p>
              <button onClick={() => downloadQR(selectedQR.id)} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} /> Download Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
