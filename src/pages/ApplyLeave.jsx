import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, FileText, Phone, CheckCircle, ArrowRight, ArrowLeft, Clock } from 'lucide-react';

const backendBase = import.meta.env.VITE_API_URL;

function CustomTimePicker({ value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef(null);

    let h24 = 12, m = 0;
    if (value) {
        const parts = value.split(':');
        h24 = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
    }
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyTime = (h, min, p) => {
        let new24 = h;
        if (p === 'PM' && h !== 12) new24 += 12;
        if (p === 'AM' && h === 12) new24 = 0;

        const hhStr = new24.toString().padStart(2, '0');
        const mmStr = min.toString().padStart(2, '0');
        onChange(`${hhStr}:${mmStr}`);
    };

    return (
        <div ref={pickerRef} style={{ position: 'relative' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex', alignItems: 'center', padding: '0.75rem 1rem',
                    border: '1px solid', borderRadius: '0.5rem',
                    backgroundColor: '#fff', cursor: 'pointer', gap: '0.5rem',
                    boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none',
                    borderColor: isOpen || value ? '#3b82f6' : 'var(--color-border)',
                    transition: 'all 0.2s'
                }}>
                <Clock size={18} style={{ color: value ? '#3b82f6' : 'var(--color-muted)' }} />
                <span style={{ color: value ? '#1e293b' : '#94a3b8', fontWeight: value ? 600 : 400, flex: 1, fontSize: '0.95rem' }}>
                    {value ? `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}` : placeholder}
                </span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: '110%', left: 0, right: 0,
                    backgroundColor: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem', padding: '1rem', zIndex: 50,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem', height: '160px' }}>
                        <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #f1f5f9', paddingRight: '0.25rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {[...Array(12)].map((_, i) => {
                                const val = i + 1;
                                const isSel = h12 === val;
                                return (
                                    <div
                                        key={val}
                                        onClick={() => { applyTime(val, m, period); }}
                                        style={{
                                            padding: '0.5rem', textAlign: 'center', cursor: 'pointer',
                                            borderRadius: '0.5rem', fontSize: '0.9rem',
                                            backgroundColor: isSel ? '#eff6ff' : 'transparent',
                                            color: isSel ? '#2563eb' : '#475569',
                                            fontWeight: isSel ? 700 : 500,
                                            marginBottom: '0.25rem', transition: 'all 0.2s'
                                        }}>
                                        {val.toString().padStart(2, '0')}
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #f1f5f9', paddingRight: '0.25rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {['00', '15', '30', '45'].map((mStr) => {
                                const val = parseInt(mStr);
                                const isSel = m === val;
                                return (
                                    <div
                                        key={val}
                                        onClick={() => { applyTime(h12, val, period); }}
                                        style={{
                                            padding: '0.5rem', textAlign: 'center', cursor: 'pointer',
                                            borderRadius: '0.5rem', fontSize: '0.9rem',
                                            backgroundColor: isSel ? '#eff6ff' : 'transparent',
                                            color: isSel ? '#2563eb' : '#475569',
                                            fontWeight: isSel ? 700 : 500,
                                            marginBottom: '0.25rem', transition: 'all 0.2s'
                                        }}>
                                        {mStr}
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['AM', 'PM'].map((p) => {
                                const isSel = period === p;
                                return (
                                    <div
                                        key={p}
                                        onClick={() => { applyTime(h12, m, p); }}
                                        style={{
                                            padding: '1rem 0.5rem', textAlign: 'center', cursor: 'pointer',
                                            borderRadius: '0.5rem', fontSize: '0.9rem', flex: 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: isSel ? '#2563eb' : '#f8fafc',
                                            color: isSel ? '#fff' : '#64748b',
                                            fontWeight: isSel ? 700 : 600,
                                            transition: 'all 0.2s', border: '1px solid',
                                            borderColor: isSel ? '#2563eb' : '#e2e8f0'
                                        }}>
                                        {p}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        style={{
                            width: '100%', marginTop: '1rem', padding: '0.5rem',
                            backgroundColor: '#f1f5f9', color: '#334155', border: 'none',
                            borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    )
}

export default function ApplyLeave() {
    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [destination, setDestination] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [expectedTimeOut, setExpectedTimeOut] = useState('');
    const [expectedTimeIn, setExpectedTimeIn] = useState('');

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const validateStep = (step) => {
        const e = {};
        if (step === 1) {
            if (!destination.trim()) e.destination = 'Destination address is required.';
        }
        if (step === 2) {
            if (!fromDate) e.fromDate = 'Leave start date is required.';
            if (!toDate) e.toDate = 'Expected return date is required.';
            if (!expectedTimeOut) e.expectedTimeOut = 'Expected exit time is required.';
            if (!expectedTimeIn) e.expectedTimeIn = 'Expected return time is required.';
            if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
                e.toDate = 'Return date cannot be earlier than leave start date.';
            }
        }
        if (step === 3) {
            if (!reason.trim()) e.reason = 'Justified reason for leave outpass is required.';
            else if (reason.trim().length < 10) e.reason = 'Please explain in at least 10 characters.';
        }
        if (step === 4) {
            const digits = String(parentPhone).replace(/\D/g, '');
            if (!digits) e.parentPhone = 'Parent contact number is required.';
            else if (digits.length < 10) e.parentPhone = 'Enter a valid 10-digit phone number.';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (ev) => {
        if (ev) ev.preventDefault();
        setSuccessMsg(null);
        setErrorMsg(null);

        if (!validateStep(4)) return;

        setLoading(true);
        try {
            const studentToken = localStorage.getItem('studentToken');

            const res = await fetch(`${backendBase}/leave/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(studentToken ? { Authorization: `Bearer ${studentToken}` } : {}),
                },
                body: JSON.stringify({
                    reason: reason,
                    fromDate,
                    toDate,
                    destination,
                    parentPhone,
                    expectedTimeOut,
                    expectedTimeIn,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setErrorMsg(data.message || 'Failed to lodge outpass permission.');
                return;
            }

            setSuccessMsg('Leave outpass request successfully registered! Sent to parents and wardens for digital signoff.');

            // Clear form
            setReason('');
            setFromDate('');
            setToDate('');
            setExpectedTimeOut('');
            setExpectedTimeIn('');
            setDestination('');
            setParentPhone('');
            setErrors({});
            setCurrentStep(5);
        } catch {
            // Local fallback simulation for Offline mode
            const mockLeavesStr = localStorage.getItem('mockLeaves');
            let mockLeaves = [];
            if (mockLeavesStr) {
                mockLeaves = JSON.parse(mockLeavesStr);
            }
            const newMock = {
                id: Math.floor(100 + Math.random() * 900),
                reason: reason,
                startDate: fromDate,
                endDate: toDate,
                expectedTimeOut,
                expectedTimeIn,
                status: 'Pending',
                created_at: new Date().toISOString()
            };
            mockLeaves.unshift(newMock);
            localStorage.setItem('mockLeaves', JSON.stringify(mockLeaves));

            // Also update Parent's mock pending list for offline testing
            const mockParentStr = localStorage.getItem('mockParentPending');
            let mockParentPending = [];
            if (mockParentStr) {
                mockParentPending = JSON.parse(mockParentStr);
            }
            const newMockParent = {
                id: newMock.id,
                reason: newMock.reason,
                fromDate: newMock.startDate,
                toDate: newMock.endDate,
                expectedTimeOut: newMock.expectedTimeOut,
                expectedTimeIn: newMock.expectedTimeIn,
                studentName: 'Piyush jain', // Demo fallback name
                status: 'Pending'
            };
            mockParentPending.unshift(newMockParent);
            localStorage.setItem('mockParentPending', JSON.stringify(mockParentPending));

            setSuccessMsg('[DEMO PERSISTENCE] Leave outpass created locally in memory. Sync pending.');
            setReason('');
            setFromDate('');
            setToDate('');
            setExpectedTimeOut('');
            setExpectedTimeIn('');
            setDestination('');
            setParentPhone('');
            setErrors({});
            setCurrentStep(5);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Outpass Type', icon: <MapPin size={16} /> },
        { id: 2, title: 'Leave Dates', icon: <Calendar size={16} /> },
        { id: 3, title: 'Reason', icon: <FileText size={16} /> },
        { id: 4, title: 'Verification', icon: <Phone size={16} /> },
        { id: 5, title: 'Confirmation', icon: <CheckCircle size={16} /> },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto', alignItems: 'start' }}>

            {/* Form Steps Card */}
            <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>

                {/* Visual Step Progress Bar */}
                <div className="saas-wizard-progress" style={{ marginBottom: '2.5rem' }}>
                    {steps.map(step => (
                        <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, zIndex: 10 }}>
                            <div className={`saas-wizard-node ${currentStep === step.id ? 'active' : currentStep > step.id ? 'completed' : ''}`}>
                                {step.icon}
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: currentStep === step.id ? 'var(--color-primary)' : 'var(--color-muted)' }}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {successMsg && <div className="toast alert-success" style={{ margin: '1rem 0', padding: '1rem', borderRadius: '0.5rem' }}>{successMsg}</div>}
                {errorMsg && <div className="toast alert-error" style={{ margin: '1rem 0', padding: '1rem', borderRadius: '0.5rem' }}>{errorMsg}</div>}

                {/* Form fields depending on current active step */}
                <div style={{ minHeight: '260px' }}>

                    {currentStep === 1 && (
                        <div className="saas-wizard-step animate-fade-in">
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 0.25rem 0' }}>Request Campus Outpass</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0 }}>Designate your stay address.</p>
                            </div>

                            <div className="form-group" style={{ marginTop: '0.5rem' }}>
                                <label className="form-label" htmlFor="destination-input">Full Stay / Destination Address</label>
                                <input
                                    id="destination-input"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="E.g., Parent's Home Address, Guardian Residence, Medical Care Center"
                                    className={`form-input ${errors.destination ? 'input-error' : ''}`}
                                />
                                {errors.destination && <div className="input-error-msg">{errors.destination}</div>}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="saas-wizard-step animate-fade-in">
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 0.25rem 0' }}>Specify leave timeline</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0 }}>Establish when your outpass should be valid.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="from-date-input">Leave Start Date</label>
                                    <input
                                        id="from-date-input"
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className={`form-input ${errors.fromDate ? 'input-error' : ''}`}
                                    />
                                    {errors.fromDate && <div className="input-error-msg">{errors.fromDate}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="to-date-input">Expected Return</label>
                                    <input
                                        id="to-date-input"
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className={`form-input ${errors.toDate ? 'input-error' : ''}`}
                                    />
                                    {errors.toDate && <div className="input-error-msg">{errors.toDate}</div>}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="time-out-input">Expected Time Out</label>
                                    <CustomTimePicker
                                        value={expectedTimeOut}
                                        onChange={setExpectedTimeOut}
                                        placeholder="Select Out Time"
                                    />
                                    {errors.expectedTimeOut && <div className="input-error-msg">{errors.expectedTimeOut}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="time-in-input">Expected Time In</label>
                                    <CustomTimePicker
                                        value={expectedTimeIn}
                                        onChange={setExpectedTimeIn}
                                        placeholder="Select Return Time"
                                    />
                                    {errors.expectedTimeIn && <div className="input-error-msg">{errors.expectedTimeIn}</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="saas-wizard-step animate-fade-in">
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 0.25rem 0' }}>State clear justification</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0 }}>Explain the reason for leaving campus blocks.</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reason-textarea">Reason for Leave Outpass</label>
                                <textarea
                                    id="reason-textarea"
                                    rows={4}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Write a clear reason (e.g., medical treatment, family emergency, weekend outing)..."
                                    className={`form-input ${errors.reason ? 'input-error' : ''}`}
                                    style={{ resize: 'none' }}
                                />
                                {errors.reason && <div className="input-error-msg">{errors.reason}</div>}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="saas-wizard-step animate-fade-in">
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 0.25rem 0' }}>Parent contact verification</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0 }}>Lodge guardian contact digits to authorize security logs.</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="parent-phone-input">Parent / Guardian Phone</label>
                                <input
                                    id="parent-phone-input"
                                    type="tel"
                                    value={parentPhone}
                                    onChange={(e) => setParentPhone(e.target.value)}
                                    placeholder="10-digit mobile number"
                                    className={`form-input ${errors.parentPhone ? 'input-error' : ''}`}
                                />
                                {errors.parentPhone && <div className="input-error-msg">{errors.parentPhone}</div>}
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }} className="animate-fade-in">
                            <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 0.25rem 0' }}>Leave Application Submitted!</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', maxWidth: '340px', margin: '0 auto 1.5rem' }}>Your leave application has been registered. Wardens and parents have been pinged to sign off your digital outpass pass.</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="btn-secondary"
                                style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem' }}
                            >
                                File New Leave Application
                            </button>
                        </div>
                    )}

                </div>

                {/* Form buttons */}
                {currentStep < 5 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '2rem' }}>
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="saas-dropdown-item"
                                style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', padding: '0.5rem 1rem' }}
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                        ) : <div />}

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn-primary"
                                style={{ borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', padding: '0.5rem 1.25rem' }}
                            >
                                Continue <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary"
                                style={{ background: 'var(--color-success)', border: 'none', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', padding: '0.5rem 1.5rem' }}
                            >
                                {loading ? 'Filing outpass...' : 'Submit Leave Application'} <CheckCircle size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Outpass Summary live Card */}
            <div className="saas-outpass-summary" style={{ boxShadow: 'var(--shadow-md)', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 1.25rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    📝 Live Outpass Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 600 }}>STAY / DESTINATION ADDRESS</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark)' }}>{destination || "E.g., Parent's Home Address..."}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 600 }}>LEAVE TIMELINE</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                            {fromDate ? new Date(fromDate).toLocaleDateString() : 'TBD'} {expectedTimeOut ? `at ${expectedTimeOut}` : ''} ➔ {toDate ? new Date(toDate).toLocaleDateString() : 'TBD'} {expectedTimeIn ? `at ${expectedTimeIn}` : ''}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 600 }}>JUSTIFIED REASON</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                            {reason ? `"${reason}"` : '“Explain the reason for leaving campus...”'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 600 }}>PARENT EMERGENCY CONTACT</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark)' }}>{parentPhone || 'E.g. 98765-43210'}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
