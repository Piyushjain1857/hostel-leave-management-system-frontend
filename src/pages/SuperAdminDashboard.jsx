/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity, Database, Server, Cpu, CloudRain } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, healthRes, statsRes] = await Promise.all([
        fetch('http://localhost:5005/api/superadmin/dashboard'),
        fetch('http://localhost:5005/api/superadmin/system-health'),
        fetch('http://localhost:5005/api/superadmin/system-statistics')
      ]);
      
      if (dashRes.ok) setData(await dashRes.json());
      if (healthRes.ok) setHealth(await healthRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBackup = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/superadmin/database/backup', { method: 'POST' });
      const msg = await res.json();
      alert(msg.message);
    } catch {
      alert('Backup failed');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Initializing Control Panel...</div>;

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LayoutDashboard className="text-indigo-500" size={32} />
            Super Admin Control Panel
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem', fontSize: '1.1rem' }}>Global system overview and administrative actions.</p>
        </div>
        <button 
          onClick={handleBackup}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Database size={18} /> Backup Database
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Metric Cards */}
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Users</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc' }}>{data?.totalUsers || 0}</h3>
            </div>
            <Users size={32} color="#3b82f6" opacity={0.8} />
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #10b981', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Sessions</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc' }}>{data?.activeSessions || 0}</h3>
            </div>
            <Activity size={32} color="#10b981" opacity={0.8} />
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #f59e0b', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>API Requests Today</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc' }}>{stats?.apiRequestsToday || 0}</h3>
            </div>
            <CloudRain size={32} color="#f59e0b" opacity={0.8} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* System Health */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server className="text-emerald-400" /> System Health
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Status</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{health?.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Uptime (Seconds)</span>
              <span style={{ fontWeight: 600 }}>{Math.floor(health?.uptime || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Memory Usage (Heap)</span>
              <span style={{ fontWeight: 600 }}>{health ? Math.floor(health.memoryUsage.heapUsed / 1024 / 1024) : 0} MB</span>
            </div>
          </div>
        </div>

        {/* Server Performance */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu className="text-rose-400" /> Performance Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Avg Response Time</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>{stats?.avgResponseTimeMs} ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Error Rate</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{stats?.errorsToday} errors</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Total DB Records</span>
              <span style={{ fontWeight: 600 }}>{data?.databaseRecords}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
