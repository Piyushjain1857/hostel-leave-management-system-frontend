import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Lock, Mail, User, Home, FileText, HelpCircle, CheckCircle, Eye, EyeOff, BookOpen, ArrowRight, ShieldAlert, LayoutDashboard, PlusSquare, LogOut, Info, Phone, Search, Menu, Bell, BellOff, Settings, MapPin, Activity, Clock } from 'lucide-react';

import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import QRGatePass from './pages/QRGatePass';
import ParentLogin from './pages/ParentLogin';
import ParentApprovalDashboard from './pages/ParentApprovalDashboard';
import WardenLogin from './pages/WardenLogin';
import WardenDashboard from './pages/WardenDashboard';
import QRScanner from './pages/QRScanner';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentNotifications from './pages/StudentNotifications';
import StudentFeedback from './pages/StudentFeedback';
import StudentSupport from './pages/StudentSupport';

// Advanced Screens (31-40)
import AdvancedChangePassword from './pages/AdvancedChangePassword';
import AdvancedEditProfile from './pages/AdvancedEditProfile';
import ActiveLeavesManagement from './pages/ActiveLeavesManagement';
import ApprovedLeavesAnalytics from './pages/ApprovedLeavesAnalytics';
import RejectedLeavesManagement from './pages/RejectedLeavesManagement';
import UserActivityLogCenter from './pages/UserActivityLogCenter';
import QRPassHistory from './pages/QRPassHistory';
import HostelManagement from './pages/HostelManagement';
import RoomManagement from './pages/RoomManagement';
import SmartNotificationCenter from './pages/SmartNotificationCenter';

// Advanced Admin & Super Admin Screens (41-48)
import SecurityAccessControl from './pages/SecurityAccessControl';
import StudentAttendance from './pages/StudentAttendance';
import EmergencyContactManagement from './pages/EmergencyContactManagement';
import VisitorManagement from './pages/VisitorManagement';
import RoomAllocation from './pages/RoomAllocation';
import LeaveAnalyticsInsights from './pages/LeaveAnalyticsInsights';
import SystemAuditLogs from './pages/SystemAuditLogs';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import HostelAnnouncements from './pages/HostelAnnouncements';

const backendUrl = 'http://localhost:5005';

const defaultPortalRules = [
  { id: 'p1', title: '1. Use of Authentic Credentials Only', desc: 'Access to this digital portal is strictly restricted to your authorized @college.edu institutional email address. Do not attempt to register secondary accounts or use personal email addresses. Doing so will result in an automatic account suspension.' },
  { id: 'p2', title: '2. Strict Parent Account Linking Protocols', desc: 'You must ensure your correct parent or guardian email is registered in the system for outpass approvals. Falsifying parent emails, creating fake proxy accounts, or approving your own outpasses is considered a severe disciplinary offense.' },
  { id: 'p3', title: '3. Maintaining Profile Accuracy', desc: 'It is the student\'s responsibility to keep their emergency contact numbers, blood group, and allocated room details updated in the Profile section. Outpass applications may be automatically rejected by the system if the profile data is found to be incomplete or mismatched.' },
  { id: 'p4', title: '4. Dynamic QR Gate Pass Integrity', desc: 'Do not screenshot, screen-record, or share your QR gate passes. The QR codes rotate dynamically every few seconds. Presenting an old or static screenshot at the security scanner will trigger an immediate security alert and block your exit.' },
  { id: 'p5', title: '5. Honesty in Leave Applications', desc: 'Providing false reasons, fabricated medical certificates, or fake destination addresses for leave applications will result in a permanent ban from using the digital portal. All applications are subject to random verification calls to parents.' },
  { id: 'p6', title: '6. Account Password Security', desc: 'You are required to change your access passkey every 90 days. Never share your password or OTPs with peers, seniors, or even administration staff. You are entirely responsible for any outpass generated from your logged-in session.' },
  { id: 'p7', title: '7. Mandatory Gate Scanning Protocol', desc: 'When entering or exiting the campus, you must physically present your own device to the security guard to scan the QR code. Tailgating behind another student without scanning your own pass will flag you as an unauthorized absconder.' },
  { id: 'p8', title: '8. Status Acknowledgement and Bulletins', desc: 'Students are expected to frequently check the Announcements tab. You must manually click and mark critical bulletins as "Read" to acknowledge receipt of important administrative notices. Ignorance of a published rule is not an acceptable excuse.' },
  { id: 'p9', title: '9. Automated Session Timeouts', desc: 'For your security, the portal will automatically log you out after 30 minutes of inactivity. If you are using a shared computer in the library or computer lab, you must ensure you manually log out and close the browser window.' },
  { id: 'p10', title: '10. Proper Issue Reporting Channels', desc: 'If you experience bugs, application crashes, or approval delays exceeding 48 hours, do not create duplicate outpass requests. Instead, raise a detailed technical ticket via the Support Hub tab so the IT team can resolve the underlying issue.' }
];

