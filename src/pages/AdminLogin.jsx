import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Info, CheckCircle, ShieldAlert } from 'lucide-react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const backendUrl = 'http://localhost:5005';

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      tempErrors.email = "Admin email is required";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid academic email address";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Admin authorization successful! Loading management console...'
        });
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Invalid administrator email or password.'
        });
      }
    } catch (err) {
      console.warn("Backend API offline. Authenticating via offline mock mode...", err);

      setTimeout(() => {
        if (email === 'admin@college.edu' && password === 'password123') {
          setMessage({
            type: 'success',
            text: '[MOCK MODE] Admin login successful! Loading console...'
          });
          const mockToken = 'mock-admin-token-xyz-789';
          localStorage.setItem('adminToken', mockToken);
          localStorage.setItem('adminUser', JSON.stringify({
            id: 1,
            name: 'Admin Test',
            email: 'admin@college.edu'
          }));

          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        } else {
          setMessage({
            type: 'error',
            text: 'Invalid admin credentials. Hint: Use admin@college.edu / password123'
          });
        }
        setLoading(false);
      }, 800);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-layout">
      {/* Top Academic Banner */}
      <header className="header-portal admin-header">
        <div className="header-content">
          <div className="header-logo-section">
            <div className="header-logo-icon admin-logo-icon">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 L15 30 L50 45 L85 30 Z" />
                <path d="M22 36 L22 65 C22 75, 50 85, 50 85 C50 85, 78 75, 78 65 L78 36 L50 50 Z" />
                <circle cx="50" cy="30" r="4" fill="#f59e0b" />
              </svg>
            </div>
            <div className="header-title-container">
              <h1 className="header-university-name">State Institute of Technology</h1>
              <p className="header-system-name" style={{ color: '#93c5fd' }}>Hostel Management Administration</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Frame */}
      <main className="main-portal admin-login-main">
        <div className="portal-card-wrapper admin-card-wrapper">
          
          {message && (
            <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`}>
              <div className="toast-icon">
                {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
              </div>
              <div>
                <p className="toast-title">{message.type === 'success' ? 'Authorized' : 'Login Failed'}</p>
                <p className="toast-text">{message.text}</p>
              </div>
            </div>
          )}

          <div className="portal-card admin-login-card">
            <div className="portal-card-header admin-card-header">
              <div className="portal-badge admin-badge">
                <ShieldCheck size={12} /> Secure Admin Portal
              </div>
              <h2 className="portal-card-title">Console Login</h2>
              <p className="portal-card-subtitle">
                Enter your administrative credentials to manage student profiles, wardens, leaves, and system configurations.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="portal-form" noValidate>
              
              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">Admin Email Address</label>
                <div className="form-input-container">
                  <div className="input-icon-left"><Mail size={16} /></div>
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="input-error-msg">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="form-label-container">
                  <label className="form-label" htmlFor="admin-password">Password</label>
                  <button
                    type="button"
                    onClick={() => alert("Please contact the University IT Helpdesk or check the default seeded configs to recover academic administration credentials.")}
                    className="btn-link admin-btn-link"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="form-input-container">
                  <div className="input-icon-left"><Lock size={16} /></div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="input-error-msg">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary admin-btn-primary">
                {loading ? <span className="spinner"></span> : (
                  <>
                    <span>Enter Command Center</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Seed Info Box */}
          <div className="help-card admin-help-card">
            <p className="help-card-title"><Info size={14} /> System Administrator Credentials:</p>
            <p>For development review and course evaluation grading, use:</p>
            <div className="help-card-code admin-code">
              Email: <strong>admin@college.edu</strong> <br />
              Password: <strong>password123</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>← Student Login</a>
            <a href="/parent/login" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>👨‍👩‍👧 Parent</a>
            <a href="/warden/login" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>🏠 Warden</a>
          </div>
        </div>
      </main>

      <footer className="footer-portal admin-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} State Institute of Technology. Administrative Command Center.</p>
          <p className="footer-small">Protected System. Unauthorized access tracking is active.</p>
        </div>
      </footer>
    </div>
  );
}

export default AdminLogin;
