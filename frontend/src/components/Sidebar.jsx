import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  UserSquare2, 
  FileText, 
  Calendar, 
  Coins, 
  Trophy, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Bell, 
  ShieldCheck, 
  UserCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const getMenuByRole = () => {
    switch (user?.role) {
      case 'Super Admin':
      case 'Admin':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
          { name: 'Job Vacancies', icon: Briefcase, path: '/admin/jobs' },
          { name: 'Candidates', icon: Users, path: '/admin/candidates' },
          { name: 'Consultancy Team', icon: ShieldCheck, path: '/admin/team' },
          { name: 'Scripts', icon: FileText, path: '/admin/scripts' },
          { name: 'Interviews', icon: Calendar, path: '/admin/interviews' },
          { name: 'Incentives', icon: Coins, path: '/admin/incentives' },
          { name: 'Rewards', icon: Trophy, path: '/admin/rewards' },
          { name: 'Payouts', icon: CreditCard, path: '/admin/payouts' },
          { name: 'Reports', icon: BarChart3, path: '/admin/reports' },
          { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ];
      case 'Consultancy Executive':
      case 'Recruitment Manager':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/team/dashboard' },
          { name: 'Assigned Jobs', icon: Briefcase, path: '/team/jobs' },
          { name: 'Candidates', icon: Users, path: '/team/candidates' },
          { name: 'Call Scripts', icon: FileText, path: '/team/scripts' },
          { name: 'Follow-ups', icon: Calendar, path: '/team/followups' },
          { name: 'Interviews', icon: Calendar, path: '/team/interviews' },
          { name: 'Incentives', icon: Coins, path: '/team/incentives' },
          { name: 'My Performance', icon: BarChart3, path: '/team/performance' },
          { name: 'Profile', icon: UserCircle, path: '/team/profile' },
        ];
      case 'Agent':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/agent/dashboard' },
          { name: 'Job Openings', icon: Briefcase, path: '/agent/jobs' },
          { name: 'Refer Candidate', icon: Users, path: '/agent/refer' },
          { name: 'My Referrals', icon: UserSquare2, path: '/agent/referrals' },
          { name: 'Incentives', icon: Coins, path: '/agent/incentives' },
          { name: 'Rewards', icon: Trophy, path: '/agent/rewards' },
          { name: 'Leaderboard', icon: BarChart3, path: '/agent/leaderboard' },
          { name: 'Payout History', icon: CreditCard, path: '/agent/payouts' },
          { name: 'Profile', icon: UserCircle, path: '/agent/profile' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuByRole();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <img 
          src="https://forgeindiaconnect.com/assets/img/logo/forgeindia_l1.webp" 
          alt="Forge India" 
          style={{ 
            height: isOpen ? '68px' : '32px', 
            objectFit: 'contain',
            transition: 'all 0.3s'
          }} 
        />
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <style>{`
        .sidebar {
          width: ${isOpen ? 'var(--sidebar-width)' : '80px'};
          background: var(--primary);
          color: white;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 1000;
        }
        .sidebar-logo {
          padding: 24px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: center;
        }
        .logo-text {
          color: white;
          font-size: 1.25rem;
          letter-spacing: 0.05em;
        }
        .logo-text span {
          color: var(--accent-orange);
        }
        .sidebar-nav {
          padding: 16px 0;
          flex-grow: 1;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-link span {
          opacity: ${isOpen ? 1 : 0};
          transition: opacity 0.2s;
          display: ${isOpen ? 'block' : 'none'};
        }
        .sidebar-link svg {
          color: var(--accent-orange);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .sidebar-link:hover svg {
          transform: scale(1.1);
          color: white;
        }
        .sidebar-link:hover {
          color: white;
          background: rgba(255,255,255,0.05);
        }
        .sidebar-link.active {
          color: var(--accent-orange);
          background-color: rgba(249, 115, 22, 0.1);
          border-left: 3px solid var(--accent-orange);
          font-weight: 600;
          padding-left: 21px;
        }
        .sidebar-link.active svg {
          color: var(--accent-orange);
        }
        .sidebar-link svg {
          flex-shrink: 0;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