const defaultHostelRules = [
  { id: 'h1', title: '1. Strict Night Curfew Hours', desc: 'All campus borders, main gates, and hostel block entrances are strictly shut down at 8:30 PM every night without exception. Students attempting late entries will be denied access to the block and must wait in the security lounge. Repeated late entries will trigger automated disciplinary logs which are instantly emailed to registered parents or guardians.' },
  { id: 'h2', title: '2. Outpass Application Deadlines', desc: 'All outpass applications must be submitted through this digital portal at least 24 hours prior to the requested leave start time. This buffer period is mandatory to guarantee that the Chief Warden has adequate time to review the request, cross-check academic schedules, and issue an approval.' },
  { id: 'h3', title: '3. Mandatory Biometric Attendance Checks', desc: 'Biometric fingerprint scanning is actively enforced in all block lobbies from 9:00 PM to 9:30 PM daily. It is the absolute responsibility of the student to ensure their attendance is marked. Unmarked absences, even if the student is inside the room, will incur heavy penalty fines and a potential suspension of outpass privileges.' },
  { id: 'h4', title: '4. Enforcement of Silence Hours', desc: 'Strict silence must be maintained in all corridors, common rooms, and residential rooms from 10:00 PM to 6:00 AM. This policy respects the study and sleep schedules of all residents. Playing loud music, shouting across hallways, or gathering in large noisy groups during these hours will lead to confiscation of speakers and disciplinary action.' },
  { id: 'h5', title: '5. Comprehensive Visitor Policy', desc: 'Under no circumstances are outside visitors, including day-scholars and family members, permitted inside individual student rooms. All visitors must be registered at the main gate and can only be entertained in the designated ground-floor visitor lounges during approved visiting hours (4:00 PM to 7:00 PM).' },
  { id: 'h6', title: '6. Room Cleanliness and Maintenance', desc: 'Students are held responsible for the daily tidiness and hygiene of their allocated rooms. Surprise inspections are conducted weekly by the block wardens. Rooms found with accumulated garbage, unhygienic conditions, or damaged furniture will result in maintenance fines levied equally among the room\'s occupants.' },
  { id: 'h7', title: '7. Prohibition of Heavy Electrical Appliances', desc: 'To prevent severe fire hazards and power tripping, heavy electrical appliances such as induction stoves, room heaters, electric kettles, and irons are strictly prohibited in student rooms. Only laptops, mobile chargers, and small table lamps are permitted. Confiscated items will not be returned until the end of the semester.' },
  { id: 'h8', title: '8. Zero Tolerance for Contraband & Intoxicants', desc: 'The institution enforces a strict zero-tolerance policy for the possession, consumption, or distribution of alcohol, tobacco products, e-cigarettes, and illegal narcotic substances. Any discovery of such items during random sweeps will lead to immediate expulsion from the hostel and potential handover to local law enforcement.' },
  { id: 'h9', title: '9. Liability for Damage to Institutional Property', desc: 'Any intentional or accidental damage to institutional property—including corridor lighting, elevator buttons, lounge furniture, or bathroom fixtures—will result in repair costs being deducted directly from the responsible student\'s security deposit. If the culprit is unidentified, the fine is distributed across the entire floor.' },
  { id: 'h10', title: '10. Mandatory Dress Code in Common Areas', desc: 'Appropriate, modest, and clean casual wear must be worn at all times when outside the residential room. This includes all common areas, mess halls, sports facilities, and administrative offices. Nightwear and bathroom slippers are strictly prohibited in the dining hall.' },
  { id: 'h11', title: '11. Strict Mess Timings and Dining Etiquette', desc: 'Meals are freshly prepared and served only during strict pre-defined time slots (Breakfast: 7:30-9:00 AM, Lunch: 12:30-2:00 PM, Dinner: 7:30-9:00 PM). Taking mess utensils, plates, or prepared food into hostel rooms is considered theft and is strictly not allowed.' },
  { id: 'h12', title: '12. Overnight Leave Return Protocols', desc: 'When returning from an approved overnight or multi-day leave, students must scan their QR gate pass back into the campus before the 8:30 PM curfew on the designated end date. Failing to report back on time without extending the outpass online will flag the student as an unauthorized absentee.' },
  { id: 'h13', title: '13. Protocols for Medical Emergencies', desc: 'In the event of a severe illness or injury, students must immediately notify the block warden or utilize the 24/7 medical room located on the ground floor of Block A. The on-campus nurse will evaluate the situation and arrange for an ambulance to the partnered hospital if necessary.' },
  { id: 'h14', title: '14. Zero Tolerance Anti-Ragging Policy', desc: 'Ragging, bullying, hazing, or any form of physical or mental harassment is a severe criminal offense under state law. Perpetrators of such acts face immediate rustication from the college, permanent blacklisting, and a mandatory First Information Report (FIR) filed with the local police.' },
  { id: 'h15', title: '15. Room Key Security and Management', desc: 'Duplication of room keys by outside vendors is strictly forbidden and constitutes a major security breach. Lost keys must be reported to the Chief Warden desk immediately to arrange for a full lock replacement at the student\'s expense.' },
  { id: 'h16', title: '16. Safekeeping of Personal Valuables', desc: 'Students are solely responsible for the safety of their laptops, cash, jewelry, and other high-value items. Always double-lock your room and cupboards when stepping out, even for a few minutes. The institution assumes no liability for stolen or misplaced personal property.' },
  { id: 'h17', title: '17. Birthday Celebrations and Gatherings', desc: 'Birthday celebrations are permitted only in the designated common rooms and must conclude strictly by 11:30 PM. Smearing cake on walls, using party poppers that leave permanent stains, or causing property damage will result in heavy fines for the entire organizing group.' },
  { id: 'h18', title: '18. E-Commerce Deliveries & Parcels', desc: 'All e-commerce packages, mail, and food deliveries must be collected directly from the designated parcel drop-off zone at the main security gate before 8:00 PM. Delivery personnel are not allowed past the main gate under any circumstances.' },
  { id: 'h19', title: '19. Mandatory Resource Conservation', desc: 'As part of our green campus initiative, students must switch off all lights, fans, and electronics when leaving their room. Any leaking taps or running toilets must be reported to the maintenance desk via the Support Hub immediately to prevent water wastage.' },
  { id: 'h20', title: '20. Mandatory Fire Evacuation Drills', desc: 'Mandatory participation is required for all emergency fire drills conducted each semester. When the alarm sounds, students must leave all belongings, exit via the marked stairwells (do not use elevators), and assemble at the designated safe zone on the main sports ground.' }
];

const defaultWardenDirectory = [
  { id: 'w1', role: 'Chief Authority', name: 'Dr. Anil jain Sharma', location: 'Main Campus Office', phone: '+91 98765 43210', email: 'warden.chief@college.edu', color: 'primary', initials: 'AJ' },
  { id: 'w2', role: 'Block A & B', name: 'Prof. Suresh Chandra', location: 'Ground Floor, Block A', phone: '+91 91234 56789', email: 'warden.blockab@college.edu', color: 'secondary', initials: 'SC' },
  { id: 'w3', role: 'Block C & D', name: 'Prof. Mahendra Pal', location: 'First Floor, Block C', phone: '+91 99887 76655', email: 'warden.blockcd@college.edu', color: 'warning', initials: 'MP' }
];

