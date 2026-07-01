import { useState } from 'react';

const backendBase = 'http://localhost:5005';

export default function QRScanner() {
    const [qrText, setQrText] = useState('');
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const verify = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        setResult(null);

        try {
            const res = await fetch(`${backendBase}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrText }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Verification failed');

            setResult(json);
            setMessage('QR code pass verified successfully!');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const punchExit = async () => {
        if (!result || !result.leave) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await fetch(`${backendBase}/gate/exit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leaveId: result.leave.id }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Exit logging failed');

            setMessage(json.message || 'Student Checked-Out successfully.');
            // Reload query profile state
            setResult(prev => ({
                ...prev,
                leave: { ...prev.leave, status: json.status || 'Out' }
            }));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const punchReturn = async () => {
        if (!result || !result.leave) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await fetch(`${backendBase}/gate/return`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leaveId: result.leave.id }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Return logging failed');

            setMessage(json.message || 'Student Checked-In successfully.');
            // Reload query profile state
            setResult(prev => ({
                ...prev,
                leave: { ...prev.leave, status: json.status || 'Returned' }
            }));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scanner-screen-container">
            <div className="scanner-card animate-fade-in">
                <div className="scanner-header">
                    <h2 className="scanner-title">Security QR Scanner</h2>
                    <p className="scanner-subtitle">Simulate gate pass verification at campus main borders.</p>
                </div>

                {error && <div className="scanner-toast alert-error">{error}</div>}
                {message && <div className="scanner-toast alert-success">{message}</div>}

                {/* Camera View Emulator */}
                <div className="camera-emulator-box">
                    <div className="scanner-overlay-crosshairs"></div>
                    <span className="camera-text">Camera Simulator Active</span>
                    <span className="camera-hint">Biometric scanner ready. Paste QR payload below to verify.</span>
                </div>

                <div className="scanner-form-input">
                    <label className="scanner-input-label">QR Payload Text / Value</label>
                    <textarea
                        value={qrText}
                        onChange={(e) => setQrText(e.target.value)}
                        placeholder="Paste JSON QR payload generated from Student pass card..."
                    />
                </div>

                <button className="btn-scanner-action" onClick={verify} disabled={loading || !qrText.trim()}>
                    {loading ? <span className="scanner-loader"></span> : 'Scan & Verify Pass'}
                </button>

                {result && (
                    <div className="scan-results-box animate-fade-in">
                        <h3 className="results-title">Student Outpass Profile</h3>

                        <div className="results-grid">
                            <div className="result-row">
                                <span className="row-label">Student Name:</span>
                                <span className="row-val">{result.student?.name}</span>
                            </div>
                            <div className="result-row">
                                <span className="row-label">Room / Block:</span>
                                <span className="row-val">{result.student?.room}</span>
                            </div>
                            <div className="result-row">
                                <span className="row-label">Leave ID:</span>
                                <span className="row-val">#{result.leave?.id}</span>
                            </div>
                            <div className="result-row">
                                <span className="row-label">Leave Timeline:</span>
                                <span className="row-val">
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div><b>Out:</b> {new Date(result.leave?.fromDate).toLocaleDateString()} {result.leave?.expectedTimeOut ? `at ${result.leave?.expectedTimeOut}` : ''}</div>
                                        <div><b>In:</b> {new Date(result.leave?.toDate).toLocaleDateString()} {result.leave?.expectedTimeIn ? `at ${result.leave?.expectedTimeIn}` : ''}</div>
                                    </div>
                                </span>
                            </div>
                            <div className="result-row">
                                <span className="row-label">Destination Address:</span>
                                <span className="row-val">{result.leave?.destination}</span>
                            </div>
                            <div className="result-row">
                                <span className="row-label">Current Pass Status:</span>
                                <span className={`result-status-badge status-${String(result.leave?.status).toLowerCase()}`}>
                                    {result.leave?.status}
                                </span>
                            </div>
                        </div>

                        {/* Punch Actions */}
                        <div className="punch-controls">
                            <button
                                className="punch-btn exit"
                                onClick={punchExit}
                                disabled={loading || result.leave?.status !== 'Approved'}
                            >
                                Punch Gate Exit
                            </button>
                            <button
                                className="punch-btn return"
                                onClick={punchReturn}
                                disabled={loading || result.leave?.status !== 'Out'}
                            >
                                Punch Gate Return
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
