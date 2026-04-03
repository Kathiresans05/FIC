import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings,
  Menu,
  Globe,
  Plus
} from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/candidates`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a,b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 4);
          setNotifications(sorted);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left-controls">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        {/* Search box positioned on the left (Hidden on mobile) */}
        <div className="topbar-search-group">
          <div className="search-box">
            <Search size={18} strokeWidth={1.5} className="search-icon" />
            <input type="text" placeholder="Search candidates, jobs, reports..." />
          </div>
        </div>
      </div>

      {/* Everything else grouped and pushed to the right */}
      <div className="topbar-right-panel">
        <div className="topbar-actions">
          <a href="https://forgeindiaconnect.com" target="_blank" rel="noopener noreferrer" className="icon-btn" title="View Public Website">
            <Globe size={20} strokeWidth={1.5} />
          </a>
          <div className="notification-container">
            <button className="icon-btn bell" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={20} strokeWidth={1.5} />
              <span className="notification-dot"></span>
            </button>

            {isNotifOpen && (
              <div className="notif-dropdown shadow-md">
                <div className="notif-header">
                  <h5>Notifications</h5>
                </div>
                <div className="dropdown-divider" style={{ margin: 0 }}></div>
                {notifications.length > 0 ? notifications.map(n => {
                  const isJoined = n.status === 'Joined';
                  return (
                    <div className="notif-item" key={n._id}>
                      <div className={`n-icon ${isJoined ? 'bg-green-lite' : 'bg-blue-lite'}`}><Bell size={14} /></div>
                      <div>
                        <p className="n-title">{isJoined ? 'Candidate Joined' : 'Update Logged'}</p>
                        <p className="n-desc">{n.name} status is now {n.status}.</p>
                        <p className="n-time">
                          {new Date(n.updatedAt || n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="notif-item">
                    <p className="n-desc">No recent notifications.</p>
                  </div>
                )}
                <button className="notif-footer-btn" onClick={() => setIsNotifOpen(false)}>View All Activity</button>
              </div>
            )}
          </div>
        </div>

        <div className="topbar-divider"></div>

        <div className="profile-container">
          <button 
            className="profile-trigger" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div 
              className="avatar-square"
              style={{ 
                backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
              {!user?.avatar && (user?.name ? user.name.charAt(0).toUpperCase() : 'N')}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || "NEHA GUPTA"}</span>
              <span className="user-role-badge">{user?.role || "CONSULTANCY EXECUTIVE"}</span>
            </div>
            <ChevronDown size={16} strokeWidth={1.5} className="chevron-icon" />
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown shadow-md">
              <div className="dropdown-header">
                <p className="p-name">{user?.name}</p>
                <p className="p-email">{user?.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <User size={16} /> My Profile
              </button>
              <button className="dropdown-item">
                <Settings size={16} /> Account Settings
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-btn" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar {
          height: var(--topbar-height);
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          sticky: top;
          z-index: 10;
        /* Mobile Menu Toggle */
        .topbar-left-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-right: auto;
        }
        .menu-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          transition: 0.2s;
          background: #F8FAFC;
        }
        .menu-toggle:hover {
          background: #E2E8F0;
        }
        /* Unified Search Bar positioned on Left */
        .topbar-search-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F8FAFC;
          padding: 0 20px; 
          border-radius: 999px;
          width: 400px; 
          height: 44px;
          border: 1px solid transparent;
          transition: 0.2s;
        }
        .search-box:focus-within {
          border-color: #E2E8F0;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .search-icon {
          color: #94A3B8;
        }
        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px; 
          color: #1E293B;
          font-weight: 400;
        }
        .search-box input::placeholder {
          color: #94A3B8;
        }
        
        /* Right Panel Grouping */
        .topbar-right-panel {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .topbar-divider {
          width: 1px;
          height: 24px;
          background: #E2E8F0;
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .icon-btn {
          position: relative;
          color: #64748B;
          transition: 0.2s;
          display: flex;
        }
        .icon-btn:hover {
          color: #1E293B;
        }
        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #EF4444; /* Standard Red */
          border: 1.5px solid white;
          border-radius: 50%;
        }
        
        /* Premium Profile Block */
        .profile-container {
          position: relative;
        }
        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px;
          border-radius: 8px;
          transition: 0.2s;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .profile-trigger:hover {
          background: #F8FAFC;
        }
        .avatar-square {
          width: 38px;
          height: 38px;
          background: #1E293B;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border-radius: 10px;
          font-size: 16px;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.2;
        }
        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: #1E293B;
          text-transform: uppercase;
        }
        .user-role-badge {
          font-size: 10px;
          font-weight: 700;
          background: #FFF7ED;
          color: #F97316;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .chevron-icon {
          color: #64748B;
          margin-left: 4px;
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 8px 0;
          z-index: 100;
        }
        .dropdown-header {
          padding: 12px 16px;
        }
        .p-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
        .p-email { font-size: 12px; color: var(--text-secondary); }
        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          font-size: 14px;
          color: var(--text-primary);
          transition: 0.2s;
        }
        .dropdown-item:hover {
          background: var(--bg-main);
        }
        .logout-btn {
          color: var(--accent-red);
        }
        
        /* Notifications Dropdown */
        .notification-container { position: relative; }
        .notif-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: -10px;
          width: 320px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0;
          z-index: 100;
        }
        .notif-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .notif-header h5 { font-size: 14px; font-weight: 700; margin: 0; }
        .notif-item { padding: 12px 16px; display: flex; gap: 12px; transition: 0.2s; cursor: pointer; border-bottom: 1px solid var(--border); }
        .notif-item:hover { background: #F8FAFC; }
        .n-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bg-blue-lite { background: #EFF6FF; color: #3B82F6; }
        .bg-green-lite { background: #F0FDF4; color: #10B981; }
        .n-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .n-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; line-height: 1.4; }
        .n-time { font-size: 11px; color: #94A3B8; margin-top: 4px; font-weight: 500; }
        .notif-footer-btn { width: 100%; padding: 12px; text-align: center; font-size: 13px; font-weight: 600; color: var(--accent-blue); background: none; border: none; cursor: pointer; border-bottom-left-radius: var(--radius-md); border-bottom-right-radius: var(--radius-md); }
        .notif-footer-btn:hover { background: #F8FAFC; }
        
        @media (max-width: 1024px) {
          .menu-toggle { display: flex; }
          .search-box { display: none; }
          .topbar-right-panel { gap: 12px; }
          .user-name, .user-role-badge { display: none; }
          .topbar-divider { margin: 0; }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
