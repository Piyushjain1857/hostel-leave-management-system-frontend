/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Activity, Download, Search, Server } from 'lucide-react';

export default function SystemAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/audit-logs');
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExport = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/audit-logs/export');
      const data = await res.json();
      const csv = "data:text/csv;charset=utf-8,ID,User,Action,Module,Timestamp\n" + 
        data.data.map(l => `${l.id},${l.userId},${l.action},${l.module},${l.timestamp}`).join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csv));
      link.setAttribute('download', 'audit_logs.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(err) {
      console.error(err);
    }
  };

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#1e293b', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server className="text-cyan-400" size={28} />
            System Audit Logs
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Security and operational event tracking.</p>
        </div>
        <button 
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#06b6d4', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by action or module..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #334155', outline: 'none', backgroundColor: '#1e293b', color: '#f8fafc' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading logs...</div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', borderBottom: '2px solid #334155' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Timestamp</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>User ID</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Module</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #1e293b', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#38bdf8', fontWeight: 600 }}>#{l.userId}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ backgroundColor: '#334155', color: '#cbd5e1', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        {l.module}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={14} className="text-emerald-400" />
                        {l.action}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No audit logs found.</td>
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
