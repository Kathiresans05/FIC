import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminCandidates from './pages/AdminCandidates';
import AdminTeam from './pages/AdminTeam';
import AdminScripts from './pages/AdminScripts';
import AdminIncentives from './pages/AdminIncentives';
import AdminInterviews from './pages/AdminInterviews';
import TeamDashboard from './pages/TeamDashboard';
import TeamCandidates from './pages/TeamCandidates';
import AgentDashboard from './pages/AgentDashboard';
import AgentJobs from './pages/AgentJobs';
import AgentLeaderboard from './pages/AgentLeaderboard';
import AgentRefer from './pages/AgentRefer';
import AgentReferrals from './pages/AgentReferrals';
import AdminRewards from './pages/AdminRewards';
import AdminReports from './pages/AdminReports';
import TeamJobs from './pages/TeamJobs';
import TeamScripts from './pages/TeamScripts';
import TeamFollowups from './pages/TeamFollowups';
import TeamPerformance from './pages/TeamPerformance';
import AgentRewards from './pages/AgentRewards';
import Notifications from './pages/Notifications';
import GeneralSettings from './pages/GeneralSettings';
import Login from './pages/Login';


const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const location = useLocation();

  // Close sidebar on navigation in mobile
  React.useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} />
      {/* Only visible on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Topbar toggleSidebar={toggleSidebar} />
        {children}
      </main>
      
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
        }
        .main-content {
          flex: 1;
          margin-left: ${isSidebarOpen ? 'var(--sidebar-width)' : '80px'};
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }
        .main-content.sidebar-closed {
          margin-left: 0;
        }
        .sidebar-mobile-overlay {
          display: none;
        }
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
          }
          .sidebar-mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            z-index: 90;
            backdrop-filter: blur(2px);
          }
        }
      `}</style>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === 'Agent' ? '/agent/dashboard' : user.role.includes('Admin') ? '/admin/dashboard' : '/team/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="candidates" element={<AdminCandidates />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="agents" element={<AdminTeam />} />
              <Route path="scripts" element={<AdminScripts />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="incentives" element={<AdminIncentives />} />
              <Route path="payouts" element={<AdminIncentives />} />
              <Route path="rewards" element={<AdminRewards />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<GeneralSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Team Routes */}
        <Route path="/team/*" element={
          <ProtectedRoute allowedRoles={['Recruitment Manager', 'Consultancy Executive']}>
            <Routes>
              <Route path="dashboard" element={<TeamDashboard />} />
              <Route path="jobs" element={<TeamJobs />} />
              <Route path="candidates" element={<TeamCandidates />} />
              <Route path="scripts" element={<TeamScripts />} />
              <Route path="followups" element={<TeamFollowups />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="incentives" element={<AdminIncentives />} />
              <Route path="performance" element={<TeamPerformance />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<GeneralSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Agent Routes */}
        <Route path="/agent/*" element={
          <ProtectedRoute allowedRoles={['Agent']}>
            <Routes>
              <Route path="dashboard" element={<AgentDashboard />} />
              <Route path="jobs" element={<AgentJobs />} />
              <Route path="refer" element={<AgentRefer />} />
              <Route path="referrals" element={<AgentReferrals />} />
              <Route path="incentives" element={<AdminIncentives />} />
              <Route path="rewards" element={<AgentRewards />} />
              <Route path="leaderboard" element={<AgentLeaderboard />} />
              <Route path="payouts" element={<AdminIncentives />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<GeneralSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
