/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Activity, Search, Filter, Download, Calendar, ShieldAlert } from 'lucide-react';

export default function UserActivityLogCenter() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('studentToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/activity-logs?role=${filterRole}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setLogs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole]);

  const exportLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/activity-logs/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        let csv = 'ID,User ID,Role,Activity,IP Address,Date\n';
        data.forEach(l => { csv += `${l.id},${l.userId},${l.role},"${l.activity}",${l.ipAddress},${l.createdAt}\n`; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activity_logs.csv';
        a.click();
      }
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  const filteredLogs = logs.filter(l => 
    l.activity.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(l.userId).includes(searchTerm)
  );

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={24} color="#8b5cf6" /> User Activity Log Center</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Monitor system events and security logs.</p>
        </div>
        <button className="btn-secondary" onClick={exportLogs}><Download size={16} /> Export Logs</button>
      </div>

      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-input-container" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={16} className="input-icon-left" />
            <input type="text" className="form-input" placeholder="Search activity or User ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="form-input-container" style={{ width: '200px' }}>
            <Filter size={16} className="input-icon-left" />
            <select className="form-input" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="warden">Warden</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Role</th>
                  <th>Activity Event</th>
                  <th>IP Address</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => {
                  const d = new Date(l.createdAt);
                  return (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>#{l.userId}</td>
                      <td>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                          background: l.role === 'admin' ? '#fef2f2' : l.role === 'warden' ? '#f5f3ff' : '#eff6ff',
                          color: l.role === 'admin' ? '#ef4444' : l.role === 'warden' ? '#8b5cf6' : '#3b82f6'
                        }}>
                          {l.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{l.activity}</td>
                      <td>{l.ipAddress || '127.0.0.1'}</td>
                      <td><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem', color: '#94a3b8' }}/> {d.toLocaleDateString()}</td>
                      <td>{d.toLocaleTimeString()}</td>
                    </tr>
                  )
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      <ShieldAlert size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                      <p style={{ color: '#64748b', margin: 0 }}>No activity logs found for the selected criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
