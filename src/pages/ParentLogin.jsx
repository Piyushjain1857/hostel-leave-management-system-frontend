import { useState } from 'react';

const backendBase = 'http://localhost:5005';

export default function ParentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendBase}/parent/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Login failed');

      setSuccessMsg('Login successful! Redirecting to Parent Approval portal...');

      if (json.token) localStorage.setItem('parentToken', json.token);

      // Delay redirect to let the success notification be visible
      setTimeout(() => {
        window.location.href = '/parent/pending';
      }, 800);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-login-screen-container">
      <div className="parent-login-card animate-fade-in">
        <div className="parent-login-header">
          <div className="portal-badge-parent">Parent Portal</div>
          <h2 className="parent-login-title">Sign In</h2>
          <p className="parent-login-subtitle">
            Enter your parent credentials to view and approve student outpass leave requests.
          </p>
        </div>

        {errorMsg && <div className="parent-toast alert-error">{errorMsg}</div>}
        {successMsg && <div className="parent-toast alert-success">{successMsg}</div>}

        <form className="parent-form-fields" onSubmit={submit}>
          <div className="form-group-field">
            <label className="field-label-text">Institutional Parent Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="parent@college.edu..."
            />
          </div>
          <div className="form-group-field">
            <label className="field-label-text">Secret Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••..."
            />
          </div>
          <button className="parent-btn-submit" disabled={loading} type="submit">
            {loading ? <span className="parent-login-loader"></span> : 'Authenticate Login'}
          </button>
        </form>

        <div className="parent-evaluation-box">
          <p className="evaluation-title">💡 Evaluation Assistance:</p>
          <p>Login directly with standard seeded parent credentials:</p>
          <div className="evaluation-code">
            Email: <strong>parent@college.edu</strong> <br />
            Password: <strong>password123</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <a href="/" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>← Student Login</a>
          <a href="/warden/login" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>🏠 Warden</a>
          <a href="/admin/login" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: '#c2410c', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>🛡️ Admin</a>
        </div>
      </div>
    </div>
  );
}
