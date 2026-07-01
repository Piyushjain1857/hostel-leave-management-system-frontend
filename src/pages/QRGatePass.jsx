import { useState } from 'react';
import { Compass, Eye, ShieldAlert, CheckCircle, Download, User, Calendar, MapPin, Ticket } from 'lucide-react';

const backendBase = 'http://localhost:5005';

export default function QRGatePass() {
    const [leaveId, setLeaveId] = useState('');
    const [data, setData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setErrorMsg(null);
        setData(null);

        if (!leaveId.trim()) {
            setErrorMsg('Please enter a valid Approved Leave outpass ID.');
            return;
        }

        setLoading(true);
        try {
            const studentToken = localStorage.getItem('studentToken');
            const res = await fetch(`${backendBase}/leave/generate-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(studentToken ? { Authorization: `Bearer ${studentToken}` } : {}),
                },
                body: JSON.stringify({ leaveId: Number(leaveId) }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || 'Failed to generate QR Gate Pass');

            setData(json);
        } catch (e) {
            // Local fallback simulation for Demo/Standalone mode
            console.warn("Offline fallback for QR gate pass:", e.message);
            
            const mockLeavesStr = localStorage.getItem('mockLeaves');
            let found = null;
            if (mockLeavesStr) {
                const leaves = JSON.parse(mockLeavesStr);
                found = leaves.find(l => String(l.id) === String(leaveId));
            }

            // Mock profile
            const profileStr = localStorage.getItem('mockStudentProfile');
            const profile = profileStr ? JSON.parse(profileStr) : { name: 'Piyush jain' };

            if (found) {
                setData({
                    studentName: profile.name,
                    leaveId: found.id,
                    fromDate: found.startDate || found.fromDate,
                    toDate: found.endDate || found.toDate,
                    expectedTimeOut: found.expectedTimeOut,
                    expectedTimeIn: found.expectedTimeIn,
                    destination: found.reason.includes(']') ? found.reason.split(']')[1]?.trim() : found.reason,
                    status: found.status,
                    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HLMS-Pass-' + found.id
                });
            } else {
                setErrorMsg('Leave ID ' + leaveId + ' not found in outpass directory. Please check the ID or create a new outpass.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)', borderRadius: '1.25rem', padding: '1.5rem 2rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    <div className="icon-pulse" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Ticket size={28} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Digital QR Gate Pass</h2>
                        <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0', maxWidth: '500px', lineHeight: 1.4 }}>Input your approved Leave outpass ID to generate a digital scannable outpass ticket.</p>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>

                {errorMsg && <div className="toast alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem' }}>{errorMsg}</div>}

                {/* Modern search bar */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <input
                        className="form-input"
                        placeholder="Approved Outpass ID (e.g. 101, 102)..."
                        type="number"
                        value={leaveId}
                        onChange={(e) => setLeaveId(e.target.value)}
                        style={{ flex: 1, borderRadius: '0.5rem' }}
                    />
                    <button className="btn-primary" onClick={generate} disabled={loading} style={{ width: 'auto', borderRadius: '0.5rem', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        {loading ? <span className="spinner"></span> : (
                            <>
                                <Eye size={16} />
                                <span>Generate Pass</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {data && (
                <div className="saas-outpass-card animate-fade-in">
                    
                    {/* Outpass card main content and ticket stub */}
                    <div className="saas-outpass-body">
                        
                        {/* Left Side: Student & Outpass Details */}
                        <div className="saas-outpass-main">
                            
                            {/* Hostel/Outpass location row */}
                            <div className="saas-outpass-row">
                                <div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>HOSTEL LOCATION</span>
                                    <div className="saas-outpass-code" style={{ color: 'var(--color-primary)', fontSize: '1.75rem' }}>HOSTEL</div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>State Block Dorms</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0 1rem' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: 700, border: '1px solid var(--color-success-border)', background: 'var(--color-success-bg)', padding: '2px 8px', borderRadius: '9999px' }}>
                                        {data.status.toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', width: '80px' }}>
                                        <div style={{ height: '2px', background: 'var(--color-border)', flex: 1 }}></div>
                                        <Compass size={14} style={{ color: 'var(--color-muted)' }} />
                                        <div style={{ height: '2px', background: 'var(--color-border)', flex: 1 }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--color-muted)', fontWeight: 600 }}>GATE SCAN APPROVED</span>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>LEAVE DESTINATION</span>
                                    <div className="saas-outpass-code" style={{ color: 'var(--color-secondary)', fontSize: '1.75rem' }}>DEST</div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>External Location</span>
                                </div>
                            </div>

                            {/* Student name */}
                            <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: '0.15rem' }}>STUDENT NAME</span>
                                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <User size={14} style={{ color: 'var(--color-primary)' }} />
                                    <span>{data.studentName}</span>
                                </div>
                            </div>

                            {/* Leave outpass ID */}
                            <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: '0.15rem' }}>LEAVE OUTPASS ID</span>
                                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                                    #{data.leaveId}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: '0.15rem' }}>APPROVED LEAVE TIMELINE</span>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                                    <span>
                                        <div style={{ fontSize: '0.8rem' }}><b>Out:</b> {new Date(data.fromDate).toLocaleDateString()} {data.expectedTimeOut ? `at ${data.expectedTimeOut}` : ''}</div>
                                        <div style={{ fontSize: '0.8rem' }}><b>In:</b> {new Date(data.toDate).toLocaleDateString()} {data.expectedTimeIn ? `at ${data.expectedTimeIn}` : ''}</div>
                                    </span>
                                </div>
                            </div>

                            {/* Destination Address */}
                            <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: '0.15rem' }}>LEAVE DESTINATION</span>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <MapPin size={12} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>{data.destination}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Stub: Scannable Security Barcode stub */}
                        <div className="saas-outpass-stub">
                            <div className="qr-code-wrapper" style={{ background: '#fff', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                {data.qrUrl ? (
                                    <img alt="Outpass QR Code" src={data.qrUrl} style={{ width: '100px', height: '100px', display: 'block' }} />
                                ) : (
                                    <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--color-muted)' }}>No QR Code</div>
                                )}
                            </div>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SECURITY SCAN STUB</span>
                        </div>

                    </div>

                    {/* Notice block / action buttons at bottom of ticket */}
                    <div style={{ padding: '1.25rem 2rem', background: '#fafafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        
                        <div style={{ flex: 1, minWidth: '240px' }}>
                            {data.status !== 'Approved' && data.status !== 'Out' && data.status !== 'Returned' && data.status !== 'Late Return' && data.status !== 'Checked-Out' && data.status !== 'Completed' ? (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-warning-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <ShieldAlert size={14} /> Pass requires Parent/Warden approval.
                                </span>
                            ) : (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <CheckCircle size={14} /> Pass active! Scannable at campus gates. Current Status: {data.status}
                                </span>
                            )}
                        </div>

                        {data.qrUrl && (
                            <a
                                className="btn-primary"
                                href={data.qrUrl}
                                target="_blank"
                                rel="noreferrer"
                                download={`gatepass-${data.leaveId}.png`}
                                style={{ width: 'auto', borderRadius: '0.5rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 700 }}
                            >
                                <Download size={14} /> Download Gate Pass
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
