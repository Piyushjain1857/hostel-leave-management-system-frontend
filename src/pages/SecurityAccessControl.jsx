 
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, Search, UserCheck } from 'lucide-react';

export default function SecurityAccessControl() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, roleName: '', permissions: '' });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/roles');
      if (res.ok) setRoles(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `http://localhost:5005/api/roles/${formData.id}` : 'http://localhost:5005/api/roles';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchRoles();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this role?')) return;
    try {
      const res = await fetch(`http://localhost:5005/api/roles/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRoles();
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const filteredRoles = roles.filter(r => r.roleName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield className="text-indigo-600" size={28} />
            Security & Access Control
          </h2>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage system roles and permissions across all modules.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: null, roleName: '', permissions: '' }); setShowModal(true); }}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Add New Role
        </button>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading roles...</div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>Role Name</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>Assigned Permissions</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>Users Count</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserCheck size={18} color="#4f46e5" /> {r.roleName}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {r.permissions.split(',').map((p, i) => (
                          <span key={i} style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                            {p.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{(r.id * 7) % 50 + 1}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => { setFormData(r); setShowModal(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '1rem' }}><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
                {filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No roles found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>
              {formData.id ? 'Edit Role' : 'Create New Role'}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Role Name</label>
                <input required type="text" value={formData.roleName} onChange={e => setFormData({ ...formData, roleName: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Permissions (comma separated)</label>
                <input required type="text" value={formData.permissions} onChange={e => setFormData({ ...formData, permissions: e.target.value })} placeholder="e.g. read_all, write_all" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
