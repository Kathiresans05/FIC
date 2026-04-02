import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserPlus, 
  Coins, 
  Briefcase, 
  TrendingUp, 
  Search, 
  Filter,
  MoreHorizontal,
  Settings
} from 'lucide-react';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const notifications = [
    { id: 1, type: 'Candidate', title: 'New Lead Assigned', message: 'Amit Kumar has been assigned to your Java Developer queue.', time: '2 mins ago', read: false },
    { id: 2, type: 'Job', title: 'Urgent Opening: BPO Executive', message: 'Amazon has added a 50+ vacancy requirement with high incentive.', time: '1 hour ago', read: false },
    { id: 3, type: 'Incentive', title: 'Payout Approved', message: 'Your selection incentive of ₹8,500 has been approved and dispatched.', time: '3 hours ago', read: true },
    { id: 4, type: 'System', title: 'Weekly Performance Report', message: 'Your weekly recruitment summary is now available for download.', time: '5 hours ago', read: true },
    { id: 5, type: 'Candidate', title: 'Interview Scheduled', message: 'Priya Verma interview is scheduled for tomorrow at 2:30 PM.', time: 'Yesterday', read: true },
    { id: 6, type: 'System', title: 'New Reward Unlocked!', message: 'Congratulations! You reached the 5 joins milestone and unlocked a Smartphone.', time: 'Yesterday', read: true },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'Candidate': return <UserPlus size={20} className="text-blue" />;
      case 'Job': return <Briefcase size={20} className="text-purple" />;
      case 'Incentive': return <Coins size={20} className="text-green" />;
      default: return <Bell size={20} className="text-orange" />;
    }
  };

  return (
    <div className="content-wrapper notifications-page">
      <div className="section-header">
        <div>
          <h1>Notifications</h1>
          <p className="text-secondary">Stay updated with real-time alerts for candidates, payouts, and job openings.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-text-blue">Mark all as read</button>
          <button className="btn btn-outline"><Settings size={18} /> Notification Settings</button>
        </div>
      </div>

      <div className="notifications-layout">
        <div className="notifications-filters h-fit card">
          <h3>Filter by Category</h3>
          <div className="filter-list-side">
            {['All', 'Candidate', 'Job', 'Incentive', 'System'].map((f) => (
              <button 
                key={f} 
                className={`filter-side-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {activeFilter === f ? <CheckCircle2 size={16} /> : <div className="dot-mini"></div>}
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="notifications-feed">
          <div className="card feed-card">
            <div className="feed-header">
              <div className="search-box-md">
                <Search size={18} />
                <input type="text" placeholder="Search in notifications..." />
              </div>
            </div>
            
            <div className="feed-list">
              {notifications.filter(n => activeFilter === 'All' || n.type === activeFilter).map((n) => (
                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                  <div className="n-icon-box">
                    {getIcon(n.type)}
                  </div>
                  <div className="n-content">
                    <div className="n-title-row">
                      <h4>{n.title}</h4>
                      <span className="n-time">{n.time}</span>
                    </div>
                    <p className="n-message">{n.message}</p>
                    <div className="n-actions-row">
                      <button className="n-action-btn">View Details</button>
                      {!n.read && <button className="n-action-btn">Mark as read</button>}
                    </div>
                  </div>
                  <button className="n-more"><MoreHorizontal size={18} /></button>
                </div>
              ))}
            </div>

            <div className="feed-footer">
              <button className="btn btn-text-blue">View notification history</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .notifications-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; margin-top: 24px; align-items: flex-start; }
        
        .notifications-filters h3 { font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 16px; padding: 0 12px; }
        .filter-list-side { display: flex; flex-direction: column; gap: 4px; }
        .filter-side-btn { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; color: var(--text-secondary); transition: 0.2s; text-align: left; }
        .filter-side-btn:hover { background: #F1F5F9; color: var(--text-primary); }
        .filter-side-btn.active { background: #EFF6FF; color: var(--accent-blue); }
        .dot-mini { width: 6px; height: 6px; background: #CBD5E1; border-radius: 50%; margin: 5px; }
        
        .feed-card { padding: 0; }
        .feed-header { padding: 16px 20px; border-bottom: 1px solid var(--border); }
        .search-box-md { display: flex; align-items: center; gap: 10px; background: #F8FAFC; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 8px 12px; }
        .search-box-md input { border: none; background: none; outline: none; font-size: 14px; width: 100%; }
        
        .feed-list { display: flex; flex-direction: column; }
        .notification-item { display: flex; gap: 20px; padding: 24px; border-bottom: 1px solid var(--border); position: relative; transition: 0.2s; }
        .notification-item:hover { background: #FDFDFF; }
        .notification-item.unread { background: #F8FAFF; border-left: 4px solid var(--accent-blue); padding-left: 20px; }
        
        .n-icon-box { width: 44px; height: 44px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; shadow: var(--shadow-sm); border: 1px solid var(--border); }
        .n-content { flex: 1; }
        .n-title-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .n-title-row h4 { font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .n-time { font-size: 12px; color: var(--text-secondary); }
        .n-message { font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px; }
        
        .n-actions-row { display: flex; gap: 16px; }
        .n-action-btn { font-size: 12px; font-weight: 700; color: var(--accent-blue); }
        .n-more { position: absolute; top: 24px; right: 24px; color: var(--text-secondary); opacity: 0.4; }
        .n-more:hover { opacity: 1; color: var(--text-primary); }
        
        .feed-footer { padding: 16px; text-align: center; border-top: 1px solid var(--border); }
        
        @media (max-width: 1024px) {
          .notifications-layout { grid-template-columns: 1fr; }
          .notifications-filters { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
