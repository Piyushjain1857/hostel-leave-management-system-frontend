import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, ShieldAlert, X } from 'lucide-react';

export default function AdvancedChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Password requirements
  const reqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword)
  };
  
  const strengthScore = Object.values(reqs).filter(Boolean).length;
  let strengthLabel = 'Weak';
  let strengthColor = '#ef4444';
  if (strengthScore >= 3) { strengthLabel = 'Fair'; strengthColor = '#f59e0b'; }
  if (strengthScore === 5) { strengthLabel = 'Strong'; strengthColor = '#10b981'; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strengthScore < 5) {
      setMessage({ type: 'error', text: 'Please meet all password requirements.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    const token = localStorage.getItem('studentToken');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/advanced-profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advanced-container animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <div className="card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '2rem', color: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={24} /> Advanced Security
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Update your password with enhanced security protocols.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {message && (
            <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
                <span>{message.text}</span>
              </div>
              <button type="button" onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><X size={16} /></button>
            </div>
          )}

          {/* Current Password */}
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div className="form-input-container" style={{ position: 'relative' }}>
              <input 
                type={showCurrent ? "text" : "password"} 
                className="form-input" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">New Password</label>
            <div className="form-input-container" style={{ position: 'relative' }}>
              <input 
                type={showNew ? "text" : "password"} 
                className="form-input" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          {newPassword && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>Password Strength:</span>
                <span style={{ fontWeight: 600, color: strengthColor }}>{strengthLabel}</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(strengthScore / 5) * 100}%`, background: strengthColor, transition: 'all 0.3s ease' }}></div>
              </div>
            </div>
          )}

          {/* Requirements Checklist */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.85rem' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#334155' }}>Password Requirements:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <li style={{ color: reqs.length ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {reqs.length ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1'}}></div>} Minimum 8 characters
              </li>
              <li style={{ color: reqs.upper ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {reqs.upper ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1'}}></div>} Uppercase letter
              </li>
              <li style={{ color: reqs.lower ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {reqs.lower ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1'}}></div>} Lowercase letter
              </li>
              <li style={{ color: reqs.number ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {reqs.number ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1'}}></div>} One Number
              </li>
              <li style={{ color: reqs.special ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {reqs.special ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1'}}></div>} Special character
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Confirm Password</label>
            <div className="form-input-container" style={{ position: 'relative' }}>
              <input 
                type={showConfirm ? "text" : "password"} 
                className="form-input" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '0.8rem', fontSize: '1rem', borderRadius: '8px' }}>
              {loading ? 'Saving...' : 'Save Password'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setMessage(null); }} style={{ flex: 1, padding: '0.8rem', fontSize: '1rem', borderRadius: '8px' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
