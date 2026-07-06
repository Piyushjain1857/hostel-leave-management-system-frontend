import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  FileText,
  Bell,
  Settings,
  ClipboardList,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Info,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

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

function AdminDashboard() {
  const [activePanel, setActivePanel] = useState(() => localStorage.getItem('adminActivePanel') || 'home'); // home, students, wardens, leaves, parents, analytics, notifications, settings, gatelogs
  const [adminUser] = useState(() => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const mainContentRef = useRef(null);

  // Data States
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalParents: 0,
    totalWardens: 0,
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0
  });
  const [students, setStudents] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [parents, setParents] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [gatelogs, setGatelogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [settings, setSettings] = useState({
    universityName: 'State Institute of Technology',
    hostelName: 'Block-B Academic Hostel',
    contactEmail: 'admin.hostel@college.edu',
    contactPhone: '+91 9876543210'
  });

  const [portalRules, setPortalRules] = useState([]);
  const [hostelRules, setHostelRules] = useState([]);
  const [wardenDirectory, setWardenDirectory] = useState([]);

  // Modal & Form States
  const [showModal, setShowModal] = useState(null); // 'student', 'warden', 'parent', 'leaveDetails', 'logDetails'
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Specific Form States
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', course: '', year: '', hostelRoom: '', password: '' });
  const [wardenForm, setWardenForm] = useState({ name: '', email: '', phone: '', hostelAssigned: '', shift: '', password: '' });
  const [parentForm, setParentForm] = useState({ name: '', email: '', phone: '', studentId: '', password: '' });
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', role: 'student' });

  // Query & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;

  // ==========================================
  // LOCALSTORAGE MOCK PERSISTENCE LAYER
  // ==========================================
  function loadMockPersistence() {
    // 1. Get/Seed Students
    let mockStuds = JSON.parse(localStorage.getItem('mockStudents') || '[]');
    if (mockStuds.length === 0) {
      mockStuds = [
        { id: 1, name: 'Piyush jain', email: 'student@college.edu', phone: '9876543210', course: 'B.Tech CS', year: '3rd Year', hostelRoom: 'B-Block 402' },
        { id: 2, name: 'Rahul Sharma', email: 'rahul.s@college.edu', phone: '9876543219', course: 'B.Tech EE', year: '2nd Year', hostelRoom: 'A-Block 104' },
        { id: 3, name: 'Anshu jaini', email: 'anshu.k@college.edu', phone: '9876543218', course: 'B.Tech ECE', year: '4th Year', hostelRoom: 'C-Block 205' }
      ];
      localStorage.setItem('mockStudents', JSON.stringify(mockStuds));
    }
    setStudents(mockStuds);

    // 2. Get/Seed Wardens
    let mockWards = JSON.parse(localStorage.getItem('mockWardens') || '[]');
    if (mockWards.length === 0) {
      mockWards = [
        { id: 1, name: 'Warden Test', email: 'warden@college.edu', phone: '9876543212', hostelAssigned: 'B-Block', shift: 'Day Shift' },
        { id: 2, name: 'Suresh Chandra', email: 'suresh@college.edu', phone: '9876543215', hostelAssigned: 'A-Block', shift: 'Night Shift' }
      ];
      localStorage.setItem('mockWardens', JSON.stringify(mockWards));
    }
    setWardens(mockWards);

    // 3. Get/Seed Parents
    let mockPars = JSON.parse(localStorage.getItem('mockParents') || '[]');
    if (mockPars.length === 0) {
      mockPars = [
        { id: 1, name: 'Parent Test', email: 'parent@college.edu', phone: '9876543211', studentId: 1, studentName: 'Piyush jain' },
        { id: 2, name: 'Mr. Sharma', email: 'sharma.parent@college.edu', phone: '9876543214', studentId: 2, studentName: 'Rahul Sharma' }
      ];
      localStorage.setItem('mockParents', JSON.stringify(mockPars));
    }
    setParents(mockPars);

    // 4. Get/Seed Leaves
    let mockLvs = JSON.parse(localStorage.getItem('mockLeaves') || '[]');
    if (mockLvs.length === 0) {
      mockLvs = [
        { id: 101, studentId: 1, studentName: 'Piyush jain', reason: 'Emergency family wedding.', fromDate: '2026-05-10', toDate: '2026-05-14', destination: 'Delhi', parentStatus: 'Approved', wardenStatus: 'Approved', finalStatus: 'Approved', status: 'Approved', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 102, studentId: 1, studentName: 'Piyush jain', reason: 'Weekendouting to guard house.', fromDate: '2026-05-20', toDate: '2026-05-22', destination: 'Gurugram', parentStatus: 'Approved', wardenStatus: 'Approved', finalStatus: 'Approved', status: 'Approved', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 103, studentId: 1, studentName: 'Piyush jain', reason: 'Special dental appointment.', fromDate: '2026-05-28', toDate: '2026-05-28', destination: 'Hospital', parentStatus: 'Pending', wardenStatus: 'Pending', finalStatus: 'Pending', status: 'Pending', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('mockLeaves', JSON.stringify(mockLvs));
    }
    setLeaves(mockLvs);

    // 5. Get/Seed Gate Logs
    let mockLogs = JSON.parse(localStorage.getItem('mockGateLogs') || '[]');
    if (mockLogs.length === 0) {
      mockLogs = [
        { id: 1, studentId: 1, studentName: 'Piyush jain', leaveId: 101, destination: 'Delhi', exitTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), entryTime: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Returned' }
      ];
      localStorage.setItem('mockGateLogs', JSON.stringify(mockLogs));
    }
    setGatelogs(mockLogs);

    // 6. Get/Seed Notifications
    let mockNotifs = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
    if (mockNotifs.length === 0) {
      mockNotifs = [
        { id: 1, title: 'Curfew Reminder', message: 'Students must be in blocks by 8:30 PM today.', role: 'student', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('mockNotifications', JSON.stringify(mockNotifs));
    }
    setNotifications(mockNotifs);

    // 7. Get Settings
    const mockSets = JSON.parse(localStorage.getItem('mockSettings') || JSON.stringify(settings));
    setSettings(mockSets);

    // Calculate mock stats
    const totalStudents = mockStuds.length;
    const totalParents = mockPars.length;
    const totalWardens = mockWards.length;
    const totalLeaves = mockLvs.length;
    const approvedLeaves = mockLvs.filter(x => x.status === 'Approved').length;
    const pendingLeaves = mockLvs.filter(x => x.status === 'Pending').length;
    setStats({ totalStudents, totalParents, totalWardens, totalLeaves, approvedLeaves, pendingLeaves });

    // Mock recent activities list
    const mockActs = [
      { id: 1, type: 'leave', studentName: 'Piyush jain', message: 'Applied outpass for "Delhi"', status: 'Pending', timestamp: new Date().toISOString() },
      { id: 2, type: 'gate', studentName: 'Piyush jain', message: 'Checked out at main gate', status: 'Checked-Out', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ];
    setRecentActivities(mockActs);
    setLoading(false);
  }

  // Combined fetch function for both live backend and LocalStorage mock fallback
  const fetchAllData = async (token) => {
    try {
      setLoading(true);

      // Fetch Dashboard Counts
      const statsRes = await fetch(`${backendUrl}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Fetch Recent Activities Feed
      const actRes = await fetch(`${backendUrl}/admin/recent-activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (actRes.ok) {
        const actData = await actRes.json();
        setRecentActivities(actData);
      }

      // Panel-specific fetches
      if (activePanel === 'students') {
        const res = await fetch(`${backendUrl}/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setStudents(await res.json());
      } else if (activePanel === 'wardens') {
        const res = await fetch(`${backendUrl}/wardens`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setWardens(await res.json());
      } else if (activePanel === 'parents') {
        const res = await fetch(`${backendUrl}/parents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setParents(await res.json());
      } else if (activePanel === 'leaves' || activePanel === 'analytics') {
        const res = await fetch(`${backendUrl}/leaves`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setLeaves(await res.json());
      } else if (activePanel === 'notifications') {
        const res = await fetch(`${backendUrl}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setNotifications(await res.json());
      } else if (activePanel === 'settings') {
        const res = await fetch(`${backendUrl}/settings`);
        if (res.ok) setSettings(await res.json());
      } else if (activePanel === 'gatelogs') {
        const res = await fetch(`${backendUrl}/gatelogs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setGatelogs(await res.json());
      }

      setLoading(false);
    } catch {
      console.warn("Backend endpoints offline. Transitioning dashboard data states to browser mock persistence:");
      loadMockPersistence();
    }
  };

  // Fetch purely global configs from API
  const loadPoliciesAndDirectory = async () => {
    try {
      const pRes = await fetch(`${backendUrl}/public/policies?type=portal`);
      const hRes = await fetch(`${backendUrl}/public/policies?type=hostel`);
      const wRes = await fetch(`${backendUrl}/public/warden-directory`);
      
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.policies && pData.policies.length > 0) setPortalRules(pData.policies);
        else setPortalRules(defaultPortalRules);
      }
      
      if (hRes.ok) {
        const hData = await hRes.json();
        if (hData.policies && hData.policies.length > 0) setHostelRules(hData.policies);
        else setHostelRules(defaultHostelRules);
      }
      
      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData.directory && wData.directory.length > 0) setWardenDirectory(wData.directory);
        else setWardenDirectory(defaultWardenDirectory);
      }
    } catch (err) {
      console.error('Error fetching global content:', err);
    }
  };

  // Load Admin authentication & bootstrap data
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token || !adminUser) {
      navigate('/admin/login');
      return;
    }
    setTimeout(() => {
      fetchAllData(token);
      loadPoliciesAndDirectory();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePanel]);

  useEffect(() => {
    localStorage.setItem('adminActivePanel', activePanel);
  }, [activePanel]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => { setMessage(null); }, 4000);
  };

  // ==========================================
  // STUDENT CRUD OPERATIONS
  // ==========================================
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (!studentForm.name || !studentForm.email || !studentForm.hostelRoom) {
      showToast('error', 'Name, Email, and Hostel Room are mandatory fields.');
      return;
    }

    try {
      let response;
      if (modalMode === 'add') {
        if (!studentForm.password) {
          showToast('error', 'Password is required to register new student.');
          return;
        }
        response = await fetch(`${backendUrl}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(studentForm)
        });
      } else {
        response = await fetch(`${backendUrl}/students/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(studentForm)
        });
      }

      if (response.ok) {
        showToast('success', modalMode === 'add' ? 'Student registered successfully!' : 'Student profile updated.');
        setShowModal(null);
        fetchAllData(token);
      } else {
        const errData = await response.json();
        showToast('error', errData.message || 'Operation failed.');
      }
    } catch {
      console.warn("Performing offline mock student action...");
      let mockStuds = [...students];
      if (modalMode === 'add') {
        const id = mockStuds.length + 1;
        mockStuds.push({ ...studentForm, id });
      } else {
        const idx = mockStuds.findIndex(x => x.id === selectedItem.id);
        if (idx !== -1) mockStuds[idx] = { ...studentForm, id: selectedItem.id };
      }
      localStorage.setItem('mockStudents', JSON.stringify(mockStuds));
      setStudents(mockStuds);
      showToast('success', '[MOCK MODE] Student database synced successfully.');
      setShowModal(null);

      // Update totals
      setStats(prev => ({ ...prev, totalStudents: mockStuds.length }));
    }
  };

  const deleteStudentItem = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to delete this student record?")) return;
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${backendUrl}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('success', 'Student record deleted successfully.');
        fetchAllData(token);
      }
    } catch {
      let mockStuds = students.filter(x => x.id !== id);
      localStorage.setItem('mockStudents', JSON.stringify(mockStuds));
      setStudents(mockStuds);
      showToast('success', '[MOCK MODE] Student removed from list.');
      setStats(prev => ({ ...prev, totalStudents: mockStuds.length }));
    }
  };

  // ==========================================
  // WARDEN CRUD OPERATIONS
  // ==========================================
  const handleWardenSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (!wardenForm.name || !wardenForm.email || !wardenForm.hostelAssigned) {
      showToast('error', 'Name, Email, and Assigned Hostel are mandatory.');
      return;
    }

    try {
      let response;
      if (modalMode === 'add') {
        if (!wardenForm.password) {
          showToast('error', 'Warden password is required.');
          return;
        }
        response = await fetch(`${backendUrl}/wardens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(wardenForm)
        });
      } else {
        response = await fetch(`${backendUrl}/wardens/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(wardenForm)
        });
      }

      if (response.ok) {
        showToast('success', modalMode === 'add' ? 'Warden added successfully.' : 'Warden record modified.');
        setShowModal(null);
        fetchAllData(token);
      } else {
        const errData = await response.json();
        showToast('error', errData.message || 'Operation failed.');
      }
    } catch {
      let mockWards = [...wardens];
      if (modalMode === 'add') {
        const id = mockWards.length + 1;
        mockWards.push({ ...wardenForm, id });
      } else {
        const idx = mockWards.findIndex(x => x.id === selectedItem.id);
        if (idx !== -1) mockWards[idx] = { ...wardenForm, id: selectedItem.id };
      }
      localStorage.setItem('mockWardens', JSON.stringify(mockWards));
      setWardens(mockWards);
      showToast('success', '[MOCK MODE] Warden roster synced.');
      setShowModal(null);
      setStats(prev => ({ ...prev, totalWardens: mockWards.length }));
    }
  };

  const deleteWardenItem = async (id) => {
    if (!window.confirm("Delete this warden account?")) return;
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${backendUrl}/wardens/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('success', 'Warden record deleted.');
        fetchAllData(token);
      }
    } catch {
      let mockWards = wardens.filter(x => x.id !== id);
      localStorage.setItem('mockWardens', JSON.stringify(mockWards));
      setWardens(mockWards);
      showToast('success', '[MOCK MODE] Warden removed.');
      setStats(prev => ({ ...prev, totalWardens: mockWards.length }));
    }
  };

  // ==========================================
  // PARENT CRUD OPERATIONS
  // ==========================================
  const handleParentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (!parentForm.name || !parentForm.email) {
      showToast('error', 'Name and Email are required.');
      return;
    }

    try {
      let response;
      if (modalMode === 'add') {
        if (!parentForm.password) {
          showToast('error', 'Parent login password is required.');
          return;
        }
        response = await fetch(`${backendUrl}/parents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(parentForm)
        });
      } else {
        response = await fetch(`${backendUrl}/parents/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(parentForm)
        });
      }

      if (response.ok) {
        showToast('success', modalMode === 'add' ? 'Parent account created.' : 'Parent details modified.');
        setShowModal(null);
        fetchAllData(token);
      }
    } catch {
      let mockPars = [...parents];
      const stud = students.find(s => s.id === Number(parentForm.studentId));
      const sName = stud ? stud.name : 'Unlinked';

      if (modalMode === 'add') {
        const id = mockPars.length + 1;
        mockPars.push({ ...parentForm, id, studentName: sName });
      } else {
        const idx = mockPars.findIndex(x => x.id === selectedItem.id);
        if (idx !== -1) mockPars[idx] = { ...parentForm, id: selectedItem.id, studentName: sName };
      }
      localStorage.setItem('mockParents', JSON.stringify(mockPars));
      setParents(mockPars);
      showToast('success', '[MOCK MODE] Parent records synced.');
      setShowModal(null);
      setStats(prev => ({ ...prev, totalParents: mockPars.length }));
    }
  };

  const deleteParentItem = async (id) => {
    if (!window.confirm("Remove this parent link?")) return;
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${backendUrl}/parents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('success', 'Parent link removed.');
        fetchAllData(token);
      }
    } catch {
      let mockPars = parents.filter(x => x.id !== id);
      localStorage.setItem('mockParents', JSON.stringify(mockPars));
      setParents(mockPars);
      showToast('success', '[MOCK MODE] Parent removed.');
      setStats(prev => ({ ...prev, totalParents: mockPars.length }));
    }
  };

  // ==========================================
  // LEAVE RECORDS OPERATIONS
  // ==========================================
  const handleUpdateLeaveStatus = async (id, parentStat, wardenStat, finalStat) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${backendUrl}/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          parentStatus: parentStat,
          wardenStatus: wardenStat,
          finalStatus: finalStat,
          status: finalStat
        })
      });

      if (response.ok) {
        showToast('success', 'Leave status updated successfully.');
        setShowModal(null);
        fetchAllData(token);
      }
    } catch {
      let mockLvs = [...leaves];
      const idx = mockLvs.findIndex(x => x.id === id);
      if (idx !== -1) {
        mockLvs[idx].parentStatus = parentStat;
        mockLvs[idx].wardenStatus = wardenStat;
        mockLvs[idx].finalStatus = finalStat;
        mockLvs[idx].status = finalStat;
      }
      localStorage.setItem('mockLeaves', JSON.stringify(mockLvs));
      setLeaves(mockLvs);
      showToast('success', '[MOCK MODE] Outpass status modified.');
      setShowModal(null);

      const app = mockLvs.filter(x => x.status === 'Approved').length;
      const pen = mockLvs.filter(x => x.status === 'Pending').length;
      setStats(prev => ({ ...prev, approvedLeaves: app, pendingLeaves: pen }));
    }
  };

  const deleteLeaveItem = async (id) => {
    if (!window.confirm("Permanently purge this leave request record?")) return;
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${backendUrl}/leaves/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        // Also remove from localStorage to prevent it reappearing on offline refresh
        let mockLvs = JSON.parse(localStorage.getItem('mockLeaves') || '[]');
        mockLvs = mockLvs.filter(x => x.id !== id);
        localStorage.setItem('mockLeaves', JSON.stringify(mockLvs));

        showToast('success', 'Leave record purged.');
        fetchAllData(token);
      } else {
        const errText = await response.text();
        console.error("Delete failed:", errText);
        showToast('error', `Failed to delete: ${response.status} ${errText}`);
      }
    } catch (err) {
      console.error("Network or mock delete error:", err);
      let mockLvs = leaves.filter(x => x.id !== id);
      localStorage.setItem('mockLeaves', JSON.stringify(mockLvs));
      setLeaves(mockLvs);
      showToast('success', '[MOCK MODE] Outpass deleted.');

      const app = mockLvs.filter(x => x.status === 'Approved').length;
      const pen = mockLvs.filter(x => x.status === 'Pending').length;
      setStats(prev => ({ ...prev, totalLeaves: mockLvs.length, approvedLeaves: app, pendingLeaves: pen }));
    }
  };

  // ==========================================
  // NOTIFICATIONS BROADCAST OPERATIONS
  // ==========================================
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (!notificationForm.title || !notificationForm.message) {
      showToast('error', 'Notification Title and Message cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(notificationForm)
      });

      if (response.ok) {
        showToast('success', 'Notification broadcasted successfully!');
        setNotificationForm({ title: '', message: '', role: 'student' });
        fetchAllData(token);
      }
    } catch {
      let mockNotifs = [...notifications];
      const id = mockNotifs.length + 1;
      mockNotifs.push({
        id,
        title: notificationForm.title,
        message: notificationForm.message,
        role: notificationForm.role,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mockNotifications', JSON.stringify(mockNotifs));
      setNotifications(mockNotifs);
      showToast('success', '[MOCK MODE] Notification broadcasted.');
      setNotificationForm({ title: '', message: '', role: 'student' });
    }
  };

  const deleteNotificationItem = async (id) => {
    if (!window.confirm("Remove this broadcast message?")) return;
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${backendUrl}/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('success', 'Broadcast removed.');
        fetchAllData(token);
      }
    } catch {
      let mockNotifs = notifications.filter(x => x.id !== id);
      localStorage.setItem('mockNotifications', JSON.stringify(mockNotifs));
      setNotifications(mockNotifs);
      showToast('success', '[MOCK MODE] Broadcast purged.');
    }
  };

  // ==========================================
  // SETTINGS SAVING OPERATIONS
  // ==========================================
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${backendUrl}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        showToast('success', 'System configurations updated.');
        fetchAllData(token);
      }
    } catch {
      localStorage.setItem('mockSettings', JSON.stringify(settings));
      showToast('success', '[MOCK MODE] Settings configurations saved.');
    }
  };

  // ==========================================
  // MOCK DOWNLOAD GENERATORS (CSV/SHEETS)
  // ==========================================
  const downloadReportSim = (type, format) => {
    let headers;
    let rows;
    let filename = `hlms_report_${type}_${new Date().toISOString().slice(0, 10)}`;

    if (type === 'leaves') {
      headers = ['Leave ID', 'Student Name', 'From Date', 'To Date', 'Reason', 'Destination', 'Status'];
      rows = leaves.map(l => [l.id, l.studentName || 'Student', l.fromDate, l.toDate, l.reason, l.destination, l.status]);
    } else if (type === 'students') {
      headers = ['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Year', 'Hostel Room'];
      rows = students.map(s => [s.id, s.name, s.email, s.phone || '', s.course || '', s.year || '', s.hostelRoom]);
    } else {
      headers = ['Log ID', 'Student Name', 'Destination', 'Exit Time', 'Entry Time', 'Status'];
      rows = gatelogs.map(g => [g.id, g.studentName, g.destination, g.exitTime || 'N/A', g.entryTime || 'N/A', g.status]);
    }

    let content = headers.join(',') + '\n' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');

    // Trigger virtual file download
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.${format === 'excel' ? 'csv' : 'txt'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', `Exported ${type} list successfully as ${format.toUpperCase()} format.`);
  };

  // Helper search queries
  const getFilteredItems = (list, properties) => {
    return list.filter(item => {
      const matchQuery = searchQuery.trim().toLowerCase();
      if (!matchQuery) return true;
      return properties.some(prop => {
        const val = item[prop];
        return val && val.toString().toLowerCase().includes(matchQuery);
      });
    });
  };

  const getPaginatedList = (list) => {
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  return (
    <div className="dashboard-layout admin-dashboard-layout">

      {/* 1. LEFT MODULAR SIDEBAR PANEL */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header admin-sidebar-header">
          <div className="admin-side-logo">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 L15 30 L50 45 L85 30 Z" />
              <path d="M22 36 L22 65 C22 75, 50 85, 50 85 C50 85, 78 75, 78 65 L78 36 L50 50 Z" />
              <circle cx="50" cy="30" r="4" fill="#f59e0b" />
            </svg>
          </div>
          <div>
            <h2 className="sidebar-brand-name">Command Center</h2>
            <p className="sidebar-brand-sub" style={{ color: '#93c5fd' }}>HLMS Administrator</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => { setActivePanel('home'); setSearchQuery(''); }} className={`sidebar-item ${activePanel === 'home' ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard Stats</span>
          </button>

          <button onClick={() => { setActivePanel('students'); setSearchQuery(''); setCurrentPage(1); }} className={`sidebar-item ${activePanel === 'students' ? 'active' : ''}`}>
            <Users size={18} />
            <span>Manage Students</span>
          </button>

          <button onClick={() => { setActivePanel('parents'); setSearchQuery(''); setCurrentPage(1); }} className={`sidebar-item ${activePanel === 'parents' ? 'active' : ''}`}>
            <UserCheck size={18} />
            <span>Manage Parents</span>
          </button>

          <button onClick={() => { setActivePanel('wardens'); setSearchQuery(''); setCurrentPage(1); }} className={`sidebar-item ${activePanel === 'wardens' ? 'active' : ''}`}>
            <ShieldCheck size={18} />
            <span>Manage Wardens</span>
          </button>

          <button onClick={() => { setActivePanel('leaves'); setSearchQuery(''); setCurrentPage(1); }} className={`sidebar-item ${activePanel === 'leaves' ? 'active' : ''}`}>
            <FileText size={18} />
            <span>Leave Records</span>
          </button>

          <button onClick={() => { setActivePanel('gatelogs'); setSearchQuery(''); setCurrentPage(1); }} className={`sidebar-item ${activePanel === 'gatelogs' ? 'active' : ''}`}>
            <ClipboardList size={18} />
            <span>Gate logs Logs</span>
          </button>

          <button onClick={() => { setActivePanel('analytics'); setSearchQuery(''); }} className={`sidebar-item ${activePanel === 'analytics' ? 'active' : ''}`}>
            <TrendingUp size={18} />
            <span>Reports & Analytics</span>
          </button>

          <button onClick={() => { setActivePanel('notifications'); setSearchQuery(''); }} className={`sidebar-item ${activePanel === 'notifications' ? 'active' : ''}`}>
            <Bell size={18} />
            <span>Notifications Broadcaster</span>
          </button>

          <button onClick={() => { setActivePanel('wardenDirectoryUI'); setSearchQuery(''); }} className={`sidebar-item ${activePanel === 'wardenDirectoryUI' ? 'active' : ''}`}>
            <ClipboardList size={18} />
            <span>Warden Directory UI</span>
          </button>

          <button onClick={() => { setActivePanel('hostelPoliciesUI'); setSearchQuery(''); }} className={`sidebar-item ${activePanel === 'hostelPoliciesUI' ? 'active' : ''}`}>
            <FileText size={18} />
            <span>Hostel Policies UI</span>
          </button>

          <button onClick={() => { setActivePanel('settings'); setSearchQuery(''); }} className={`sidebar-item ${activePanel === 'settings' ? 'active' : ''}`}>
            <Settings size={18} />
            <span>System Settings</span>
          </button>

          <button onClick={handleLogout} className="sidebar-item logout-btn" style={{ color: '#f87171', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
            <LogOut size={18} />
            <span>Log Out Admin</span>
          </button>
        </nav>
      </aside>

      {/* 2. RIGHT CONTENT AREA FRAME */}
      <div className="main-content" ref={mainContentRef}>

        {/* TOPBAR HEADER NAVBAR */}
        <header className="topbar admin-topbar">
          <div className="topbar-welcome">
            <h3 className="topbar-welcome-title">Console Command Center</h3>
            <p className="topbar-welcome-sub">{settings.universityName} — {settings.hostelName}</p>
          </div>

          <div className="topbar-profile">
            <div className="topbar-avatar" style={{ backgroundColor: '#1e40af', color: '#fff' }}>A</div>
            <div className="topbar-profile-info">
              <span className="topbar-profile-name">{adminUser?.name || 'Administrator'}</span>
              <span className="topbar-profile-room" style={{ color: '#93c5fd' }}>Role: Head Registrar</span>
            </div>
          </div>
        </header>

        {/* INNER DYNAMIC SCENE CONTAINER */}
        <div className="dashboard-container">
          {loading && (
            <div style={{
              height: '3px',
              backgroundColor: '#3b82f6',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999
            }}></div>
          )}

          {message && (
            <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`}>
              <div className="toast-icon">
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              </div>
              <div>
                <p className="toast-title">{message.type === 'success' ? 'Success' : 'Attention'}</p>
                <p className="toast-text">{message.text}</p>
              </div>
            </div>
          )}

          {/* ✅ SAVE SUCCESS ANIMATION BANNER */}
          {saveSuccess && (
            <div style={{
              position: 'sticky',
              top: 0,
              zIndex: 9999,
              width: '100%',
              background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              animation: 'saveFlashIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 4px 24px rgba(16,185,129,0.5)',
              borderRadius: '0 0 1rem 1rem',
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                animation: 'saveCheckPop 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }}>
                <CheckCircle size={22} />
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>✅ Changes Saved Successfully!</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.85, margin: 0 }}>Your updates have been applied and are now live.</p>
              </div>
            </div>
          )}

          {/* ==========================================
             PANEL 1: DASHBOARD HOME (SCREEN 12)
             ========================================== */}
          {activePanel === 'home' && (
            <>
              {/* Stats metric Cards Grid */}
              <section className="stats-grid admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Students</span>
                    <span className="stat-number">{stats.totalStudents}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-total"><Users size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Parents</span>
                    <span className="stat-number">{stats.totalParents}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-approved"><UserCheck size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Wardens</span>
                    <span className="stat-number">{stats.totalWardens}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-total" style={{ backgroundColor: '#f59e0b' }}><ShieldCheck size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Leave Applications</span>
                    <span className="stat-number">{stats.totalLeaves}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-pending"><FileText size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Approved Leaves</span>
                    <span className="stat-number">{stats.approvedLeaves}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-approved"><CheckCircle size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Pending Reviews</span>
                    <span className="stat-number">{stats.pendingLeaves}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-pending" style={{ backgroundColor: '#ef4444' }}><Clock size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Students Outside</span>
                    <span className="stat-number">{stats.studentsOutside || 0}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-total" style={{ backgroundColor: '#8b5cf6' }}><ClipboardList size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Returned Today</span>
                    <span className="stat-number">{stats.returnedToday || 0}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-approved"><CheckCircle size={20} /></div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Late Returns</span>
                    <span className="stat-number">{stats.lateReturns || 0}</span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-pending" style={{ backgroundColor: '#ef4444' }}><AlertCircle size={20} /></div>
                </div>
              </section>

              {/* Analytical Charts and Activities Grid */}
              <div className="dashboard-grid-two-cols">

                {/* Activity Feed */}
                <section className="section-card">
                  <div className="section-card-header">
                    <h4 className="section-card-title"><ClipboardList size={18} /> Recent Activities Log</h4>
                  </div>
                  <div className="section-card-body">
                    {recentActivities.length === 0 ? (
                      <div className="empty-state">
                        <Info size={30} style={{ color: '#94a3b8' }} />
                        <p className="empty-state-title">No Activities Logged</p>
                      </div>
                    ) : (
                      <div className="activity-timeline">
                        {recentActivities.map((act, i) => (
                          <div key={act.id || i} className="activity-item">
                            <div className={`activity-bullet ${act.type === 'leave' ? 'bullet-leave' : 'bullet-gate'}`}></div>
                            <div className="activity-details">
                              <p className="activity-text">
                                <strong>{act.studentName}</strong>: {act.message}
                              </p>
                              <span className="activity-time">
                                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(act.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <span className={`status-badge ${act.status === 'Approved' || act.status === 'Returned' ? 'status-approved' : 'status-pending'}`}>
                              {act.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Leaves Distribution chart */}
                <section className="section-card">
                  <div className="section-card-header">
                    <h4 className="section-card-title"><TrendingUp size={18} /> Leave Request Analytics</h4>
                  </div>
                  <div className="section-card-body">
                    <div className="chart-box">
                      <div className="chart-bar-item">
                        <div className="chart-bar-info">
                          <span>Approval Success Ratio</span>
                          <span>{stats.totalLeaves > 0 ? Math.round((stats.approvedLeaves / stats.totalLeaves) * 100) : 0}%</span>
                        </div>
                        <div className="chart-bar-track">
                          <div className="chart-bar-fill fill-approved" style={{ width: `${stats.totalLeaves > 0 ? (stats.approvedLeaves / stats.totalLeaves) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="chart-bar-item">
                        <div className="chart-bar-info">
                          <span>Awaiting Review Ratio</span>
                          <span>{stats.totalLeaves > 0 ? Math.round((stats.pendingLeaves / stats.totalLeaves) * 100) : 0}%</span>
                        </div>
                        <div className="chart-bar-track">
                          <div className="chart-bar-fill fill-pending" style={{ width: `${stats.totalLeaves > 0 ? (stats.pendingLeaves / stats.totalLeaves) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="info-box" style={{ marginTop: '1.5rem', fontSize: '0.8rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.75rem', color: '#1e40af' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>System Integrity Status: Healthy</p>
                        <p>Database and JWT sessions are running correctly. Seeding scripts have populated active structures for student profiles and outpass queues.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ==========================================
             PANEL 2: MANAGE STUDENTS (SCREEN 13)
             ========================================== */}
          {activePanel === 'students' && (
            <section className="section-card">
              <div className="section-card-header search-action-header">
                <div className="search-bar-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search students by name, email, or hostel room..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setStudentForm({ name: '', email: '', phone: '', course: '', year: '', hostelRoom: '', password: '' });
                    setShowModal('student');
                  }}
                  className="btn-primary"
                >
                  <Plus size={16} /> Add Student
                </button>
              </div>

              <div className="section-card-body">
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Hostel Room</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedList(getFilteredItems(students, ['name', 'email', 'hostelRoom'])).map((stud, idx) => (
                        <tr key={stud.id || idx}>
                          <td>#{stud.id}</td>
                          <td><strong>{stud.name}</strong></td>
                          <td>{stud.email}</td>
                          <td>{stud.phone || 'N/A'}</td>
                          <td>{stud.course || 'N/A'}</td>
                          <td>{stud.year || 'N/A'}</td>
                          <td><span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>{stud.hostelRoom}</span></td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => {
                                  setModalMode('edit');
                                  setSelectedItem(stud);
                                  setStudentForm({ ...stud, password: '' });
                                  setShowModal('student');
                                }}
                                className="action-btn edit-btn"
                                title="Edit Profile"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteStudentItem(stud.id)}
                                className="action-btn delete-btn"
                                title="Delete student"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination-wrapper">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <span className="pagination-text">Page {currentPage} of {Math.ceil(getFilteredItems(students, ['name', 'email', 'hostelRoom']).length / itemsPerPage) || 1}</span>
                  <button
                    disabled={currentPage >= Math.ceil(getFilteredItems(students, ['name', 'email', 'hostelRoom']).length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 3: MANAGE WARDENS (SCREEN 14)
             ========================================== */}
          {activePanel === 'wardens' && (
            <section className="section-card">
              <div className="section-card-header search-action-header">
                <div className="search-bar-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search wardens by name or assigned hostel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setWardenForm({ name: '', email: '', phone: '', hostelAssigned: '', shift: '', password: '' });
                    setShowModal('warden');
                  }}
                  className="btn-primary"
                >
                  <Plus size={16} /> Add Warden
                </button>
              </div>

              <div className="section-card-body">
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Warden ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Assigned Hostel</th>
                        <th>Shift</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredItems(wardens, ['name', 'email', 'hostelAssigned']).map((ward, idx) => (
                        <tr key={ward.id || idx}>
                          <td>#W-{ward.id}</td>
                          <td><strong>{ward.name}</strong></td>
                          <td>{ward.email}</td>
                          <td>{ward.phone || 'N/A'}</td>
                          <td><span className="status-badge status-approved">{ward.hostelAssigned}</span></td>
                          <td><span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>{ward.shift || 'N/A'}</span></td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => {
                                  setModalMode('edit');
                                  setSelectedItem(ward);
                                  setWardenForm({ ...ward, password: '' });
                                  setShowModal('warden');
                                }}
                                className="action-btn edit-btn"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteWardenItem(ward.id)}
                                className="action-btn delete-btn"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 4: LEAVE RECORDS MANAGEMENT (SCREEN 15)
             ========================================== */}
          {activePanel === 'leaves' && (
            <section className="section-card">
              <div className="section-card-header search-action-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div className="search-bar-wrapper" style={{ flex: '1', minWidth: '200px' }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search leaves by reason, destination, or student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filters-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Status Filter:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-input"
                    style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="All">All Requests</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Checked-Out">Checked Out</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => downloadReportSim('leaves', 'excel')}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                  >
                    <Download size={14} /> Export Report
                  </button>
                </div>
              </div>

              <div className="section-card-body">
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Leave ID</th>
                        <th>Student Name</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Destination</th>
                        <th>Expected Timings</th>
                        <th>Actual Timings</th>
                        <th>Return Status</th>
                        <th>Final Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedList(
                        getFilteredItems(leaves, ['studentName', 'reason', 'destination']).filter(l => statusFilter === 'All' || l.status === statusFilter || l.finalStatus === statusFilter)
                      ).map((lv, idx) => (
                        <tr key={lv.id || idx}>
                          <td>#L-{lv.id}</td>
                          <td><strong>{lv.studentName || 'Student'}</strong></td>
                          <td>{lv.fromDate}</td>
                          <td>{lv.toDate}</td>
                          <td>{lv.destination}</td>
                          <td>
                            <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                              <b>Out:</b> {lv.expectedTimeOut ? `${lv.expectedTimeOut}` : 'Pending'}
                              <br />
                              <b>In:</b> {lv.expectedTimeIn ? `${lv.expectedTimeIn}` : 'Pending'}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem' }}>
                              <b>Out:</b> {lv.actualTimeOut ? new Date(lv.actualTimeOut).toLocaleString() : 'N/A'}
                              <br />
                              <b>In:</b> {lv.actualTimeIn ? new Date(lv.actualTimeIn).toLocaleString() : 'N/A'}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${lv.status === 'Returned' ? 'status-approved' : lv.status === 'Late Return' ? 'status-rejected' : lv.status === 'Out' ? 'status-pending' : ''}`} style={{ backgroundColor: lv.status === 'Returned' ? '#dcfce7' : lv.status === 'Late Return' ? '#fee2e2' : lv.status === 'Out' ? '#fef9c3' : 'transparent', color: lv.status === 'Returned' ? '#166534' : lv.status === 'Late Return' ? '#991b1b' : lv.status === 'Out' ? '#854d0e' : '#475569' }}>
                              {lv.status === 'Returned' ? 'On Time' : lv.status === 'Late Return' ? 'Late' : lv.status === 'Out' ? 'Still Outside' : 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${lv.status === 'Approved' || lv.status === 'Completed' ? 'status-approved' : lv.status === 'Rejected' ? 'status-rejected' : 'status-pending'}`}>
                              {lv.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => {
                                  setSelectedItem(lv);
                                  setShowModal('leaveDetails');
                                }}
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}
                              >
                                View details
                              </button>
                              <button
                                onClick={() => deleteLeaveItem(lv.id)}
                                className="action-btn delete-btn"
                                style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '4px', fontWeight: 'bold' }}
                                title="Delete Leave Request"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination-wrapper">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <span className="pagination-text">Page {currentPage}</span>
                  <button
                    disabled={currentPage >= Math.ceil(getFilteredItems(leaves, ['studentName', 'reason', 'destination']).length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 5: MANAGE PARENTS (SCREEN 16)
             ========================================== */}
          {activePanel === 'parents' && (
            <section className="section-card">
              <div className="section-card-header search-action-header">
                <div className="search-bar-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search parents by name, email, or student link..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setParentForm({ name: '', email: '', phone: '', studentId: '', password: '' });
                    setShowModal('parent');
                  }}
                  className="btn-primary"
                >
                  <Plus size={16} /> Add Parent
                </button>
              </div>

              <div className="section-card-body">
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Parent ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Linked Student</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredItems(parents, ['name', 'email', 'studentName']).map((parent, idx) => (
                        <tr key={parent.id || idx}>
                          <td>#P-{parent.id}</td>
                          <td><strong>{parent.name}</strong></td>
                          <td>{parent.email}</td>
                          <td>{parent.phone || 'N/A'}</td>
                          <td>
                            <span className="status-badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                              {parent.studentName || 'Unlinked'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => {
                                  setModalMode('edit');
                                  setSelectedItem(parent);
                                  setParentForm({ ...parent, password: '' });
                                  setShowModal('parent');
                                }}
                                className="action-btn edit-btn"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteParentItem(parent.id)}
                                className="action-btn delete-btn"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 6: REPORTS & ANALYTICS (SCREEN 17)
             ========================================== */}
          {activePanel === 'analytics' && (
            <div className="analytics-layout">
              {/* Exporters header */}
              <section className="section-card">
                <div className="section-card-header" style={{ justifyContent: 'space-between' }}>
                  <h4 className="section-card-title"><TrendingUp size={18} /> Administrative Reports Command Desk</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => downloadReportSim('students', 'excel')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Download size={14} /> Export CSV Excel
                    </button>
                    <button onClick={() => alert("PDF compilation simulator: Generated custom academic leave reports. Initiated PDF local document stream.")} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FileText size={14} /> Export PDF Report
                    </button>
                  </div>
                </div>

                <div className="section-card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div className="info-box" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                    <p style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Monthly Leaves Trend</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active outpasses checked-out this week: <strong>{gatelogs.filter(x => x.status === 'Checked-Out').length}</strong></p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Average processing time: <strong>4.2 Curfew Hours</strong></p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Attendance scan rate: <strong>98.4%</strong></p>
                    </div>
                  </div>

                  <div className="info-box" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                    <p style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Student Movement Audit</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total completed outpasses: <strong>{leaves.filter(x => x.status === 'Completed').length}</strong></p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Curfew exceptions flagged: <strong>0</strong></p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active in-residence count: <strong>{students.length - gatelogs.filter(x => x.status === 'Checked-Out').length}</strong></p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==========================================
             PANEL 7: NOTIFICATIONS MANAGEMENT (SCREEN 18)
             ========================================== */}
          {activePanel === 'notifications' && (
            <div className="dashboard-grid-two-cols">
              {/* Left Column: Create Form */}
              <section className="section-card">
                <div className="section-card-header">
                  <h4 className="section-card-title"><Bell size={18} /> Send System Notification</h4>
                </div>
                <div className="section-card-body">
                  <form onSubmit={handleNotificationSubmit} className="portal-form">
                    <div className="form-group">
                      <label className="form-label">Broadcast Title</label>
                      <input
                        type="text"
                        placeholder="E.g., Curfew Reminder, Maintenance Alert"
                        value={notificationForm.title}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Target User Role</label>
                      <select
                        value={notificationForm.role}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, role: e.target.value }))}
                        className="form-input"
                      >
                        <option value="student">Students Portal</option>
                        <option value="parent">Parents Portal</option>
                        <option value="warden">Wardens Portal</option>
                        <option value="all">Broadcast to All</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Detailed Message</label>
                      <textarea
                        rows="4"
                        placeholder="Write detailed announcements context here..."
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                        className="form-input"
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                      Broadcast Broadcast Notification
                    </button>
                  </form>
                </div>
              </section>

              {/* Right Column: History List */}
              <section className="section-card">
                <div className="section-card-header">
                  <h4 className="section-card-title"><ClipboardList size={18} /> Notifications History</h4>
                </div>
                <div className="section-card-body">
                  {notifications.length === 0 ? (
                    <div className="empty-state">
                      <p>No broadcast history found.</p>
                    </div>
                  ) : (
                    <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {notifications.map((notif, index) => (
                        <div key={notif.id || index} className="notif-history-card" style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--color-dark)', fontSize: '0.85rem' }}>{notif.title}</strong>
                            <button onClick={() => deleteNotificationItem(notif.id)} className="action-btn delete-btn" style={{ padding: '0.1rem' }}><Trash2 size={12} /></button>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{notif.message}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#1e40af', marginTop: '0.25rem' }}>
                            <span>Target: <strong>{notif.role.toUpperCase()}</strong></span>
                            <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* ==========================================
             PANEL 8: SETTINGS PAGE (SCREEN 19)
             ========================================== */}
          {activePanel === 'hostelPoliciesUI' && (
            <section className="section-card">
              <div className="section-card-header">
                <h4 className="section-card-title"><FileText size={18} /> Manage Hostel & Portal Policies</h4>
              </div>
              <div className="section-card-body" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1.5rem', color: '#475569' }}>Changes made here will directly reflect on the student's portal home screen.</p>
                
                <h5 style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Portal Rules</h5>
                {portalRules.map((rule, idx) => (
                  <div key={rule.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc' }}>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Rule Title</label>
                      <input 
                        type="text" 
                        value={rule.title} 
                        onChange={(e) => {
                          const updated = [...portalRules];
                          updated[idx].title = e.target.value;
                          setPortalRules(updated);
                        }}
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Rule Description</label>
                      <textarea 
                        value={rule.desc} 
                        onChange={(e) => {
                          const updated = [...portalRules];
                          updated[idx].desc = e.target.value;
                          setPortalRules(updated);
                        }}
                        className="form-input"
                        style={{ minHeight: '60px' }}
                      />
                    </div>
                  </div>
                ))}
                
                <h5 style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '1rem', marginTop: '2.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Hostel Rules</h5>
                {hostelRules.map((rule, idx) => (
                  <div key={rule.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc' }}>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Rule Title</label>
                      <input 
                        type="text" 
                        value={rule.title} 
                        onChange={(e) => {
                          const updated = [...hostelRules];
                          updated[idx].title = e.target.value;
                          setHostelRules(updated);
                        }}
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Rule Description</label>
                      <textarea 
                        value={rule.desc} 
                        onChange={(e) => {
                          const updated = [...hostelRules];
                          updated[idx].desc = e.target.value;
                          setHostelRules(updated);
                        }}
                        className="form-input"
                        style={{ minHeight: '60px' }}
                      />
                    </div>
                  </div>
                ))}

                <button 
                  className="btn-primary" 
                  onClick={async () => {
                    // ⚡ Instantly scroll to top & show animation on click
                    if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                    try {
                      const token = localStorage.getItem('adminToken');
                      await fetch(`${backendUrl}/public/policies`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ type: 'portal', policies: portalRules })
                      });
                      await fetch(`${backendUrl}/public/policies`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ type: 'hostel', policies: hostelRules })
                      });
                      setMessage({ type: 'success', text: 'Policies updated successfully!' });
                      setTimeout(() => setMessage(null), 3000);
                    } catch (error) {
                      console.error('Error saving policies:', error);
                      setMessage({ type: 'error', text: 'Failed to update policies' });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}
                  style={{ width: '100%', marginTop: '1.5rem' }}>
                  💾 Save All Policies
                </button>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 11: WARDEN DIRECTORY EDITOR
             ========================================== */}
          {activePanel === 'wardenDirectoryUI' && (
            <section className="section-card">
              <div className="section-card-header">
                <h4 className="section-card-title"><ClipboardList size={18} /> Manage Warden Directory Cards</h4>
              </div>
              <div className="section-card-body" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1.5rem', color: '#475569' }}>These cards appear on the Contact / Warden Help tab in the student portal.</p>
                
                {wardenDirectory.map((warden, idx) => (
                  <div key={warden.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Name</label>
                        <input type="text" value={warden.name} onChange={(e) => { const u = [...wardenDirectory]; u[idx].name = e.target.value; setWardenDirectory(u); }} className="form-input" />
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Role</label>
                        <input type="text" value={warden.role} onChange={(e) => { const u = [...wardenDirectory]; u[idx].role = e.target.value; setWardenDirectory(u); }} className="form-input" />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Location</label>
                        <input type="text" value={warden.location} onChange={(e) => { const u = [...wardenDirectory]; u[idx].location = e.target.value; setWardenDirectory(u); }} className="form-input" />
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Color Theme</label>
                        <select value={warden.color || 'primary'} onChange={(e) => { const u = [...wardenDirectory]; u[idx].color = e.target.value; setWardenDirectory(u); }} className="form-input">
                          <option value="primary">Primary (Indigo)</option>
                          <option value="secondary">Secondary (Emerald)</option>
                          <option value="warning">Warning (Amber)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Phone</label>
                        <input type="text" value={warden.phone} onChange={(e) => { const u = [...wardenDirectory]; u[idx].phone = e.target.value; setWardenDirectory(u); }} className="form-input" />
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Email</label>
                        <input type="text" value={warden.email} onChange={(e) => { const u = [...wardenDirectory]; u[idx].email = e.target.value; setWardenDirectory(u); }} className="form-input" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  className="btn-primary" 
                  onClick={async () => {
                    // ⚡ Instantly scroll to top & show animation on click
                    if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                    try {
                      const token = localStorage.getItem('adminToken');
                      await fetch(`${backendUrl}/public/warden-directory`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ directory: wardenDirectory })
                      });
                      setMessage({ type: 'success', text: 'Warden Directory updated successfully!' });
                      setTimeout(() => setMessage(null), 3000);
                    } catch (error) {
                      console.error('Error saving warden directory:', error);
                      setMessage({ type: 'error', text: 'Failed to update directory' });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}
                  style={{ width: '100%', marginTop: '1rem' }}>
                  💾 Save Directory Changes
                </button>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 12: SETTINGS PAGE (SCREEN 19)
             ========================================== */}
          {activePanel === 'settings' && (
            <section className="section-card" style={{ maxWidth: '38rem', margin: '0 auto', width: '100%' }}>
              <div className="section-card-header">
                <h4 className="section-card-title"><Settings size={18} /> University & Hostel Configurations</h4>
              </div>
              <div className="section-card-body">
                <form onSubmit={handleSettingsSubmit} className="portal-form">
                  <h5 style={{ fontWeight: 'bold', color: '#1e3a8a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>University Branding Settings</h5>

                  <div className="form-group">
                    <label className="form-label">University Name</label>
                    <input
                      type="text"
                      value={settings.universityName}
                      onChange={(e) => setSettings(prev => ({ ...prev, universityName: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hostel Block Name</label>
                    <input
                      type="text"
                      value={settings.hostelName}
                      onChange={(e) => setSettings(prev => ({ ...prev, hostelName: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <h5 style={{ fontWeight: 'bold', color: '#1e3a8a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Contact Information Section</h5>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Save branding settings Settings
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ==========================================
             PANEL 9: GATE LOGS MANAGEMENT (SCREEN 20)
             ========================================== */}
          {activePanel === 'gatelogs' && (
            <section className="section-card">
              <div className="section-card-header search-action-header">
                <div className="search-bar-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search security gate exit/entry logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => downloadReportSim('gatelogs', 'excel')}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Download size={14} /> Export Logs
                </button>
              </div>

              <div className="section-card-body">
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>Student Name</th>
                        <th>Leave ID</th>
                        <th>Exit Timestamp</th>
                        <th>Entry Timestamp</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedList(getFilteredItems(gatelogs, ['studentName', 'status'])).map((log, idx) => (
                        <tr key={log.id || idx}>
                          <td>#G-{log.id}</td>
                          <td><strong>{log.studentName}</strong></td>
                          <td>#L-{log.leaveId}</td>
                          <td>{log.exitTime ? new Date(log.exitTime).toLocaleString() : 'N/A'}</td>
                          <td>{log.entryTime ? new Date(log.entryTime).toLocaleString() : <span style={{ color: '#ef4444' }}>Out of Campus</span>}</td>
                          <td>
                            <span className={`status-badge ${log.status === 'Returned' || log.status === 'Completed' ? 'status-approved' : 'status-pending'}`} style={{ backgroundColor: log.status === 'Checked-Out' ? '#fee2e2' : '', color: log.status === 'Checked-Out' ? '#ef4444' : '' }}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination-wrapper">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <span className="pagination-text">Page {currentPage}</span>
                  <button
                    disabled={currentPage >= Math.ceil(getFilteredItems(gatelogs, ['studentName']).length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* ==========================================
         POPUP MODALS SYSTEM FOR CRUDS
         ========================================== */}
      {showModal === 'student' && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '32rem' }}>
            <div className="modal-header">
              <h3 className="modal-title">{modalMode === 'add' ? 'Register New Student' : 'Edit Student Profile'}</h3>
              <button onClick={() => setShowModal(null)} className="btn-close">&times;</button>
            </div>
            <form onSubmit={handleStudentSubmit}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={studentForm.name} onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={studentForm.email} onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input type="text" className="form-input" value={studentForm.phone} onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hostel Room</label>
                  <input type="text" className="form-input" placeholder="E.g., B-Block 402" value={studentForm.hostelRoom} onChange={(e) => setStudentForm(prev => ({ ...prev, hostelRoom: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Degree</label>
                  <input type="text" className="form-input" value={studentForm.course} onChange={(e) => setStudentForm(prev => ({ ...prev, course: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <input type="text" className="form-input" placeholder="E.g., 3rd Year" value={studentForm.year} onChange={(e) => setStudentForm(prev => ({ ...prev, year: e.target.value }))} />
                </div>
                {modalMode === 'add' && (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Account Password</label>
                    <input type="password" placeholder="••••••••" className="form-input" value={studentForm.password} onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))} required />
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'warden' && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '30rem' }}>
            <div className="modal-header">
              <h3 className="modal-title">{modalMode === 'add' ? 'Add Hostel Warden' : 'Edit Warden details'}</h3>
              <button onClick={() => setShowModal(null)} className="btn-close">&times;</button>
            </div>
            <form onSubmit={handleWardenSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Warden Name</label>
                  <input type="text" className="form-input" value={wardenForm.name} onChange={(e) => setWardenForm(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={wardenForm.email} onChange={(e) => setWardenForm(prev => ({ ...prev, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-input" value={wardenForm.phone} onChange={(e) => setWardenForm(prev => ({ ...prev, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assigned Hostel Block</label>
                  <input type="text" placeholder="E.g., B-Block" className="form-input" value={wardenForm.hostelAssigned} onChange={(e) => setWardenForm(prev => ({ ...prev, hostelAssigned: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duty Shift</label>
                  <select className="form-input" value={wardenForm.shift} onChange={(e) => setWardenForm(prev => ({ ...prev, shift: e.target.value }))}>
                    <option value="Day Shift">Day Shift</option>
                    <option value="Night Shift">Night Shift</option>
                  </select>
                </div>
                {modalMode === 'add' && (
                  <div className="form-group">
                    <label className="form-label">Duty Password</label>
                    <input type="password" placeholder="••••••••" className="form-input" value={wardenForm.password} onChange={(e) => setWardenForm(prev => ({ ...prev, password: e.target.value }))} required />
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Warden</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'parent' && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '30rem' }}>
            <div className="modal-header">
              <h3 className="modal-title">{modalMode === 'add' ? 'Register Parent Record' : 'Edit Parent link'}</h3>
              <button onClick={() => setShowModal(null)} className="btn-close">&times;</button>
            </div>
            <form onSubmit={handleParentSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Parent Name</label>
                  <input type="text" className="form-input" value={parentForm.name} onChange={(e) => setParentForm(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={parentForm.email} onChange={(e) => setParentForm(prev => ({ ...prev, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" value={parentForm.phone} onChange={(e) => setParentForm(prev => ({ ...prev, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Linked Student ID</label>
                  <select className="form-input" value={parentForm.studentId} onChange={(e) => setParentForm(prev => ({ ...prev, studentId: e.target.value }))}>
                    <option value="">Select student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                    ))}
                  </select>
                </div>
                {modalMode === 'add' && (
                  <div className="form-group">
                    <label className="form-label">Parent Password</label>
                    <input type="password" placeholder="••••••••" className="form-input" value={parentForm.password} onChange={(e) => setParentForm(prev => ({ ...prev, password: e.target.value }))} required />
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Parent Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'leaveDetails' && selectedItem && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '32rem' }}>
            <div className="modal-header">
              <h3 className="modal-title">Leave Request #L-{selectedItem.id} Details</h3>
              <button onClick={() => setShowModal(null)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <p><strong>Student Name:</strong> {selectedItem.studentName || 'Student'}</p>
                <p><strong>Destination:</strong> {selectedItem.destination}</p>
                <p><strong>From Date:</strong> {selectedItem.fromDate}</p>
                <p><strong>To Date:</strong> {selectedItem.toDate}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                <p><strong>Reason for Outpass:</strong></p>
                <p style={{ backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}>
                  {selectedItem.reason}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                <p><strong>Individual Audit Overrides:</strong></p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span>Parent Status: <strong style={{ color: '#1e40af' }}>{selectedItem.parentStatus || 'Pending'}</strong></span>
                  <span>Warden Status: <strong style={{ color: '#1e40af' }}>{selectedItem.wardenStatus || 'Pending'}</strong></span>
                  <span>Final Status: <strong style={{ color: '#10b981' }}>{selectedItem.status}</strong></span>
                </div>
              </div>

              {/* Status Action overrides */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                <button onClick={() => handleUpdateLeaveStatus(selectedItem.id, 'Approved', 'Approved', 'Approved')} className="btn-primary" style={{ backgroundColor: '#10b981' }}>
                  Approve Both (Force Approve)
                </button>
                <button onClick={() => handleUpdateLeaveStatus(selectedItem.id, 'Rejected', 'Rejected', 'Rejected')} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}>
                  Reject Leave
                </button>
                <button onClick={() => setShowModal(null)} className="btn-secondary" style={{ marginLeft: 'auto' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
