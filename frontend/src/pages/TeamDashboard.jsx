import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  CheckCircle2, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Coins, 
  Target,
  MessageSquare,
  Loader2
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import API_BASE_URL from '../api/config';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';

const TeamDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayCalls: 0,
    connected: 0,
    interested: 0,
    todayInterviews: 0,
    followupsDue: 0,
    pendingIncentives: '₹0',
    hourlyActivity: [],
    urgentFollowups: [],
    scheduledInterviews: [],
    monthlyTarget: { current: 0, goal: 20 }
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats${user?.id ? `?userId=${user.id}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error fetching team stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-accent-blue" size={40} />
      </div>
    );
  }

  const targetCurrent = stats?.monthlyTarget?.current || 0;
  const targetGoal = stats?.monthlyTarget?.goal || 20;
  const targetPercentage = Math.min((targetCurrent / targetGoal) * 100, 100);

  return (
    <div className="content-wrapper team-home">
      <div className="section-header">
        <div>
          <h1>Welcome Back, {user?.name?.split(' ')[0] || 'Team'}!</h1>
          <p className="text-secondary">Here's your performance overview for today.</p>
        </div>
        <div className="header-actions">
          <div className="target-pill">
            <Target size={18} />
            <span>Monthly Target: <strong>{targetCurrent} / {targetGoal} Joins</strong></span>
            <div className="mini-progress"><div className="fill" style={{ width: `${targetPercentage}%` }}></div></div>
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Today Calls" value={(stats?.todayCalls || 0).toString()} icon={Phone} trend="up" trendValue="15" color="orange" />
        <KpiCard title="Connected Today" value={(stats?.connected || 0).toString()} icon={PhoneCall} trend="up" trendValue="8" color="green" />
        <KpiCard title="Interested Overall" value={(stats?.interested || 0).toString()} icon={UserPlus} trend="up" trendValue="22" color="purple" />
        <KpiCard title="Interviews Today" value={(stats?.todayInterviews || 0).toString()} icon={Calendar} trend="down" trendValue="2" color="orange" />
        <KpiCard title="Follow-ups Due" value={(stats?.followupsDue || 0).toString()} icon={AlertCircle} trend="up" trendValue="4" color="red" />
        <KpiCard title="Pending Incentives" value={stats?.pendingIncentives || '₹0'} icon={Coins} trend="up" trendValue="10" color="orange" />
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card col-span-2">
          <div className="chart-header">
            <h3>Hourly Call Activity</h3>
            <p className="text-secondary">Distribution of calls and connectivity (Last 24 Hours)</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.hourlyActivity || []}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConnected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} interval={2} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="calls" stroke="#F59E0B" fillOpacity={1} fill="url(#colorCalls)" strokeWidth={2} name="Total Updates" />
                <Area type="monotone" dataKey="connected" stroke="#10B981" fillOpacity={1} fill="url(#colorConnected)" strokeWidth={2} name="Converted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card interviews-card">
          <div className="chart-header">
            <h3>Scheduled Today</h3>
            <p className="text-secondary">Upcoming candidate interviews</p>
          </div>
          <div className="interview-list">
            {stats?.scheduledInterviews && stats.scheduledInterviews.length > 0 ? stats.scheduledInterviews.map((interview, i) => (
              <div key={i} className="interview-item">
                <div className="int-time">{new Date(interview.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="int-info">
                  <p className="int-name">{interview.name}</p>
                  <p className="int-job">Status: {interview.status}</p>
                </div>
                <button className="icon-btn-sm text-orange"><Calendar size={16} /></button>
              </div>
            )) : (
              <div className="empty-mini">
                <p>No interviews for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="card follow-up-card col-span-2">
          <div className="chart-header">
            <h3>Urgent Follow-ups</h3>
            <p className="text-secondary">Candidates needing immediate attention</p>
          </div>
          <div className="follow-up-grid">
            {stats?.urgentFollowups && stats.urgentFollowups.length > 0 ? stats.urgentFollowups.map((fu, i) => (
              <div key={i} className="follow-up-item">
                <div className="fu-header">
                  <p className="fu-name">{fu.name}</p>
                  <span className="fu-job">{fu.phone}</span>
                </div>
                <p className="fu-note">Last Status: <strong>{fu.status}</strong></p>
                <div className="fu-actions">
                  <button className="btn-icon-text"><Phone size={14} /> Call Now</button>
                  <button className="btn-icon-text"><MessageSquare size={14} /></button>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-8 text-center text-secondary">
                No urgent follow-ups found
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .target-pill { display: flex; align-items: center; gap: 12px; background: white; padding: 10px 16px; border: 1px solid var(--border); border-radius: 40px; font-size: 14px; }
        .target-pill strong { color: var(--accent-orange); }
        .mini-progress { width: 80px; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
        .mini-progress .fill { height: 100%; background: var(--accent-orange); }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .col-span-2 { grid-column: span 2; }
        .interview-list { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
        .interview-item { display: flex; align-items: center; gap: 16px; padding: 12px; background: #F8FAFC; border-radius: var(--radius-md); border: 1px solid var(--border); }
        .int-time { font-size: 11px; font-weight: 800; color: var(--accent-orange); width: 60px; }
        .int-info { flex: 1; }
        .int-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .int-job { font-size: 12px; color: var(--text-secondary); }
        .follow-up-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-top: 12px; }
        .follow-up-item { padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-md); background: white; }
        .fu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .fu-name { font-size: 14px; font-weight: 700; }
        .fu-job { font-size: 12px; color: var(--accent-blue); font-weight: 600; }
        .fu-note { font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; }
        .fu-actions { display: flex; gap: 15px; border-top: 1px solid #F1F5F9; paddingTop: 10px; }
        .btn-icon-text { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--accent-orange); border: none; background: none; cursor: pointer; }
        .empty-mini { padding: 30px; text-align: center; color: var(--text-secondary); font-size: 14px; border: 1px dashed var(--border); border-radius: 12px; }
      `}</style>
    </div>
  );
};

export default TeamDashboard;
