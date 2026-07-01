import { useState, useEffect } from 'react';
import { Download, TrendingUp, BarChart2, Calendar, CheckSquare } from 'lucide-react';

export default function ApprovedLeavesAnalytics() {
  const [data, setData] = useState({ analytics: [], recentApproved: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('wardenToken');
        const res = await fetch('http://localhost:5005/api/advanced-leaves/approved/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setData(await res.json());
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportReport = () => {
    alert("Exporting Approved Leaves Analytics Report...");
  };

  const maxVal = Math.max(...(data.analytics.map(d => d.value) || [1]));

  return (
    <div className="advanced-container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={24} color="#10b981" /> Approved Leaves Analytics</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Analyze trends and statistics of approved student outpasses.</p>
        </div>
        <button className="btn-primary" onClick={exportReport}><Download size={16} /> Export Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Analytics Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '50%' }}><CheckSquare size={24} /></div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Approved (This Term)</p>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>{data.recentApproved.length || 0}</h2>
            </div>
          </div>
          <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '1rem', borderRadius: '50%' }}><Calendar size={24} /></div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Avg. Duration</p>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>2.5 Days</h2>
            </div>
          </div>
        </div>

        {/* Mock Chart */}
        <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart2 size={18} /> Monthly Approved Leaves</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', paddingTop: '1rem' }}>
            {data.analytics.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.value}</span>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', height: `${(m.value / maxVal) * 150}px`, borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }}></div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Recently Approved History</h3>
        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Leave Type</th>
                  <th>Approval Date</th>
                  <th>Approved By</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {data.recentApproved.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.studentName}</td>
                    <td>{l.reason.substring(0, 30)}...</td>
                    <td>{new Date(l.createdAt || l.fromDate).toLocaleDateString()}</td>
                    <td>System / Warden</td>
                    <td>{l.duration}</td>
                  </tr>
                ))}
                {data.recentApproved.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