function App() {
  // Authentication & View States
  const [isLogin, setIsLogin] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null); // Stores { token, student }
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('studentActiveTab') || 'dashboard');

  // Load Policies and Directory from API
  const [portalRules, setPortalRules] = useState(defaultPortalRules);
  const [hostelRules, setHostelRules] = useState(defaultHostelRules);
  const [wardenDirectory, setWardenDirectory] = useState(defaultWardenDirectory);

  // Keep state updated in case admin changes them and student is active
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const pRes = await fetch(`${backendUrl}/public/policies?type=portal`);
        if (pRes.ok) {
          const data = await pRes.json();
          if (data.policies && data.policies.length > 0) setPortalRules(data.policies);
        }
        
        const hRes = await fetch(`${backendUrl}/public/policies?type=hostel`);
        if (hRes.ok) {
          const data = await hRes.json();
          if (data.policies && data.policies.length > 0) setHostelRules(data.policies);
        }

        const wRes = await fetch(`${backendUrl}/public/warden-directory`);
        if (wRes.ok) {
          const data = await wRes.json();
          if (data.directory && data.directory.length > 0) setWardenDirectory(data.directory);
        }
      } catch (err) {
        console.error('Error fetching global content:', err);
      }
    };

    fetchPublicData();
    // Poll every few seconds for updates
    const intervalId = setInterval(fetchPublicData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // SaaS Interactive States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState('');
  
  // Rules Accordion States
  const [openHostelRuleIndex, setOpenHostelRuleIndex] = useState(null);
  const [openPortalRuleIndex, setOpenPortalRuleIndex] = useState(null);

  // New States for Email & Notifications System
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetRole, setResetRole] = useState('student');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [hostelAssigned, setHostelAssigned] = useState('');
  const [shift] = useState('Day Shift');

  // Login/Register Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard Data States
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [leavesList, setLeavesList] = useState([]);

  // Shared Notifications States
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!loggedInUser || !loggedInUser.token) return;
    try {
      setNotificationsLoading(true);
      const res = await fetch(`${backendUrl}/student/notifications`, {
        headers: { Authorization: `Bearer ${loggedInUser.token}` }
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotifications(json);
      } else {
        throw new Error('API Offline');
      }
    } catch (e) {
      console.warn("Offline fallback for notifications inside App.jsx:", e);
      const stored = localStorage.getItem('mockStudentNotifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 1,
            title: 'Curfew Reminder',
            message: 'All students are requested to be back in their respective blocks by 8:30 PM today due to weather forecasts.',
            createdAt: new Date().toISOString(),
            status: 'Unread'
          },
          {
            id: 2,
            title: 'Mess Menu Updated',
            message: 'The academic hostel mess menu has been updated. Check details on hostel bulletin board.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'Read'
          }
        ];
        setNotifications(seed);
        localStorage.setItem('mockStudentNotifications', JSON.stringify(seed));
      }
    } finally {
      setNotificationsLoading(false);
    }
  }, [loggedInUser]);

  const handleMarkNotificationRead = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/notification/read/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${loggedInUser.token}` }
      });
      if (res.ok) {
        const updated = notifications.map(n => n.id === id ? { ...n, status: 'Read' } : n);
        setNotifications(updated);
        localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
      } else {
        throw new Error('API Offline');
      }
    } catch {
      const updated = notifications.map(n => n.id === id ? { ...n, status: 'Read' } : n);
      setNotifications(updated);
      localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/notification/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${loggedInUser.token}` }
      });
      if (res.ok) {
        const updated = notifications.filter(n => n.id !== id);
        setNotifications(updated);
        localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
      } else {
        throw new Error('API Offline');
      }
    } catch {
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      localStorage.setItem('mockStudentNotifications', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    let active = true;
    if (loggedInUser) {
      Promise.resolve().then(() => {
        if (active) loadNotifications();
      });
    } else {
      Promise.resolve().then(() => {
        if (active) setNotifications([]);
      });
    }
    return () => {
      active = false;
    };
  }, [loggedInUser, loadNotifications]);

  // Global Message & Loading States
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');

  // Fetch Dashboard & Leave History details from Backend (with LocalStorage Mock Fallback)
  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/student/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setLoggedInUser({ token, student: data.student });
        setStats(data.stats);
        setLeavesList(data.recentLeaves);
        setIsMockMode(false);
      } else {
        // Token might have expired, clear it
        localStorage.removeItem('studentToken');
      }
    } catch (err) {
      console.warn("Backend API offline. Restoring session via mock LocalStorage database:", err);
      setIsMockMode(true);

      // Load student profile & mock leaves from LocalStorage
      const mockProfileStr = localStorage.getItem('mockStudentProfile');
      let mockProfile = { name: 'Piyush jain', email: 'student@college.edu', hostelRoom: 'B-Block 402' };
      if (mockProfileStr) {
        mockProfile = { ...mockProfile, ...JSON.parse(mockProfileStr) };
      }
      setLoggedInUser({ token: 'mock-jwt-token-xyz-123456789', student: mockProfile });

      syncMockDatabase();
    } finally {
      setLoading(false);
    }
  };

  // Sync mock database inside LocalStorage to maintain persistence
  const syncMockDatabase = () => {
    const storedMockLeaves = localStorage.getItem('mockLeaves');
    let leaves;

    if (storedMockLeaves) {
      leaves = JSON.parse(storedMockLeaves);
    } else {
      // Seed initial mock data
      leaves = [
        {
          id: 101,
          reason: 'Emergency visit to home town for family wedding function.',
          startDate: '2026-05-10',
          endDate: '2026-05-14',
          status: 'Approved',
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 102,
          reason: 'Weekend outing to local guardian\'s house in metro city.',
          startDate: '2026-05-20',
          endDate: '2026-05-22',
          status: 'Approved',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 103,
          reason: 'Special dental appointment and treatment at university hospital.',
          startDate: '2026-05-28',
          endDate: '2026-05-28',
          status: 'Pending',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('mockLeaves', JSON.stringify(leaves));
    }

    setLeavesList(leaves);

    // Calculate mock statistics
    const total = leaves.length;
    const approved = leaves.filter(l => l.status === 'Approved').length;
    const pending = leaves.filter(l => l.status === 'Pending').length;
    setStats({ total, approved, pending });
  };

  // Re-authorize session on reload — check all role tokens
  useEffect(() => {
    // If on the root route, check if any role is logged in and redirect
    const parentToken = localStorage.getItem('parentToken');
    const wardenToken = localStorage.getItem('wardenToken');
    const adminToken = localStorage.getItem('adminToken');
    const studentToken = localStorage.getItem('studentToken');

    if (studentToken) {
      setTimeout(() => {
        fetchDashboardData(studentToken);
      }, 0);
    } else if (parentToken && window.location.pathname === '/') {
      window.location.href = '/parent/pending';
    } else if (wardenToken && window.location.pathname === '/') {
      window.location.href = '/warden/dashboard';
    } else if (adminToken && window.location.pathname === '/') {
      window.location.href = '/admin/dashboard';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist active tab for student so it survives reload
  useEffect(() => {
    localStorage.setItem('studentActiveTab', activeTab);
  }, [activeTab]);

  // Command Menu Shortcut Listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandMenu(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unified Login / Register Submit Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Inline validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) tempErrors.email = 'Enter a valid email address';
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Minimum 6 characters';

    if (!isLogin) {
      if (!name.trim()) tempErrors.name = 'Name is required';
      if (selectedRole === 'student' && !hostelRoom.trim()) tempErrors.hostelRoom = 'Hostel Room is required';
      if (selectedRole === 'parent' && !studentEmail.trim()) tempErrors.studentEmail = 'Student Email is required';
      if (selectedRole === 'parent' && !phone.trim()) tempErrors.phone = 'Phone number is required';
      if (selectedRole === 'warden' && !hostelAssigned.trim()) tempErrors.hostelAssigned = 'Hostel Assigned is required';
      if (selectedRole === 'warden' && !phone.trim()) tempErrors.phone = 'Phone number is required';
    }

    if (Object.keys(tempErrors).length > 0) { setErrors(tempErrors); return; }
    setErrors({});
    setLoading(true);

    const endpoints = {
      student: { login: `${backendUrl}/api/auth/login`, register: `${backendUrl}/api/auth/register` },
      parent: { login: `${backendUrl}/parent/login`, register: `${backendUrl}/api/auth/register` },
      warden: { login: `${backendUrl}/warden/login`, register: `${backendUrl}/api/auth/register` },
      admin: { login: `${backendUrl}/admin/login`, register: `${backendUrl}/api/auth/register` },
    };

    const endpoint = isLogin ? endpoints[selectedRole].login : endpoints[selectedRole].register;
    const payload = isLogin
      ? { email, password }
      : { role: selectedRole, name, email, password, hostelRoom, phone, studentEmail, hostelAssigned, shift };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        if (!isLogin) {
          setMessage({ type: 'success', text: 'OTP sent to your email! Please verify.' });
          setIsVerifyingOTP(true);
        } else {
          setMessage({ type: 'success', text: `Welcome! Loading ${selectedRole} dashboard...` });
          localStorage.removeItem(`${selectedRole}ActiveTab`);
          if (selectedRole === 'student') {
            setActiveTab('dashboard');
            localStorage.setItem('studentToken', data.token);
            fetchDashboardData(data.token);
          } else if (selectedRole === 'parent') {
            localStorage.setItem('parentToken', data.token);
            setTimeout(() => { window.location.href = '/parent/pending'; }, 800);
          } else if (selectedRole === 'warden') {
            localStorage.setItem('wardenToken', data.token);
            setTimeout(() => { window.location.href = '/warden/dashboard'; }, 800);
          } else if (selectedRole === 'admin') {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.admin));
            setTimeout(() => { window.location.href = '/admin/dashboard'; }, 800);
          }
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid credentials. Please try again.' });
      }
    } catch {
      // Offline mock fallback
      const mockEmails = { student: 'student@college.edu', parent: 'parent@college.edu', warden: 'warden@college.edu', admin: 'admin@college.edu' };
      const offlineUsers = JSON.parse(localStorage.getItem('offlineUsers') || '[]');
      const registeredUser = offlineUsers.find(u => u.email === email && u.password === password && u.role === selectedRole);

      if (registeredUser || (isLogin && email === mockEmails[selectedRole] && password === 'password123')) {
        setMessage({ type: 'success', text: `[OFFLINE] ${selectedRole} login successful!` });
        localStorage.removeItem(`${selectedRole}ActiveTab`);
        if (selectedRole === 'student') {
          setActiveTab('dashboard');
          localStorage.setItem('studentToken', 'mock-jwt-token-xyz-123456789');
          if (registeredUser) {
            localStorage.setItem('mockStudentProfile', JSON.stringify({ name: registeredUser.name, email: registeredUser.email, hostelRoom: registeredUser.hostelRoom, phone: '', course: '', year: '' }));
          }
          fetchDashboardData('mock-jwt-token-xyz-123456789');
        } else if (selectedRole === 'parent') {
          localStorage.setItem('parentToken', 'mock-parent-token');
          setTimeout(() => { window.location.href = '/parent/pending'; }, 800);
        } else if (selectedRole === 'warden') {
          localStorage.setItem('wardenToken', 'mock-warden-token');
          setTimeout(() => { window.location.href = '/warden/dashboard'; }, 800);
        } else if (selectedRole === 'admin') {
          localStorage.setItem('adminToken', 'mock-admin-token');
          setTimeout(() => { window.location.href = '/admin/dashboard'; }, 800);
        }
      } else if (!isLogin) {
        offlineUsers.push({ email, password, name, hostelRoom, role: selectedRole });
        localStorage.setItem('offlineUsers', JSON.stringify(offlineUsers));
        setMessage({ type: 'success', text: `[OFFLINE] Registered "${name}" successfully! Now sign in.` });
        setIsLogin(true);
      } else {
        setMessage({ type: 'error', text: `Invalid ${selectedRole} credentials. Hint: use password123 or register a new account.` });
      }
    }
    setLoading(false);
  };

  const handleOTPVerify = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: selectedRole, otp })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Email verified successfully! You can now log in.' });
        setIsVerifyingOTP(false);
        setIsLogin(true);
        setOtp('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Server error' });
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: selectedRole })
      });
      const data = await res.json();
      setMessage({ type: res.ok ? 'success' : 'error', text: data.message });
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Server error' });
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, role: resetRole })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setForgotPasswordStep(2);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Server error' });
    }
    setLoading(false);
  };

  const handleVerifyResetOTP = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, role: resetRole, otp: resetOtp })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setForgotPasswordStep(3);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Server error' });
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, role: resetRole, otp: resetOtp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setShowForgotPassword(false);
        setForgotPasswordStep(1);
        setResetEmail('');
        setResetOtp('');
        setNewPassword('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Server error' });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('studentToken');
    localStorage.removeItem('parentToken');
    localStorage.removeItem('wardenToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('studentActiveTab');
    setPassword('');
    setEmail('');
    setMessage({
      type: 'success',
      text: 'Logged out successfully.'
    });
  };

  const unreadCount = notifications.filter(n => n.status === 'Unread').length;

  return (
    <Routes>
      <Route path="/" element={
        <div className="app-container">

          {!loggedInUser ? (

            /* ==========================================
               1. SAAS PORTAL LOGIN / REGISTER VIEWS
               ========================================== */
            <div className="saas-auth-bg">
              <div className="saas-auth-glow-1"></div>
              <div className="saas-auth-glow-2"></div>

              <div className="saas-auth-card">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '0.75rem' }}>
                    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M50 15 L20 35 L50 55 L80 35 Z" fill="rgba(99, 102, 241, 0.2)" />
                      <path d="M25 41 L25 68 C25 76, 50 85, 50 85 C50 85, 75 76, 75 68 L75 41 L50 55 Z" />
                      <circle cx="50" cy="35" r="4" fill="#8B5CF6" />
                    </svg>
                  </div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#fff', margin: 0 }}>State Tech Leaves</h1>
                  <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.25rem' }}>Hostel Outpass & Leave Portal</p>
                </div>

                {/* Messages Banner */}
                {message && (
                  <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ marginBottom: '1.25rem', borderRadius: '0.75rem', border: 'none' }}>
                    <div className="toast-icon">
                      {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                    </div>
                    <div>
                      <p className="toast-title" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                        {message.type === 'success' ? 'Action Completed' : 'Access Alert'}
                      </p>
                      <p className="toast-text" style={{ fontSize: '0.75rem' }}>{message.text}</p>
                    </div>
                  </div>
                )}

                {isVerifyingOTP ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', margin: 0 }}>Verify Your Email</h2>
                      <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.25rem' }}>Enter the 6-digit verification code sent to <br /><strong>{email}</strong></p>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: '#9ca3af' }}>Verification Code</label>
                      <input type="text" placeholder="••••••"
                        value={otp} onChange={(e) => setOtp(e.target.value)}
                        className="form-input saas-input-dark" style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.3rem', padding: '12px' }} />
                    </div>

                    <button type="button" onClick={handleOTPVerify} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                      {loading ? <span className="spinner"></span> : 'Activate Account'}
                    </button>

                    <button type="button" onClick={handleResendOTP} disabled={loading} className="btn-secondary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Resend Code
                    </button>

                    <button type="button" onClick={() => setIsVerifyingOTP(false)} className="toggle-action-btn" style={{ margin: '0 auto', color: '#818cf8', fontWeight: 500 }}>
                      Back to Registration
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="portal-form" noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* SaaS Role Switcher */}
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Type</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {[
                          { role: 'student', label: '🎓 Student' },
                          { role: 'parent', label: '👨‍👩‍👧 Parent' },
                          { role: 'warden', label: '🏠 Warden' },
                          { role: 'admin', label: '🛡️ Admin' },
                        ].map(({ role, label }) => {
                          const isActive = selectedRole === role;
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => { setSelectedRole(role); setMessage(null); setErrors({}); setEmail(''); setPassword(''); }}
                              className={`saas-role-btn ${isActive ? 'active' : ''}`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name (Register) */}
                    {!isLogin && (
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-name" style={{ color: '#9ca3af' }}>Full Name</label>
                        <div className="form-input-container">
                          <div className="input-icon-left" style={{ color: '#9ca3af' }}><User size={16} /></div>
                          <input id="reg-name" type="text" placeholder="E.g., Piyush jain"
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                        {errors.name && <p className="input-error-msg">{errors.name}</p>}
                      </div>
                    )}

                    {/* Email */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="login-email" style={{ color: '#9ca3af' }}>Work/Academic Email</label>
                      <div className="form-input-container">
                        <div className="input-icon-left" style={{ color: '#9ca3af' }}><Mail size={16} /></div>
                        <input id="login-email" type="email"
                          placeholder={isLogin ? `${selectedRole}@college.edu` : 'your.email@domain.com'}
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem' }} />
                      </div>
                      {errors.email && <p className="input-error-msg">{errors.email}</p>}
                    </div>

                    {/* Student Room Number (Register Student) */}
                    {!isLogin && selectedRole === 'student' && (
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-room" style={{ color: '#9ca3af' }}>Room Allocation Address</label>
                        <div className="form-input-container">
                          <div className="input-icon-left" style={{ color: '#9ca3af' }}><Home size={16} /></div>
                          <input id="reg-room" type="text" placeholder="E.g., B-Block 402"
                            value={hostelRoom} onChange={(e) => setHostelRoom(e.target.value)}
                            className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                        {errors.hostelRoom && <p className="input-error-msg">{errors.hostelRoom}</p>}
                      </div>
                    )}

                    {/* Phone Number (Register Parent/Warden) */}
                    {!isLogin && (selectedRole === 'parent' || selectedRole === 'warden') && (
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#9ca3af' }}>Contact Phone</label>
                        <div className="form-input-container">
                          <div className="input-icon-left" style={{ color: '#9ca3af' }}><Phone size={16} /></div>
                          <input type="text" placeholder="E.g., 9876543210"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                        {errors.phone && <p className="input-error-msg">{errors.phone}</p>}
                      </div>
                    )}

                    {/* Student Email (Register Parent) */}
                    {!isLogin && selectedRole === 'parent' && (
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#9ca3af' }}>Student Email (Ward Link)</label>
                        <div className="form-input-container">
                          <div className="input-icon-left" style={{ color: '#9ca3af' }}><User size={16} /></div>
                          <input type="email" placeholder="E.g., student@college.edu"
                            value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)}
                            className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                        {errors.studentEmail && <p className="input-error-msg">{errors.studentEmail}</p>}
                      </div>
                    )}

                    {/* Hostel Assigned (Register Warden) */}
                    {!isLogin && selectedRole === 'warden' && (
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#9ca3af' }}>Hostel Block Responsibility</label>
                        <div className="form-input-container">
                          <div className="input-icon-left" style={{ color: '#9ca3af' }}><Home size={16} /></div>
                          <input type="text" placeholder="E.g., B-Block"
                            value={hostelAssigned} onChange={(e) => setHostelAssigned(e.target.value)}
                            className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                        {errors.hostelAssigned && <p className="input-error-msg">{errors.hostelAssigned}</p>}
                      </div>
                    )}

                    {/* Password */}
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <label className="form-label" htmlFor="login-password" style={{ color: '#9ca3af', margin: 0 }}>Secret Password</label>
                        {isLogin && (
                          <button type="button" onClick={() => setShowForgotPassword(true)} className="btn-link" style={{ color: '#818cf8', fontSize: '0.75rem', padding: 0 }}>
                            Forgot Code?
                          </button>
                        )}
                      </div>
                      <div className="form-input-container">
                        <div className="input-icon-left" style={{ color: '#9ca3af' }}><Lock size={16} /></div>
                        <input id="login-password" type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••" value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-input saas-input-dark" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right" style={{ color: '#9ca3af' }}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="input-error-msg">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                      {loading ? <span className="spinner"></span> : (
                        <>
                          <span>{isLogin ? `Authorize Session` : 'Register Account'}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {/* Footer Toggle */}
                    {isLogin ? (
                      <div style={{ textAlign: 'center', fontSize: '0.8125rem', marginTop: '1rem', color: '#9ca3af' }}>
                        New student?{' '}
                        <button type="button" onClick={() => { setIsLogin(false); setMessage(null); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                          Create profile
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', fontSize: '0.8125rem', marginTop: '1rem', color: '#9ca3af' }}>
                        Already have access?{' '}
                        <button type="button" onClick={() => { setIsLogin(true); setMessage(null); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                          Authenticate here
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Password Recovery Modal */}
              {showForgotPassword && (
                <div className="saas-cmd-backdrop" style={{ background: 'rgba(9, 13, 22, 0.85)', alignItems: 'center', paddingTop: 0 }}>
                  <div className="saas-auth-card" style={{ maxWidth: '400px', animation: 'scaleUp 0.2s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <ShieldAlert size={18} style={{ color: '#fbbf24' }} /> Reset Password
                      </h3>
                      <button onClick={() => { setShowForgotPassword(false); setForgotPasswordStep(1); }} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {forgotPasswordStep === 1 && (
                        <>
                          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0 }}>Enter your registered email address and role to request a password reset verification code.</p>
                          <div className="form-group">
                            <label className="form-label" style={{ color: '#9ca3af' }}>Role type</label>
                            <select value={resetRole} onChange={e => setResetRole(e.target.value)} className="form-input saas-input-dark" style={{ width: '100%' }}>
                              <option value="student">🎓 Student</option>
                              <option value="parent">👨‍👩‍👧 Parent</option>
                              <option value="warden">🏠 Warden</option>
                              <option value="admin">🛡️ Admin</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ color: '#9ca3af' }}>Email Address</label>
                            <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="form-input saas-input-dark" placeholder="Enter your email" />
                          </div>
                          <button onClick={handleForgotPassword} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                            {loading ? <span className="spinner"></span> : 'Send Verification OTP'}
                          </button>
                        </>
                      )}

                      {forgotPasswordStep === 2 && (
                        <>
                          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0 }}>A 6-digit OTP code has been dispatched to your email: <strong>{resetEmail}</strong></p>
                          <div className="form-group">
                            <label className="form-label" style={{ color: '#9ca3af' }}>6-Digit OTP</label>
                            <input type="text" value={resetOtp} onChange={e => setResetOtp(e.target.value)} className="form-input saas-input-dark" placeholder="••••••" style={{ letterSpacing: '6px', textAlign: 'center', fontSize: '1.2rem' }} />
                          </div>
                          <button onClick={handleVerifyResetOTP} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                            {loading ? <span className="spinner"></span> : 'Verify Code'}
                          </button>
                        </>
                      )}

                      {forgotPasswordStep === 3 && (
                        <>
                          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0 }}>Establish a new secure access password for your profile.</p>
                          <div className="form-group">
                            <label className="form-label" style={{ color: '#9ca3af' }}>New Secret Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-input saas-input-dark" placeholder="••••••••" />
                          </div>
                          <button onClick={handleResetPassword} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                            {loading ? <span className="spinner"></span> : 'Update Password'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

          ) : (

            /* ==========================================
               2. SECURED HOSTEL LEAVE MANAGEMENT PLATFORM
               ========================================== */
            <div className="saas-shell">

              {/* Sleek Sidebar Component */}
              <aside className={`saas-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="saas-sidebar-brand">
                  <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M50 15 L20 35 L50 55 L80 35 Z" fill="rgba(99, 102, 241, 0.1)" />
                      <path d="M25 41 L25 68 C25 76, 50 85, 50 85 C50 85, 75 76, 75 68 L75 41" />
                    </svg>
                  </div>
                  {!sidebarCollapsed && <span style={{ letterSpacing: '-0.5px' }}>State Tech</span>}
                </div>

                <nav className="saas-sidebar-menu">
                  <button
                    onClick={() => { setActiveTab('dashboard'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    title="Dashboard"
                  >
                    <LayoutDashboard size={18} />
                    {!sidebarCollapsed && <span>Dashboard Home</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('apply'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'apply' ? 'active' : ''}`}
                    title="Apply Leave"
                  >
                    <PlusSquare size={18} />
                    {!sidebarCollapsed && <span>Apply for Leave</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('history'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'history' ? 'active' : ''}`}
                    title="Leave History"
                  >
                    <FileText size={18} />
                    {!sidebarCollapsed && <span>Leave History</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('qrpass'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'qrpass' ? 'active' : ''}`}
                    title="QR Gate Pass"
                  >
                    <Eye size={18} />
                    {!sidebarCollapsed && <span>QR Gate Pass</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('profile'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                    title="My Profile"
                  >
                    <User size={18} />
                    {!sidebarCollapsed && <span>My Profile</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('notifications'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
                    title="Announcements"
                  >
                    <Bell size={18} />
                    {!sidebarCollapsed && <span>Announcements</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('feedback'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'feedback' ? 'active' : ''}`}
                    title="Complaints Registry"
                  >
                    <FileText size={18} />
                    {!sidebarCollapsed && <span>Complaints Desk</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('support'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'support' ? 'active' : ''}`}
                    title="Help Support"
                  >
                    <HelpCircle size={18} />
                    {!sidebarCollapsed && <span>Support Hub</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('rules'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'rules' ? 'active' : ''}`}
                    title="Hostel Policy"
                  >
                    <BookOpen size={18} />
                    {!sidebarCollapsed && <span>Hostel Policy</span>}
                  </button>

                  <button
                    onClick={() => { setActiveTab('contact'); setMessage(null); }}
                    className={`saas-sidebar-item ${activeTab === 'contact' ? 'active' : ''}`}
                    title="Warden Directory"
                  >
                    <Phone size={18} />
                    {!sidebarCollapsed && <span>Warden Directory</span>}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="saas-sidebar-item"
                    style={{ color: '#ef4444', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                    {!sidebarCollapsed && <span>Sign Out</span>}
                  </button>
                </nav>
              </aside>

              {/* Main Secured Viewport */}
              <div className="saas-main-viewport">

                {/* Floating Navigation Header */}
                <header className="saas-navbar">
                  <div className="saas-nav-left">
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="saas-collapse-trigger" title="Toggle Navigation">
                      <Menu size={20} />
                    </button>

                    {/* Command Menu Launcher Trigger */}
                    <button onClick={() => setShowCommandMenu(true)} className="saas-search-trigger" title="Command Menu">
                      <Search size={14} />
                      <span>Search platform...</span>
                      <span style={{ marginLeft: 'auto', background: '#e2e8f0', color: '#64748b', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>⌘K</span>
                    </button>
                  </div>

                  <div className="saas-nav-right">
                    {/* Offline/Demo Badge */}
                    {isMockMode && (
                      <span className="portal-badge" style={{ position: 'static', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--color-primary-light)', fontSize: '0.7rem' }}>
                        <Info size={12} /> Live Preview
                      </span>
                    )}

                    {/* Announcement Bell Trigger */}
                    <button onClick={() => setShowNotificationsDrawer(true)} className="saas-badge-icon" title="Notifications">
                      <Bell size={20} />
                      {unreadCount > 0 && <span className="saas-badge-count">{unreadCount}</span>}
                    </button>

                    {/* User profile dropdown triggers */}
                    <div className="saas-user-dropdown" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="saas-avatar-circle">
                          {loggedInUser.student?.profileImage ? (
                            <img src={loggedInUser.student.profileImage} alt="User Avatar" />
                          ) : (
                            loggedInUser.student?.name ? loggedInUser.student.name.charAt(0) : 'S'
                          )}
                        </div>
                        <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark)' }}>{loggedInUser.student?.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{loggedInUser.student?.hostelRoom || 'Guest'}</div>
                        </div>
                      </div>

                      {showUserDropdown && (
                        <div className="saas-dropdown-menu">
                          <button className="saas-dropdown-item" onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }}>
                            <User size={14} /> My Profile Tab
                          </button>
                          <button className="saas-dropdown-item" onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }}>
                            <Settings size={14} /> Account Settings
                          </button>
                          <div className="saas-dropdown-divider"></div>
                          <button className="saas-dropdown-item" style={{ color: '#ef4444' }} onClick={handleLogout}>
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </header>

                {/* Main View Area Frame (Contains Scroll control) */}
                <div className="saas-frame-scroll">

                  {/* Messages Banner */}
                  {message && (
                    <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ marginBottom: '1.5rem', borderRadius: '0.75rem' }}>
                      <div className="toast-icon">
                        {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                      </div>
                      <div>
                        <p className="toast-title" style={{ fontWeight: 700 }}>{message.type === 'success' ? 'Task Completed' : 'Operation Alert'}</p>
                        <p className="toast-text">{message.text}</p>
                      </div>
                    </div>
                  )}

                  {/* View 1: Hostel Leave Management Dashboard */}
                  {activeTab === 'dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                      {/* Premium SaaS Header Title */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.75px', color: 'var(--color-dark)', margin: 0 }}>Student Leave Platform</h2>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>Manage your outpasses, hostel leave records, gate passes, and check-in timelines.</p>
                        </div>
                      </div>

                      {/* Stat/Metrics grid */}
                      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        <div className="stat-card" style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Leave Requests</span>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark)', marginTop: '0.25rem', margin: 0 }}>{stats.total}</h3>
                          </div>
                          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                            <FileText size={22} />
                          </div>
                        </div>

                        <div className="stat-card" style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approved Leaves</span>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem', margin: 0 }}>{stats.approved}</h3>
                          </div>
                          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                            <CheckCircle size={22} />
                          </div>
                        </div>

                        <div className="stat-card" style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Permissions</span>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning-text)', marginTop: '0.25rem', margin: 0 }}>{stats.pending}</h3>
                          </div>
                          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning-text)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                            <Clock size={22} />
                          </div>
                        </div>
                      </div>

                      {/* Main Dashboard Two Columns */}
                      <div className="dashboard-grid-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>

                        {/* Left Column: Quick Actions & Leave Timeline */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                          {/* Quick shortcuts grid */}
                          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <div onClick={() => setActiveTab('apply')} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} className="saas-card-btn">
                              <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                <PlusSquare size={20} />
                              </div>
                              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark)' }}>Apply Leave</span>
                            </div>

                            <div onClick={() => setActiveTab('qrpass')} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} className="saas-card-btn">
                              <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-secondary)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                <Eye size={20} />
                              </div>
                              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark)' }}>QR Ticket</span>
                            </div>

                            <div onClick={() => setActiveTab('support')} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} className="saas-card-btn">
                              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                <HelpCircle size={20} />
                              </div>
                              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark)' }}>Helpline Desk</span>
                            </div>
                          </section>

                          {/* Leave Applications History */}
                          <section style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={18} style={{ color: 'var(--color-primary)' }} /> Leave Applications History
                              </h4>
                              <button onClick={() => setActiveTab('history')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>View History</button>
                            </div>

                            {leavesList.length === 0 ? (
                              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                                <FileText size={40} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                                <p className="empty-state-title" style={{ fontSize: '0.875rem', fontWeight: 700 }}>No Active Outpasses</p>
                                <p className="empty-state-text" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>You do not have any active outpass leave requests registered in this cycle.</p>
                              </div>
                            ) : (
                              <div className="saas-timeline">
                                {leavesList.slice(0, 3).map((leave, idx) => (
                                  <div key={leave.id || idx} className="saas-timeline-item">
                                    <div className={`saas-timeline-marker ${leave.status === 'Approved' ? 'approved' : leave.status === 'Pending' ? 'pending' : 'rejected'}`}></div>
                                    <div className="saas-timeline-card">
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        <strong style={{ fontSize: '0.8125rem', color: 'var(--color-dark)' }}>Leave Destination</strong>
                                        <span className={`status-badge ${leave.status === 'Approved' ? 'status-approved' : leave.status === 'Pending' ? 'status-pending' : 'status-rejected'}`} style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px' }}>
                                          {leave.status}
                                        </span>
                                      </div>
                                      <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: '0.25rem 0' }}>{leave.reason}</p>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--color-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem' }}>
                                        <MapPin size={11} style={{ color: 'var(--color-primary)' }} />
                                        <span>Start Date: {new Date(leave.startDate).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>Return: {new Date(leave.endDate).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </section>
                        </div>

                        {/* Right Column: Chart details & Smart Insights */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                          {/* Analytics Chart Box */}
                          <section style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Activity size={18} style={{ color: 'var(--color-secondary)' }} /> Outpass Statistics
                            </h4>

                            <div className="chart-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div className="chart-bar-item">
                                <div className="chart-bar-info" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
                                  <span>Approval outpass Ratio</span>
                                  <span>{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>
                                </div>
                                <div className="chart-bar-track" style={{ background: '#f1f5f9', height: '6px', borderRadius: '9999px', overflow: 'hidden' }}>
                                  <div
                                    className="chart-bar-fill fill-approved"
                                    style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%`, background: 'var(--color-primary)', height: '100%' }}
                                  ></div>
                                </div>
                              </div>

                              <div className="chart-bar-item">
                                <div className="chart-bar-info" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
                                  <span>Pending Review Ratio</span>
                                  <span>{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                                </div>
                                <div className="chart-bar-track" style={{ background: '#f1f5f9', height: '6px', borderRadius: '9999px', overflow: 'hidden' }}>
                                  <div
                                    className="chart-bar-fill fill-pending"
                                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%`, background: 'var(--color-secondary)', height: '100%' }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </section>

                          {/* Smart Insights Card */}
                          <section style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px dashed var(--color-success-border)', borderRadius: '1rem', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Info size={16} style={{ color: 'var(--color-primary)' }} /> Smart Insights Card
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', lineHeight: '1.45', margin: 0 }}>
                              Hostel security systems enforce curfew limits strictly starting at <strong>8:30 PM</strong>. Ensure you have checked out physically at the main entrance gate check-in scanners to ensure outpass statuses are logged properly and prevent check-in penalties.
                            </p>
                          </section>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View 2: Apply Leave Tab */}
                  {activeTab === 'apply' && <ApplyLeave />}

                  {/* View 3: Leave History Tab */}
                  {activeTab === 'history' && <LeaveHistory />}

                  {/* View 4: QR Gate Pass Tab */}
                  {activeTab === 'qrpass' && <QRGatePass />}

                  {/* View 5: Student Profile Tab */}
                  {activeTab === 'profile' && (
                    <StudentProfile
                      onProfileUpdate={(updatedStudent) => {
                        setLoggedInUser(prev => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            student: { ...prev.student, ...updatedStudent }
                          };
                        });
                      }}
                    />
                  )}

                  {/* View 6: Student Announcements Tab */}
                  {activeTab === 'notifications' && (
                    <StudentNotifications
                      notifications={notifications}
                      loading={notificationsLoading}
                      loadNotifications={loadNotifications}
                      handleMarkAsRead={handleMarkNotificationRead}
                      handleDelete={handleDeleteNotification}
                    />
                  )}

                  {/* View 7: Student Feedback Tab */}
                  {activeTab === 'feedback' && <StudentFeedback />}

                  {/* View 8: Student Support Tab */}
                  {activeTab === 'support' && <StudentSupport />}

                  {/* View 9: Hostel Rules Tab */}
                  {activeTab === 'rules' && (
                    <section className="animate-fade-in" style={{ maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
                      {/* Premium Header */}
                      <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)', borderRadius: '1.25rem', padding: '1.5rem 2rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', marginBottom: '2.5rem' }}>
                        <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                          <div className="icon-pulse" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                            <BookOpen size={28} color="#fff" />
                          </div>
                          <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Official Policies & Guidelines</h2>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0', maxWidth: '500px', lineHeight: 1.4 }}>Comprehensive rules governing hostel residency and the digital outpass system.</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                        {/* Section 2: Portal Usage Rules */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                              <ShieldAlert size={24} style={{ color: 'var(--color-secondary)' }} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.3px' }}>Portal Usage Guidelines</h3>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {portalRules.slice(0, Math.ceil(portalRules.length / 2)).map((rule, idx) => {
                                const originalIdx = idx;
                                const isOpen = openPortalRuleIndex === originalIdx;
                                return (
                                <div key={rule.id || originalIdx} onClick={() => setOpenPortalRuleIndex(isOpen ? null : originalIdx)} className="rule-card hover-reveal" style={{ padding: '1.25rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', borderTop: '4px solid var(--color-secondary)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.3px' }}>{rule.title}</h4>
                                    <div className="reveal-icon" style={{ color: 'var(--color-muted)', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                      <PlusSquare size={16} />
                                    </div>
                                  </div>
                                  <div className="rule-desc" style={{ maxHeight: isOpen ? '500px' : undefined, opacity: isOpen ? 1 : undefined }}>
                                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>{rule.desc}</p>
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {portalRules.slice(Math.ceil(portalRules.length / 2)).map((rule, idx) => {
                                const originalIdx = idx + Math.ceil(portalRules.length / 2);
                                const isOpen = openPortalRuleIndex === originalIdx;
                                return (
                                <div key={rule.id || originalIdx} onClick={() => setOpenPortalRuleIndex(isOpen ? null : originalIdx)} className="rule-card hover-reveal" style={{ padding: '1.25rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', borderTop: '4px solid var(--color-secondary)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.3px' }}>{rule.title}</h4>
                                    <div className="reveal-icon" style={{ color: 'var(--color-muted)', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                      <PlusSquare size={16} />
                                    </div>
                                  </div>
                                  <div className="rule-desc" style={{ maxHeight: isOpen ? '500px' : undefined, opacity: isOpen ? 1 : undefined }}>
                                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>{rule.desc}</p>
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Section 1: Hostel Rules */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                              <Home size={24} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.3px' }}>Hostel Residency Rules</h3>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {hostelRules.slice(0, Math.ceil(hostelRules.length / 2)).map((rule, idx) => {
                                const originalIdx = idx;
                                const isOpen = openHostelRuleIndex === originalIdx;
                                return (
                                <div key={rule.id || originalIdx} onClick={() => setOpenHostelRuleIndex(isOpen ? null : originalIdx)} className="rule-card hover-reveal" style={{ padding: '1.25rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', borderTop: '4px solid var(--color-primary)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.3px' }}>{rule.title}</h4>
                                    <div className="reveal-icon" style={{ color: 'var(--color-muted)', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                      <PlusSquare size={16} />
                                    </div>
                                  </div>
                                  <div className="rule-desc" style={{ maxHeight: isOpen ? '500px' : undefined, opacity: isOpen ? 1 : undefined }}>
                                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>{rule.desc}</p>
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {hostelRules.slice(Math.ceil(hostelRules.length / 2)).map((rule, idx) => {
                                const originalIdx = idx + Math.ceil(hostelRules.length / 2);
                                const isOpen = openHostelRuleIndex === originalIdx;
                                return (
                                <div key={rule.id || originalIdx} onClick={() => setOpenHostelRuleIndex(isOpen ? null : originalIdx)} className="rule-card hover-reveal" style={{ padding: '1.25rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', borderTop: '4px solid var(--color-primary)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.3px' }}>{rule.title}</h4>
                                    <div className="reveal-icon" style={{ color: 'var(--color-muted)', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                      <PlusSquare size={16} />
                                    </div>
                                  </div>
                                  <div className="rule-desc" style={{ maxHeight: isOpen ? '500px' : undefined, opacity: isOpen ? 1 : undefined }}>
                                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>{rule.desc}</p>
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                      </div>

                      <style>{`
                        .rule-desc {
                          max-height: 0;
                          opacity: 0;
                          overflow: hidden;
                          transition: all 0.3s ease-in-out;
                        }
                        .hover-reveal {
                          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s;
                        }
                        .hover-reveal:hover {
                          transform: translateY(-2px);
                          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) !important;
                          border-color: #cbd5e1 !important;
                        }
                        .hover-reveal:hover .rule-desc {
                          max-height: 150px;
                          opacity: 1;
                        }
                        .hover-reveal:hover .reveal-icon {
                          transform: rotate(45deg);
                          color: var(--color-primary);
                        }
                      `}</style>
                    </section>
                  )}

                  {/* View 10: Warden Help Tab */}
                  {activeTab === 'contact' && (
                    <section style={{ maxWidth: '64rem', margin: '0 auto', width: '100%', animation: 'fadeIn 0.4s ease-out' }}>
                      <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', borderRadius: '1.25rem', padding: '2.5rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.3)', marginBottom: '2.5rem' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1.25rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                            <Phone size={36} color="#fff" />
                          </div>
                          <div>
                            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Warden Directory & Support</h2>
                            <p style={{ fontSize: '1rem', opacity: 0.9, margin: '0.4rem 0 0 0', maxWidth: '400px', lineHeight: 1.4 }}>24/7 Emergency check-in desk and hostel block authorities. Reach out for any assistance.</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
                        {wardenDirectory.map((warden, idx) => {
                          const baseColor = warden.color === 'warning' ? '#d97706' : warden.color === 'secondary' ? 'var(--color-secondary)' : 'var(--color-primary)';
                          const bgColor = warden.color === 'warning' ? 'rgba(245, 158, 11, 0.1)' : warden.color === 'secondary' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)';
                          
                          return (
                            <div key={warden.id || idx} className="warden-card" style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: baseColor }}></div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                  <span style={{ display: 'inline-block', padding: '0.35rem 0.85rem', background: bgColor, color: baseColor, borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>{warden.role}</span>
                                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)', margin: 0 }}>{warden.name}</h3>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: '0.35rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <MapPin size={14} /> {warden.location}
                                  </p>
                                </div>
                                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: baseColor, fontSize: '1.25rem', fontWeight: 800, border: '2px solid #e2e8f0' }}>{warden.initials}</div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                                <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', borderRadius: '0.5rem', background: '#f8fafc', transition: 'background 0.2s', border: '1px solid transparent' }}>
                                  <Phone size={18} style={{ color: baseColor }} />
                                  <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Extension</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 700 }}>{warden.phone}</div>
                                  </div>
                                </div>
                                <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', borderRadius: '0.5rem', background: '#f8fafc', transition: 'background 0.2s', border: '1px solid transparent' }}>
                                  <Mail size={18} style={{ color: baseColor }} />
                                  <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 700 }}>{warden.email}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      </div>

                      <style>{`
                        .warden-card:hover {
                          transform: translateY(-5px);
                          box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1), 0 10px 15px -6px rgba(0,0,0,0.1) !important;
                          border-color: rgba(99, 102, 241, 0.2) !important;
                        }
                        .warden-card:hover .contact-row {
                          background: #fff !important;
                          border-color: #e2e8f0 !important;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                        }
                      `}</style>
                    </section>
                  )}

                </div>

                {/* Footer details */}
                <footer style={{ padding: '1rem 2rem', background: '#fff', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  <span>© {new Date().getFullYear()} State Tech Leaves. All Rights Reserved.</span>
                  <span>Session: {loggedInUser.student?.name} ({loggedInUser.student?.email})</span>
                </footer>
              </div>

              {/* Interactive SaaS Command Menu Backdrop / Container */}
              {showCommandMenu && (
                <div className="saas-cmd-backdrop" onClick={() => setShowCommandMenu(false)}>
                  <div className="saas-cmd-box" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Type a page name or shortcut (e.g. outpass, profile)..."
                      className="saas-cmd-search-input"
                      value={cmdSearchQuery}
                      onChange={(e) => setCmdSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <div className="saas-cmd-list">
                      {[
                        { label: '📊 Dashboard Home', desc: 'View statistics and activity log', action: 'dashboard' },
                        { label: '📝 Apply for Leave Outpass', desc: 'Submit a new outpass application', action: 'apply' },
                        { label: '📁 Leave History & Records', desc: 'Browse all submitted outpass logs', action: 'history' },
                        { label: '🎫 Access Digital Gate Pass', desc: 'Generate or review active outpass gate pass', action: 'qrpass' },
                        { label: '👤 My Profile', desc: 'Update academic credentials or avatar', action: 'profile' },
                        { label: '📢 Announcements Board', desc: 'Check Warden alerts and messages', action: 'notifications' },
                        { label: '🛠️ Help Desk Support', desc: 'Raise trouble tickets or contact IT staff', action: 'support' },
                      ]
                        .filter(item => item.label.toLowerCase().includes(cmdSearchQuery.toLowerCase()) || item.desc.toLowerCase().includes(cmdSearchQuery.toLowerCase()))
                        .map((item, index) => (
                          <button
                            key={index}
                            className="saas-cmd-item"
                            onClick={() => {
                              setActiveTab(item.action);
                              setShowCommandMenu(false);
                              setCmdSearchQuery('');
                            }}
                          >
                            <span className="saas-cmd-label">{item.label}</span>
                            <span className="saas-cmd-desc">{item.desc}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Slide-out Announcements Center Drawer */}
              {showNotificationsDrawer && (
                <>
                  <div className="saas-cmd-backdrop" style={{ background: 'rgba(9,13,22,0.2)', paddingTop: 0, alignItems: 'stretch', justifyContent: 'flex-end' }} onClick={() => setShowNotificationsDrawer(false)}>
                    <div className="saas-notif-drawer" onClick={(e) => e.stopPropagation()}>
                      <div className="saas-notif-header">
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Bell size={18} style={{ color: 'var(--color-primary)' }} /> Live Announcements
                        </h3>
                        <button onClick={() => setShowNotificationsDrawer(false)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                      </div>
                      <div className="saas-notif-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingBottom: '1rem' }}>
                        {notificationsLoading ? (
                          <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-muted)' }}>Loading bulletins...</div>
                        ) : notifications.length === 0 ? (
                          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <BellOff size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                            <strong style={{ fontSize: '0.8125rem', color: 'var(--color-dark)' }}>All Caught Up!</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>No active announcements.</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                            {notifications.map((n) => (
                              <div key={n.id} className={`saas-notif-toast ${n.status === 'Unread' ? 'unread' : ''}`} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: n.status === 'Unread' ? 'var(--color-primary-light)' : '#f8fafc', border: n.status === 'Unread' ? '1px solid var(--color-success-border)' : '1px solid var(--color-border)', position: 'relative' }}>
                                <div style={{ background: n.status === 'Unread' ? 'rgba(99,102,241,0.1)' : 'rgba(100,116,139,0.1)', color: n.status === 'Unread' ? 'var(--color-primary)' : 'var(--color-muted)', padding: '0.4rem', borderRadius: '0.375rem', height: 'fit-content', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Bell size={14} />
                                </div>
                                <div style={{ flex: 1, paddingRight: '1.25rem' }}>
                                  <strong style={{ fontSize: '0.78rem', color: 'var(--color-dark)', display: 'block' }}>{n.title}</strong>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', margin: '0.15rem 0 0 0', lineHeight: '1.3' }}>{n.message}</p>
                                  <span style={{ fontSize: '0.6rem', color: 'var(--color-muted)', display: 'block', marginTop: '0.35rem' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                                  {n.status === 'Unread' && (
                                    <button onClick={() => handleMarkNotificationRead(n.id)} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center' }} title="Mark Read">
                                      <CheckCircle size={13} />
                                    </button>
                                  )}
                                  <button onClick={() => handleDeleteNotification(n.id)} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '1rem', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Alert">
                                    &times;
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button onClick={() => { setActiveTab('notifications'); setShowNotificationsDrawer(false); }} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '0.6rem', borderRadius: '0.5rem', fontSize: '0.78rem' }}>
                          Open Announcements Board
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      } />
      <Route path="/parent/login" element={<ParentLogin />} />
      <Route path="/parent/pending" element={<ParentApprovalDashboard />} />
      <Route path="/warden/login" element={<WardenLogin />} />
      <Route path="/warden/dashboard" element={<WardenDashboard />} />
      <Route path="/qr-scanner" element={<QRScanner />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Advanced Screens Routing */}
      <Route path="/student/advanced-change-password" element={<AdvancedChangePassword />} />
      <Route path="/student/advanced-edit-profile" element={<AdvancedEditProfile />} />
      <Route path="/admin/active-leaves" element={<ActiveLeavesManagement />} />
      <Route path="/admin/approved-leaves-analytics" element={<ApprovedLeavesAnalytics />} />
      <Route path="/admin/rejected-leaves" element={<RejectedLeavesManagement />} />
      <Route path="/admin/activity-logs" element={<UserActivityLogCenter />} />
      <Route path="/admin/qr-pass-history" element={<QRPassHistory />} />
      <Route path="/admin/hostel-management" element={<HostelManagement />} />
      <Route path="/admin/room-management" element={<RoomManagement />} />
      <Route path="/notifications-center" element={<SmartNotificationCenter />} />

      {/* Advanced Admin & Super Admin Screens (41-48) */}
      <Route path="/admin/security" element={<SecurityAccessControl />} />
      <Route path="/admin/attendance" element={<StudentAttendance />} />
      <Route path="/admin/emergency-contacts" element={<EmergencyContactManagement />} />
      <Route path="/admin/visitors" element={<VisitorManagement />} />
      <Route path="/admin/room-allocation" element={<RoomAllocation />} />
      <Route path="/admin/leave-analytics" element={<LeaveAnalyticsInsights />} />
      <Route path="/admin/audit-logs" element={<SystemAuditLogs />} />
      <Route path="/admin/announcements" element={<HostelAnnouncements />} />
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
    </Routes>
  );
}

export default App;
