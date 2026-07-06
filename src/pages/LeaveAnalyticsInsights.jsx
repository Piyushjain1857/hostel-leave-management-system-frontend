/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { PieChart, TrendingUp, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function LeaveAnalyticsInsights() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/leave-analytics');
      if (res.ok) setAnalytics(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/leave-analytics/reports');
      const data = await res.json();
      const csv = "data:text/csv;charset=utf-8,ID,Student,Status\n" + data.map(d => `${d.id},${d.studentId},${d.status}`).join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csv));
      link.setAttribute('download', 'leave_reports.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      console.error('Export failed');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading analytics...</div>;

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart className="text-blue-600" size={28} />
            Leave Analytics & Insights
          </h2>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Statistical overview of student leave requests.</p>
        </div>
        <button 
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Download size={18} /> Export Full Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Requests</p>
            <TrendingUp size={20} color="#3b82f6" />
          </div>
          <p style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.total || 0}</p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Approved</p>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <p style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.approved || 0}</p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Rejected</p>
            <XCircle size={20} color="#ef4444" />
          </div>
          <p style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.rejected || 0}</p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Currently</p>
            <AlertTriangle size={20} color="#f59e0b" />
          </div>
          <p style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.active || 0}</p>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b' }}>Monthly Trend (Mock Data)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>
          {analytics?.trends?.map((t, i) => {
            const heightPct = Math.max(10, (t.count / 20) * 100);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: `${heightPct}%`, backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease-in-out' }}></div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b' }}>Time Tracking Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Average Exit Delay</p>
            <p style={{ color: '#0f172a', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.avgExitDelay || '15 mins'}</p>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Average Return Delay</p>
            <p style={{ color: '#0f172a', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.avgReturnDelay || '20 mins'}</p>
          </div>
          <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #fecaca' }}>
            <p style={{ color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Late Returns</p>
            <p style={{ color: '#7f1d1d', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.lateReturns || 0}</p>
          </div>
          <div style={{ backgroundColor: '#fdf4ff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #fbcfe8' }}>
            <p style={{ color: '#86198f', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Students Currently Outside</p>
            <p style={{ color: '#701a75', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>{analytics?.studentsOutside || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
