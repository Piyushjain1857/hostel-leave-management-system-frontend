import { useState } from 'react';

const backendBase = 'http://localhost:5005';

export default function WardenLogin() {
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
            setErrorMsg('Warden email and password fields are required.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${backendBase}/warden/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Login failed');

            setSuccessMsg('Login successful! Redirecting to Warden Management system...');
            if (json.token) localStorage.setItem('wardenToken', json.token);

            setTimeout(() => {
                window.location.href = '/warden/dashboard';
            }, 800);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="warden-login-screen-container">
            <div className="warden-login-card animate-fade-in">
                <div className="warden-login-header">
                    <div className="portal-badge-warden">Warden Portal</div>
                    <h2 className="warden-login-title">Sign In</h2>
                    <p className="warden-login-subtitle">
                        Enter your academic warden credentials to access stats and review movements.
                    </p>
                </div>

                {errorMsg && <div className="warden-toast alert-error">{errorMsg}</div>}
                {successMsg && <div className="warden-toast alert-success">{successMsg}</div>}

                <form className="warden-form-fields" onSubmit={submit}>
                    <div className="form-group-field">
                        <label className="field-label-text">Warden Username / Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="warden@college.edu..."
                        />
                    </div>
                    <div className="form-group-field">
                        <label className="field-label-text">Security Key / Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••..."
                        />
                    </div>
                    <button className="warden-btn-submit" disabled={loading} type="submit">
                        {loading ? <span className="warden-login-loader"></span> : 'Warden Authenticate'}
                    </button>
                </form>

                <div className="warden-evaluation-box">
                    <p className="evaluation-title">💡 Evaluation Assistance:</p>
                    <p>Login directly with standard seeded warden credentials:</p>
                    <div className="evaluation-code">
                        Email: <strong>warden@college.edu</strong> <br />
                        Password: <strong>password123</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <a href="/" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>← Student Login</a>
                    <a href="/parent/login" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>👨‍👩‍👧 Parent</a>
                    <a href="/admin/login" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: '#c2410c', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>🛡️ Admin</a>
                </div>
            </div>
        </div>
    );
}
