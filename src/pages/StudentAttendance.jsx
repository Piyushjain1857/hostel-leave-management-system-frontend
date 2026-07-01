/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Download, Search } from 'lucide-react';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/attendance');
      if (res.ok) setAttendance(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Student ID,Date,Check In,Check Out,Status\n" 
      + attendance.map(a => `${a.studentId},${a.date},${a.checkInTime || '-'},${a.checkOutTime || '-'},${a.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'attendance_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = attendance.filter(a => 
    (a.studentId.toString().includes(searchTerm)) &&
    (dateFilter === '' || a.date === dateFilter)
  );

  return (
    <div className="p-6 animate-fade-in" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon className="text-blue-600" size={28} />
            Student Attendance Management
          </h2>
          <p style={{ color: '#4b5563', marginTop: '0.25rem' }}>Track daily hostel presence and exit logs.</p>
        </div>
        <button 
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <Download size={18} /> Export Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Records</p>
          <p style={{ color: '#111827', fontSize: '2rem', fontWeight: 700 }}>{attendance.length}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Present Today</p>
          <p style={{ color: '#111827', fontSize: '2rem', fontWeight: 700 }}>{attendance.filter(a => a.status === 'Present').length}</p>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by Student ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading attendance...</div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', color: '#374151', fontWeight: 600 }}>Student ID</th>
                  <th style={{ padding: '1rem', color: '#374151', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem', color: '#374151', fontWeight: 600 }}>Check-In</th>
                  <th style={{ padding: '1rem', color: '#374151', fontWeight: 600 }}>Check-Out</th>
                  <th style={{ padding: '1rem', color: '#374151', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>#{a.studentId}</td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>{a.date}</td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#10b981" /> {a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : '-'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#ef4444" /> {a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : '-'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {a.status === 'Present' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                          <CheckCircle size={14} /> Present
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                          <XCircle size={14} /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
