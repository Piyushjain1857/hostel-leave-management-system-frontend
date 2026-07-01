import { useState, useEffect } from 'react';
import { HelpCircle, PlusCircle, CheckCircle, ShieldAlert, FileText, ChevronDown } from 'lucide-react';

export default function StudentSupport() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState(null);

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const token = localStorage.getItem('studentToken');
  const backendBase = 'http://localhost:5005';

  const faqs = [
    {
      q: 'How long does outpass leave approval take?',
      a: 'Warden approval usually takes between 2 to 6 hours. Out-station leaves require prior Parent/Guardian approval inside their parent portal before the Block Warden reviews it.'
    },
    {
      q: 'What are the night curfew hours and penalties?',
      a: 'The hostel gates shut down strictly at 8:30 PM. Late check-in logging will send an automated notification to registered parent emails. 3 consecutive late arrivals will suspend outpass privileges.'
    },
    {
      q: 'My QR gate pass scanner did not scan. What should I do?',
      a: 'If the scanner fails to check you out or in, ask the security guards on duty to enter your Student ID directly into their Gate Register terminals to update your exit/entry log.'
    },
    {
      q: 'Can I apply for a leave extending beyond 7 days?',
      a: 'Special academic leaves exceeding 7 days must be backed by a permission letter from your Department Head. You must upload or physically present it to the Chief Warden.'
    }
  ];

  const loadTickets = async () => {
    try {
      const res = await fetch(`${backendBase}/support/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json().catch(() => ([]));
      if (res.ok) {
        setTickets(json);
      }
    } catch (e) {
      console.warn("Loading offline mock support tickets:", e);
      const stored = localStorage.getItem('mockStudentTickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 1,
            subject: 'Student ID card scanning error',
            description: 'My ID card is not recognized at block gate scanners.',
            status: 'Pending',
            createdAt: new Date().toISOString()
          }
        ];
        setTickets(seed);
        localStorage.setItem('mockStudentTickets', JSON.stringify(seed));
      }
    }
  };

  useEffect(() => {
    (async () => { await loadTickets(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Please fill in ticket details.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = { subject, description };

    try {
      const res = await fetch(`${backendBase}/support/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Support ticket raised successfully! Our support staff will contact you.' });
        setSubject('');
        setDescription('');
        await loadTickets();
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Error submitting');
      }
    } catch (e) {
      console.warn("Raise ticket locally:", e);
      const newTicket = {
        id: tickets.length + 1,
        ...payload,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      const updated = [newTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem('mockStudentTickets', JSON.stringify(updated));
      setMessage({ type: 'success', text: '[DEMO MODE] Support ticket registered locally.' });
      setSubject('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page-container animate-fade-in" style={{ margin: '-1rem 0' }}>
      {/* Premium Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)', borderRadius: '1.25rem', padding: '1.5rem 2rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
          <div className="icon-pulse" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <HelpCircle size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Help & Student Support</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0', maxWidth: '500px', lineHeight: 1.4 }}>Find quick answers, check helplines, or raise a support ticket to resolve server issues.</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ margin: '1rem 0' }}>
          <div className="toast-icon">
            {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
          </div>
          <div>
            <p className="toast-title">{message.type === 'success' ? 'Support Ticket Raised' : 'Support Desk Alert'}</p>
            <p className="toast-text">{message.text}</p>
          </div>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="support-layout-grid" style={{ marginTop: '0.5rem', gap: '1rem' }}>
        {/* Left Side: FAQs and Support Contacts */}
        <div className="support-left-col">
          {/* 1. FAQ Accordions */}
          <section style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={20} strokeWidth={1.5} color="#0f172a" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', letterSpacing: '0.05em' }}>
                FREQUENTLY ASKED QUESTIONS
              </h4>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        border: '1px solid',
                        borderColor: isOpen ? '#4f46e5' : '#e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <button 
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        style={{
                          width: '100%', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer',
                          fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textAlign: 'left'
                        }}
                      >
                        <span>{faq.q}</span>
                        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: '#0f172a' }}>
                          <ChevronDown size={18} strokeWidth={2} />
                        </div>
                      </button>
                      <div 
                        style={{ 
                          maxHeight: isOpen ? '300px' : '0', 
                          overflow: 'hidden', 
                          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease',
                          opacity: isOpen ? 1 : 0
                        }}
                      >
                        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.6' }}>
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 2. Contact Helplines */}
          <section className="section-card hover-lift" style={{ marginTop: '0.75rem' }}>
            <div className="section-card-header">
              <h4 className="section-card-title">Helpline Contacts</h4>
            </div>
            <div className="section-card-body">
              <div className="contact-box" style={{ gap: '0' }}>
                <div className="contact-box-item" style={{ fontSize: '0.8125rem', padding: '0.5rem', borderRadius: '0.375rem' }}>
                  <strong>🏢 Warden Office</strong>: Ext 104, Email: <span style={{ color: '#1e40af' }}>warden.help@college.edu</span>
                </div>
                <div className="contact-box-item" style={{ borderTop: '1px solid var(--color-border)', padding: '0.5rem', fontSize: '0.8125rem', borderRadius: '0.375rem' }}>
                  <strong>🛠️ Campus IT Desk</strong>: Ext 999, Email: <span style={{ color: '#1e40af' }}>it.support@college.edu</span>
                </div>
                <div className="contact-box-item" style={{ borderTop: '1px solid var(--color-border)', padding: '0.5rem', fontSize: '0.8125rem', borderRadius: '0.375rem' }}>
                  <strong>📞 Medical Emergency</strong>: Ext 101, Phone: <span style={{ color: '#1e40af' }}>+91 98765-43210</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Raise Support Ticket Form & Active Tickets list */}
        <div className="support-right-col">
          <section className="section-card hover-lift">
            <div className="section-card-header">
              <h4 className="section-card-title"><PlusCircle size={16} /> Raise Support Ticket</h4>
            </div>
            <div className="section-card-body">
              <form onSubmit={handleRaiseTicket} className="support-ticket-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="st-subject">Issue Subject</label>
                  <input
                    id="st-subject"
                    type="text"
                    placeholder="E.g., QR pass scanner displaying error 500"
                    className="form-input"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="st-desc">Describe What Happened</label>
                  <textarea
                    id="st-desc"
                    rows={3}
                    placeholder="Describe the issue step-by-step so support staff can resolve it quickly..."
                    className="form-input"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                  {loading ? 'Filing support ticket...' : 'Open Support Ticket'}
                </button>
              </form>
            </div>
          </section>

          {/* Tickets History List */}
          <section className="section-card hover-lift" style={{ marginTop: '0.75rem' }}>
            <div className="section-card-header">
              <h4 className="section-card-title"><FileText size={16} /> Raised Tickets History</h4>
            </div>
            <div className="section-card-body">
              {tickets.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>No support tickets created.</p>
              ) : (
                <div className="tickets-list">
                  {tickets.map(t => (
                    <div key={t.id} className="ticket-list-item" style={{ borderBottom: '1px solid #f1f5f9', padding: '0.5rem', marginBottom: '0.25rem', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.8125rem', color: '#1e293b' }}>{t.subject}</strong>
                        <span className="status-badge status-pending" style={{ fontSize: '0.65rem' }}>{t.status}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0' }}>{t.description}</p>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1) !important;
          border-color: #cbd5e1 !important;
        }
        .icon-pulse {
          animation: subtlePulse 2.5s infinite;
        }
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .faq-item {
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          transform: translateX(4px);
          border-color: var(--color-primary) !important;
        }
        .contact-box-item {
          transition: background 0.2s, transform 0.2s;
        }
        .contact-box-item:hover {
          background: #fff;
          transform: translateX(4px);
        }
        .ticket-list-item {
          transition: all 0.2s ease, padding 0.2s;
          cursor: pointer;
          border-left: 3px solid transparent;
        }
        .ticket-list-item:hover {
          background: #f8fafc;
          padding-left: 0.85rem !important;
          border-left-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
