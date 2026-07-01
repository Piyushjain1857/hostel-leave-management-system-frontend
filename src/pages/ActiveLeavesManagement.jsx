/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, Activity, Users, AlertCircle, Clock } from 'lucide-react';

export default function ActiveLeavesManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHostel, setFilterHostel] = useState('');
  
  // Stats
  const [stats, setStats] = useState({ active_leaves: 0, returning_today: 0, overdue: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('wardenToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [leavesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5005/api/advanced-leaves/active', { headers }),
        fetch('http://localhost:5005/api/advanced-leaves/active/stats', { headers })
      ]);
      
      if (leavesRes.ok) setLeaves(await leavesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error("Failed to fetch active leaves:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeaves = leaves.filter(l => 
    (l.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     l.destination?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterHostel === '' || l.hostel === filterHostel)
  );

  const exportCSV = () => {
    let csv = 'Leave ID,Student Name,Hostel,Destination,Exit Date,Return Date,Status\n';
    filteredLeaves.forEach(l => {
      csv += `${l.id},${l.studentName},${l.hostel},${l.destination},${l.fromDate},${l.toDate},${l.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'active_leaves.csv';
    a.click();
  };

  const exportPDF = () => {
    alert("PDF Export initiated. (Mock function)");
  };

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={24} color="#3b82f6" /> Active Leaves Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Monitor students currently on approved leave.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
          <button className="btn-secondary" onClick={exportPDF}><FileText size={16} /> Export PDF</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9 }}>Total Active Leaves</p>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem' }}>{stats.active_leaves || leaves.length}</h2>
            </div>
            <Users size={32} opacity={0.5} />
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9 }}>Returning Today</p>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem' }}>{stats.returning_today || 0}</h2>
            </div>
            <Clock size={32} opacity={0.5} />
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9 }}>Overdue Students</p>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem' }}>{stats.overdue || 0}</h2>
            </div>
            <AlertCircle size={32} opacity={0.5} />
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-input-container" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={16} className="input-icon-left" />
            <input type="text" className="form-input" placeholder="Search student or destination..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="form-input-container" style={{ width: '200px' }}>
            <Filter size={16} className="input-icon-left" />
            <select className="form-input" value={filterHostel} onChange={e => setFilterHostel(e.target.value)}>
              <option value="">All Hostels</option>
              <option value="Block-A">Block A</option>
              <option value="Block-B">Block B</option>
            </select>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Student Name</th>
                  <th>Hostel</th>
                  <th>Destination</th>
                  <th>Exit Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map(l => (
                  <tr key={l.id}>
                    <td>#{l.id}</td>
                    <td style={{ fontWeight: 600 }}>{l.studentName}</td>
                    <td>{l.hostel}</td>
                    <td>{l.destination}</td>
                    <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(l.toDate).toLocaleDateString()}</td>
                    <td><span className="status-badge status-approved">Active</span></td>
                    <td><button className="btn-link" onClick={() => alert('Viewing details for ' + l.studentName)}>View Details</button></td>
                  </tr>
                ))}
                {filteredLeaves.length === 0 && (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No active leaves found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
