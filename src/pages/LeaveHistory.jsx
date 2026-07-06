import { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

const backendBase = import.meta.env.VITE_API_URL;

export default function LeaveHistory() {
    const [items, setItems] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const studentToken = useMemo(() => localStorage.getItem('studentToken'), []);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setErrorMsg(null);
            try {
                const res = await fetch(`${backendBase}/leave/history`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(studentToken ? { Authorization: `Bearer ${studentToken}` } : {}),
                    },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || 'Failed to fetch history');
                setItems(Array.isArray(data) ? data : data.items || []);
            } catch (e) {
                setErrorMsg(e.message);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [studentToken]);

    const filtered = items
        .filter((x) => (statusFilter === 'all' ? true : String(x.status).toLowerCase() === statusFilter))
        .filter((x) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return (
                String(x.reason || '').toLowerCase().includes(q) ||
                String(x.id || '').toLowerCase().includes(q)
            );
        });

    return (
        <div className="history-screen-container">
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)', borderRadius: '1.25rem', padding: '1.5rem 2rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', marginBottom: '2.5rem' }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    <div className="icon-pulse" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Clock size={28} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Leave History & Logs</h2>
                        <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0', maxWidth: '500px', lineHeight: 1.4 }}>List of all submitted outpasses, past approvals, and status logs.</p>
                    </div>
                </div>
            </div>

            <div className="history-card animate-fade-in">
                {errorMsg && <div className="history-toast alert-error">{errorMsg}</div>}

                <div className="history-toolbar">
                    <input
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID or reason..."
                    />

                    <div className="filters-dropdown">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="out">Out</option>
                            <option value="returned">Returned</option>
                            <option value="late return">Late Return</option>
                        </select>
                    </div>
                </div>

                <div className="history-table-wrapper">
                    <table className="history-data-table">
                        <thead>
                            <tr>
                                <th>Leave ID</th>
                                <th>Reason</th>
                                <th>Expected Out / In</th>
                                <th>Actual Out / In</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="loading-cell">Loading outpasses...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-cell">No leave requests found.</td>
                                </tr>
                            ) : (
                                filtered.map((x) => (
                                    <tr key={x.id}>
                                        <td className="id-cell">#{x.id}</td>
                                        <td className="reason-cell" title={x.reason}>{x.reason}</td>
                                        <td className="dates-cell">
                                            <div style={{ fontSize: '0.8rem' }}>
                                                <b>Out:</b> {new Date(x.fromDate).toLocaleDateString()} {x.expectedTimeOut ? `at ${x.expectedTimeOut}` : ''}
                                                <br />
                                                <b>In:</b> {new Date(x.toDate).toLocaleDateString()} {x.expectedTimeIn ? `at ${x.expectedTimeIn}` : ''}
                                            </div>
                                        </td>
                                        <td className="dates-cell">
                                            <div style={{ fontSize: '0.8rem' }}>
                                                <b>Out:</b> {x.actualTimeOut ? new Date(x.actualTimeOut).toLocaleString() : 'Not Started'}
                                                <br />
                                                <b>In:</b> {x.actualTimeIn ? new Date(x.actualTimeIn).toLocaleString() : (x.actualTimeOut ? 'Still Out' : 'Not Started')}
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className={`pill-badge pill-${String(x.status).toLowerCase()}`}>{x.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
