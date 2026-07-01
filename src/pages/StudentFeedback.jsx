import { useState, useEffect } from 'react';
import { Send, CheckCircle, ShieldAlert, AlertCircle, MessageSquare, Tag, AlignLeft, Calendar, FileText, ClipboardList } from 'lucide-react';

export default function StudentFeedback() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hostel Facilities');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem('studentToken');
  const backendBase = 'http://localhost:5005';

  const loadHistory = async () => {
    try {
      const res = await fetch(`${backendBase}/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json().catch(() => ([]));
      if (res.ok) {
        setHistory(json);
      }
    } catch (e) {
      console.warn("Loading offline mock feedback:", e);
      const stored = localStorage.getItem('mockStudentFeedback');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        const defaultList = [
          {
            id: 1,
            subject: 'WiFi speed issue in B-Block 402',
            description: 'WiFi speeds are below 512Kbps and it disconnects frequently during study hours.',
            category: 'Internet & WiFi',
            status: 'Pending',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            subject: 'Water leakage in Restroom',
            description: 'Tap on the second floor is leaking continuously since morning.',
            category: 'Hostel Facilities',
            status: 'Resolved',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          }
        ];
        setHistory(defaultList);
        localStorage.setItem('mockStudentFeedback', JSON.stringify(defaultList));
      }
    }
  };

  useEffect(() => {
    (async () => { await loadHistory(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all complaint details.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = { subject, description, category };

    try {
      const res = await fetch(`${backendBase}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Complaint registered successfully! The block warden will review this shortly.' });
        setSubject('');
        setDescription('');
        await loadHistory();
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Error submitting');
      }
    } catch (e) {
      console.warn("Lodge complaint locally:", e);
      const newComplaint = {
        id: history.length + 1,
        ...payload,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      const updated = [newComplaint, ...history];
      setHistory(updated);
      localStorage.setItem('mockStudentFeedback', JSON.stringify(updated));
      setMessage({ type: 'success', text: '[DEMO MODE] Complaint registered locally.' });
      setSubject('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Resolved' || status === 'Approved') return 'status-resolved';
    if (status === 'In Progress' || status === 'Pending') return 'status-pending';
    return 'status-rejected';
  };

  return (
    <div className="feedback-premium-container">
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)', borderRadius: '1.25rem', padding: '1.5rem 2rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', marginBottom: '2.5rem' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
          <div className="icon-pulse" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <MessageSquare size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Feedback & Complaints Registry</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0', maxWidth: '500px', lineHeight: 1.4 }}>File and track official complaints or maintenance requests. Hostels wardens review and track resolved statuses.</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ marginBottom: '2rem' }}>
          <div className="toast-icon">
            {message.type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
          </div>
          <div>
            <p className="toast-title">{message.type === 'success' ? 'Request Registered' : 'Registration Alert'}</p>
            <p className="toast-text">{message.text}</p>
          </div>
        </div>
      )}

      <div className="feedback-grid">
        {/* Left Side: Submit Complaint Form */}
        <section className="premium-card">
          <div className="premium-card-header">
            <div className="premium-card-icon">
              <MessageSquare size={22} />
            </div>
            <h4 className="premium-card-title">Submit Maintenance Ticket</h4>
          </div>
          <div className="premium-card-body">
            <form onSubmit={handleSubmit}>
              <div className="premium-form-group">
                <label className="premium-label" htmlFor="fb-cat">Complaint Category</label>
                <div className="premium-input-container">
                  <Tag className="premium-input-icon" size={18} />
                  <select id="fb-cat" className="premium-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Hostel Facilities">Hostel Facilities & Rooms</option>
                    <option value="Mess & Food">Mess & Dietary Food</option>
                    <option value="Internet & WiFi">Internet & WiFi Connections</option>
                    <option value="Security & Gate">Security & Gate Controls</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="premium-form-group">
                <label className="premium-label" htmlFor="fb-subject">Brief Subject</label>
                <div className="premium-input-container">
                  <FileText className="premium-input-icon" size={18} />
                  <input
                    id="fb-subject"
                    type="text"
                    placeholder="E.g., Water leakage in B Block restroom"
                    className="premium-input"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="premium-form-group">
                <label className="premium-label" htmlFor="fb-desc">Detailed Description</label>
                <div className="premium-input-container" style={{ alignItems: 'flex-start', paddingTop: '0.85rem' }}>
                  <AlignLeft className="premium-input-icon" size={18} style={{ top: '1rem' }} />
                  <textarea
                    id="fb-desc"
                    placeholder="Explain details of the issue to help block wardens inspect efficiently..."
                    className="premium-textarea"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <button type="submit" disabled={loading} className="premium-btn">
                {loading ? 'Filing Ticket...' : (
                  <>
                    <Send size={18} /> <span>Submit Complaint Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Right Side: Historical Complaints Log */}
        <section className="premium-card">
          <div className="premium-card-header">
            <div className="premium-card-icon" style={{ color: '#0ea5e9' }}>
              <ClipboardList size={22} />
            </div>
            <h4 className="premium-card-title">My Complaints Log</h4>
          </div>
          <div className="premium-card-body" style={{ padding: history.length === 0 ? '2rem' : '1.5rem 1rem 1.5rem 2rem' }}>
            {history.length === 0 ? (
              <div className="premium-empty">
                <AlertCircle size={48} />
                <p className="premium-empty-title">No Complaints Filed</p>
                <p className="premium-empty-text">You have not raised any feedback or complaint tickets yet.</p>
              </div>
            ) : (
              <div className="premium-history-list">
                {history.map((x) => (
                  <div key={x.id} className="history-item" style={{ '--item-color': x.status === 'Resolved' ? '#10b981' : x.status === 'Pending' ? '#f59e0b' : '#ef4444' }}>
                    <div className="history-item-header">
                      <div>
                        <h5 className="history-item-title">{x.subject}</h5>
                        <span className="history-item-category">
                          <Tag size={12} /> {x.category}
                        </span>
                      </div>
                      <span className={`status-pill ${getStatusClass(x.status)}`}>
                        {x.status}
                      </span>
                    </div>
                    {x.description && (
                      <p className="history-item-desc">{x.description}</p>
                    )}
                    <div className="history-item-footer">
                      <span className="history-item-date">
                        <Calendar size={13} /> {new Date(x.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                        ID: #{x.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
