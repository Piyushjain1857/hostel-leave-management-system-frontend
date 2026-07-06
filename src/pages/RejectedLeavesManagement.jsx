/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { ShieldAlert, XCircle, Search, Filter, Download, MessageSquare } from 'lucide-react';

export default function RejectedLeavesManagement() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ totalRejected: 0, topReason: '-', rejectedThisWeek: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('wardenToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [leavesRes, statsRes] = await Promise.all([
        fetch(import.meta.env.VITE_API_URL + '/api/advanced-leaves/rejected', { headers }),
        fetch(import.meta.env.VITE_API_URL + '/api/advanced-leaves/rejected/analytics', { headers })
      ]);
      
      if (leavesRes.ok) setLeaves(await leavesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error("Failed to fetch rejected leaves:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeaves = leaves.filter(l => 
    (l.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterReason === '' || l.rejectionComment?.includes(filterReason))
  );

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><XCircle size={24} color="#ef4444" /> Rejected Leaves Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Review and manage declined outpass requests.</p>
        </div>
        <button className="btn-secondary" onClick={() => alert('Downloading Report')}><Download size={16} /> Download Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: '#fff', borderLeft: '4px solid #ef4444', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Rejected</p>
          <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b', fontSize: '2rem' }}>{stats.totalRejected || leaves.length}</h2>
        </div>
        <div className="card" style={{ background: '#fff', borderLeft: '4px solid #f59e0b', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Top Reason</p>
          <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={16} /> {stats.topReason}</h2>
        </div>
        <div className="card" style={{ background: '#fff', borderLeft: '4px solid #3b82f6', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Rejected This Week</p>
          <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b', fontSize: '2rem' }}>{stats.rejectedThisWeek}</h2>
        </div>
      </div>

      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-input-container" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={16} className="input-icon-left" />
            <input type="text" className="form-input" placeholder="Search student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="form-input-container" style={{ width: '200px' }}>
            <Filter size={16} className="input-icon-left" />
            <select className="form-input" value={filterReason} onChange={e => setFilterReason(e.target.value)}>
              <option value="">All Reasons</option>
              <option value="Not approved">Not approved</option>
              <option value="Insufficient Information">Insufficient Info</option>
            </select>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Reason for Leave</th>
                  <th>Rejected By</th>
                  <th>Rejection Comment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.studentName}</td>
                    <td>{l.reason.substring(0, 30)}...</td>
                    <td>Warden / Admin</td>
                    <td style={{ color: '#ef4444' }}><ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}/> {l.rejectionComment}</td>
                    <td>{new Date(l.createdAt || l.fromDate).toLocaleDateString()}</td>
                    <td><button className="btn-link" onClick={() => alert('Viewing details for ' + l.studentName)}>View Details</button></td>
                  </tr>
                ))}
                {filteredLeaves.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No rejected leaves found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
