# 🎓 State Tech Leaves (Hostel Outpass & Leave Management Portal)

**State Tech Leaves** is a modern, high-fidelity, and feature-rich Web Portal designed to digitize, streamline, and secure the process of hostel leave applications, parent approvals, warden evaluations, and security gate control. 

Built with a stunning premium dark-mode theme utilizing **custom glassmorphism Vanilla CSS components**, this web application offers a seamless workflow for students, parents, wardens, guards, and university administrators alike. It supports both a live online backend API connection and a **fully functional offline mock mode** (using `localStorage` state synchronization) for demonstration purposes.

---

## 🌟 Key Features

### 👤 Role-Based Access Control & Portals
The application integrates five distinct roles, each equipped with dedicated views and interactive features:

| Role | Access URL / Portal | Primary Features & Responsibilities |
| :--- | :--- | :--- |
| **🎓 Student** | Root Portal (`/`) | Apply for leaves/outpasses, view real-time status/history, read hostel announcements, generate rotating QR gate passes, update profile photos (with interactive cropping), submit support tickets and feedback. |
| **👨‍👩‍👧 Parent** | `/parent/pending` (or Root switcher) | Review their child's pending outpass requests, view justification, and approve/reject instantly with OTP/login verification. |
| **🏠 Warden** | `/warden/dashboard` (or Root switcher) | Vett block-specific outpass applications, check parent approval status, analyze block-wise statistics, post hostel bulletins. |
| **🛡️ Admin** | `/admin/dashboard` (or Root switcher) | Comprehensive block & room allocations, live visitor registrations, manual security guard access control, student database management, audit logs, and analytical insights. |
| **👑 Super Admin** | `/superadmin/dashboard` | Monitor system-wide health checks, configure global policies, download database backups, inspect system audit records. |

---

## 🛡️ Technical Highlights

### 1. 🔄 Dynamic Rotating QR Gate Pass
To eliminate outpass forgery (such as sharing screenshots or screen recordings of approved passes), the portal utilizes a dynamic security protocol:
- Outpasses render a security-hardened QR code that **automatically rotates and refreshes** its payload every few seconds.
- Presenting an expired or static screenshot to the guard will trigger an immediate access warning.
- Includes a built-in **Guard QR Scanner** simulation page to test real-time exit/entry scanning.

### 🔌 2. Off-Grid Auto-Fallback (Mock Database)
When the backend API (defaulting to `http://localhost:5000`) is offline, the app automatically transitions to **Mock Mode**:
- Uses **local-first state sync** inside `localStorage` to emulate registration, logins, leave history tracking, notifications, profile updates, and warden directories.
- Allows fully offline presentations and developer testing without running database or server instances.

### 🎨 3. Hand-Crafted Glassmorphic CSS Design System
Instead of generic templates or external utility styling libraries, the application employs a custom styling system located in [index.css](file:///Users/piyushjain/Documents/Hostel%20Leave_Management_system/frontend/src/index.css) (~5,000 lines):
- Modern typography utilizing the **Inter** font family.
- Curated color palettes with HSL tailwinds, neon purple/indigo glows, and dark-theme panels.
- Fine-grained transitions, micro-animations, custom scrollbars, and sidebar states.

### ⚡ 4. Keyboard Shortcuts (Command Menu)
- Pressing `Cmd + K` or `Ctrl + K` toggles a global **Command Palette** which lets users search tabs, access support channels, view profiles, or log out instantly.

---

## 📁 Project Architecture & Folder Structure

The frontend is structured systematically to separate business logic, reusable components, and views:

```bash
frontend/
├── public/                 # Static assets (favicons, public images)
├── src/
│   ├── assets/             # Brand logos and illustration assets
│   ├── components/         # Reusable UI widgets
│   │   └── ImageCropper.jsx  # Interactive profile image cropping utility
│   ├── utils/              # Helper utilities
│   │   └── cropImage.js    # Canvas manipulation utility for cropping
│   ├── pages/              # Module-specific dashboards & screens
│   │   ├── ActiveLeavesManagement.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdvancedChangePassword.jsx
│   │   ├── AdvancedEditProfile.jsx
│   │   ├── ApplyLeave.jsx
│   │   ├── ApprovedLeavesAnalytics.jsx
│   │   ├── EmergencyContactManagement.jsx
│   │   ├── HostelAnnouncements.jsx
│   │   ├── HostelManagement.jsx
│   │   ├── LeaveAnalyticsInsights.jsx
│   │   ├── LeaveHistory.jsx
│   │   ├── ParentApprovalDashboard.jsx
│   │   ├── ParentLogin.jsx
│   │   ├── QRGatePass.jsx
│   │   ├── QRPassHistory.jsx
│   │   ├── QRScanner.jsx
│   │   ├── RejectedLeavesManagement.jsx
│   │   ├── RoomAllocation.jsx
│   │   ├── RoomManagement.jsx
│   │   ├── SecurityAccessControl.jsx
│   │   ├── SmartNotificationCenter.jsx
│   │   ├── StudentAttendance.jsx
│   │   ├── StudentFeedback.jsx
│   │   ├── StudentNotifications.jsx
│   │   ├── StudentProfile.jsx
│   │   ├── StudentSupport.jsx
│   │   ├── SuperAdminDashboard.jsx
│   │   ├── SystemAuditLogs.jsx
│   │   ├── UserActivityLogCenter.jsx
│   │   ├── VisitorManagement.jsx
│   │   ├── WardenDashboard.jsx
│   │   └── WardenLogin.jsx
│   ├── App.jsx             # Main Router, global states, and Auth Gateways
│   ├── App.css             # Entry overrides
│   ├── index.css           # Global custom CSS Design System variables & layout rules
│   └── main.jsx            # React root mount script
├── package.json            # Node project configuration
├── vite.config.js          # Vite build tool setup
└── eslint.config.js        # Linter parameters
```

---

## 🚀 Getting Started

Follow these steps to run the frontend application locally on your machine.

### 📥 1. Installation
Clone the repository, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

### ⚙️ 2. Development Execution
Launch the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 🔑 3. Default Mock Credentials (Mock Mode)
If you run without the backend server, use the following logins to browse pre-seeded data in each dashboard. The password is the same for all default accounts:

- **Password (All Accounts)**: `password123`
- **🎓 Student**: `student@college.edu`
- **👨‍👩‍👧 Parent**: `parent@college.edu`
- **🏠 Warden**: `warden@college.edu`
- **🛡️ Admin**: `admin@college.edu`

To register a new user in Mock Mode, simply click **"Create an account"** on the login page and choose your desired role.

### 🏗️ 4. Build for Production
To build static production files under the `dist/` directory:
```bash
npm run build
```

---

## 🛠️ Key Dependencies
- [React](https://react.dev/) (v19) - UI Library
- [Vite](https://vite.dev/) (v8) - Build Tool
- [React Router DOM](https://reactrouter.com/) (v7) - Client Routing
- [Lucide React](https://lucide.dev/) - Modern and clean interface icons
- [React Easy Crop](https://github.com/ricardo-ch/react-easy-crop) - Canvas-based profile image cropping
