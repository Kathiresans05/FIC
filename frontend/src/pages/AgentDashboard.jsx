import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  Trophy, 
  TrendingUp, 
  Gift, 
  Rocket,
  Target,
  Phone,
  UserPlus,
  CalendarCheck,
  AlertCircle,
  IndianRupee,
  Loader2
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import API_BASE_URL from '../api/config';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReferrals: 0,
    validReferrals: 0,
    interviewedCount: 0,
    selectedCount: 0,
    joinedCount: 0,
    totalEarnings: '₹0',
    pendingIncentives: '₹0',
    leaderboard: [],
    monthlyTarget: { current: 0, goal: 10 }
  });
  const [candidates, setCandidates] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats${user?.id ? `?userId=${user.id}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/candidates`);
        const data = await response.json();
        setCandidates(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    const fetchTopJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        const data = await response.json();
        // Sort by incentive descending
        const sorted = data.sort((a, b) => parseInt(b.incentive || 0) - parseInt(a.incentive || 0));
        setTopJobs(sorted.slice(0, 4));
      } catch (error) {
        console.error('Error fetching top jobs:', error);
      }
    };

    fetchStats();
    fetchCandidates();
    fetchTopJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  const targetCurrent = stats?.joinedCount || 0;
  const targetGoal = stats?.monthlyTarget?.goal || 10;
  const targetPercentage = Math.min((targetCurrent / targetGoal) * 100, 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected': return 'green';
      case 'Joined': return 'green';
      case 'Interviewing': return 'orange';
      case 'Called': return 'orange';
      case 'Interested': return 'purple';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="content-wrapper agent-home">
      <div className="section-header">
        <div className="header-info">
          <h1 className="welcome-title">Welcome Back, {user?.name?.split(' ')[0] || 'Rahul'}!</h1>
          <p className="welcome-subtitle">Here's your performance overview for today.</p>
        </div>
        
        <div className="target-widget">
          <div className="target-info">
            <Target className="target-icon" size={20} />
            <span className="target-text">
              Monthly Target: <span className="target-count">{targetCurrent} / {targetGoal} Joins</span>
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${targetPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Total Referrals" value={(stats?.totalReferrals || 0).toString()} icon={Users} trend="up" trendValue="12" color="purple" />
        <KpiCard title="Valid Referrals" value={(stats?.validReferrals || 0).toString()} icon={CheckCircle2} trend="up" trendValue="5" color="blue" />
        <KpiCard title="Interviewed" value={(stats?.interviewedCount || 0).toString()} icon={Calendar} trend="up" trendValue="3" color="orange" />
        <KpiCard title="Selected" value={(stats?.selectedCount || 0).toString()} icon={Trophy} trend="up" trendValue="2" color="green" />
        <KpiCard title="Joined Candidates" value={(stats?.joinedCount || 0).toString()} icon={Briefcase} trend="up" trendValue="1" color="green" highlight={true} />
        <KpiCard title="Total Earnings" value={stats?.totalEarnings || '₹0'} icon={IndianRupee} trend="up" trendValue="15" color="orange" />
        <KpiCard title="Pending Incentives" value={stats?.pendingIncentives || '₹0'} icon={TrendingUp} trend="up" trendValue="8" color="blue" />
        <KpiCard title="Reward Progress" value={`${stats?.joinedCount || 0} / ${stats?.monthlyTarget?.goal || 10}`} icon={Gift} color="purple" progress={targetPercentage} />
      </div>

      <div className="dashboard-grid">
        {/* Row 1: Milestones (Full Width) */}
        <div className="card milestone-card full-width">
          <div className="card-header">
            <h3 className="card-title">Monthly Reward Milestone</h3>
            <div className="reward-badge">
              {Math.max(0, (stats?.monthlyTarget?.goal || 10) - (stats?.joinedCount || 0))} Joins To Go
            </div>
          </div>
          
          <div className="milestone-tracker">
            <div className="milestone-line">
              <div className="milestone-fill" style={{ width: `${Math.min(targetPercentage * 1.2, 100)}%` }}></div>
            </div>
            <div className="milestone-nodes">
              {[
                { label: '5 Joins', reward: 'Smartphone', reached: (stats?.joinedCount || 0) >= 5 },
                { label: '10 Joins', reward: '₹25K Cash', current: (stats?.joinedCount || 0) < 10 && (stats?.joinedCount || 0) >= 5 },
                { label: '15 Joins', reward: 'Goa Trip', locked: (stats?.joinedCount || 0) < 15 },
                { label: '25+ Joins', reward: 'International Trip', locked: (stats?.joinedCount || 0) < 25 },
              ].map((m, i) => (
                <div key={i} className={`milestone-node ${m.reached ? 'reached' : ''} ${m.current ? 'current' : ''} ${m.locked ? 'locked' : ''}`}>
                  <div className="node-icon">
                    {m.reached ? <CheckCircle2 size={18} /> : m.current ? <Rocket size={18} /> : <Gift size={18} />}
                  </div>
                  <div className="node-content">
                    <p className="m-label">{m.label}</p>
                    <p className="m-reward">{m.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="claim-reward-box">
            <div className="claim-text">
              {(stats?.joinedCount || 0) >= 5 
                ? `You have successfully unlocked the 5 Joins Reward (Smartphone). Claim it now or wait for the next milestone!`
                : `Complete 5 joins to unlock your first reward - a brand new Smartphone!`}
            </div>
            <button className="claim-btn">Claim Reward</button>
          </div>
        </div>

        {/* Row 2: Top Jobs & Leaderboard (Side by Side) */}
        <div className="grid-row">
          <div className="card jobs-card">
            <div className="card-header">
              <div className="title-group">
                <h3 className="card-title">Top Incentive Jobs</h3>
                <span className="view-all-text">Active Positions</span>
              </div>
            </div>
            <div className="job-list">
              {topJobs.length > 0 ? topJobs.map((job, i) => (
                <div key={i} className="job-item">
                  <div className="job-details">
                    <p className="job-name">{job.title}</p>
                    <p className="job-meta">{job.company} • {job.location}</p>
                  </div>
                  <div className="job-incentive">
                    <span className="incentive-val">₹{parseInt(job.incentive).toLocaleString()}</span>
                    <span className="incentive-label">per join</span>
                  </div>
                </div>
              )) : (
                <p className="text-secondary text-sm p-4 text-center">Opening soon...</p>
              )}
            </div>
          </div>

          <div className="card leaderboard-card">
            <div className="card-header">
              <h3 className="card-title">Monthly Leaderboard</h3>
              <Target size={18} color="#94A3B8" />
            </div>
            <div className="leaderboard-list">
              {stats.leaderboard && stats.leaderboard.length > 0 ? stats.leaderboard.slice(0, 3).map((leader, i) => (
                <div key={i} className="leader-item">
                  <div className="leader-info">
                    <div className="rank-circle" style={{ background: leader.color || '#CBD5E1' }}>{leader.rank}</div>
                    <span className="leader-name">{leader.name}</span>
                  </div>
                  <span className="leader-joins">{leader.joins}</span>
                </div>
              )) : (
                <p className="text-secondary text-sm text-center py-4">No data yet</p>
              )}
              
              <div className="my-rank-box">
                <div className="leader-info">
                  <div className="rank-circle my-rank-circle">!</div>
                  <span className="leader-name font-bold">You (Self Tracking)</span>
                </div>
                <span className="leader-joins my-joins">{targetCurrent} Joins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Referral Updates (Full Width) */}
        <div className="card referral-card full-width">
          <div className="card-header">
            <h3 className="card-title">Recent Referral Updates</h3>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>JOB ROLE</th>
                  <th>CURRENT STATUS</th>
                  <th>UPDATE DATE</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length > 0 ? candidates.map((c, i) => (
                  <tr key={i}>
                    <td className="font-bold">{c.name}</td>
                    <td>{c.jobId?.title || "N/A"}</td>
                    <td>
                      <span className={`status-pill pill-${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="text-secondary text-sm">
                      {new Date(c.updatedAt || c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                )) : (
                  [
                    { name: 'Amit Bajaj', job: 'Java Dev', status: 'Interview Scheduled', date: 'Today, 11:30 AM', color: 'orange' },
                    { name: 'Priya Verma', job: 'React Lead', status: 'Selected', date: 'Yesterday', color: 'green' },
                    { name: 'Sandeep Patil', job: 'BPO Exec', status: 'Contacted', date: '21 Mar 2024', color: 'orange' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="font-bold">{row.name}</td>
                      <td>{row.job}</td>
                      <td>
                        <span className={`status-pill pill-${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="text-secondary text-sm">{row.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .welcome-title { font-size: 28px; font-weight: 800; color: #0F172A; }
        .welcome-subtitle { color: #64748B; margin-top: 4px; font-weight: 500; }
        
        .target-widget { background: white; padding: 16px 24px; border-radius: 16px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 24px; box-shadow: var(--shadow-sm); }
        .target-info { display: flex; align-items: center; gap: 10px; }
        .target-icon { color: #94A3B8; }
        .target-text { font-size: 14px; font-weight: 600; color: #475569; }
        .target-count { color: #EA580C; font-weight: 800; }
        
        .progress-bar-container { width: 120px; height: 8px; background: #F1F5F9; border-radius: 99px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #F59E0B; border-radius: 99px; transition: width 1s ease; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 24px; }
        .dashboard-grid { display: flex; flex-direction: column; gap: 24px; }
        .grid-row { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 800; color: #1E293B; }
        .reward-badge { font-size: 11px; font-weight: 800; color: #EA580C; background: #FFF7ED; padding: 4px 12px; border-radius: 99px; border: 1px solid #FFEDD5; }

        .milestone-tracker { position: relative; padding: 32px 0 48px; margin: 0 10px; }
        .milestone-line { position: absolute; top: 54px; left: 0; width: 100%; height: 4px; background: #F1F5F9; border-radius: 99px; z-index: 1; }
        .milestone-fill { height: 100%; background: #F59E0B; border-radius: 99px; transition: width 1s ease; }
        .milestone-nodes { position: relative; z-index: 2; display: flex; justify-content: space-between; }
        .milestone-node { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .node-icon { width: 44px; height: 44px; background: white; border: 2px solid #E2E8F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94A3B8; transition: all 0.3s; }
        .node-content { text-align: center; }
        .m-label { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-bottom: 2px; }
        .m-reward { font-size: 12px; font-weight: 700; color: #475569; }

        .reached .node-icon { background: #10B981; border-color: #10B981; color: white; box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
        .current .node-icon { background: #F59E0B; border-color: #F59E0B; color: white; box-shadow: 0 0 15px rgba(245, 158, 11, 0.3); transform: scale(1.1); }
        .current .m-label { color: #F59E0B; }
        .current .m-reward { color: #0F172A; }

        .claim-reward-box { background: #FFF7ED; border: 1px dashed #FDBA74; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: auto; }
        .claim-text { font-size: 13px; font-weight: 600; color: #9A3412; line-height: 1.4; }
        .claim-btn { background: white; color: #0F172A; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #FFEDD5; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .title-group { display: flex; flex-direction: column; gap: 2px; }
        .view-all-text { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; }
        .job-list { display: flex; flex-direction: column; gap: 12px; }
        .job-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
        .job-item:last-child { border: none; }
        .job-name { font-weight: 700; font-size: 14px; color: #1E293B; }
        .job-meta { font-size: 11px; color: #64748B; margin-top: 2px; }
        .job-incentive { text-align: right; }
        .incentive-val { display: block; font-weight: 800; color: #16A34A; font-size: 14px; }
        .incentive-label { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; }

        .table-container { overflow-x: auto; margin: 0 -8px; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { text-align: left; padding: 12px 8px; font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; border-bottom: 1px solid #F1F5F9; }
        .custom-table td { padding: 16px 8px; font-size: 13px; border-bottom: 1px solid #F8FAFC; }

        .leaderboard-list { display: flex; flex-direction: column; gap: 16px; }
        .leader-item { display: flex; justify-content: space-between; align-items: center; }
        .leader-info { display: flex; align-items: center; gap: 12px; }
        .rank-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; }
        .leader-name { font-size: 14px; font-weight: 600; color: #475569; }
        .leader-joins { font-size: 12px; font-weight: 700; color: #94A3B8; }
        
        .my-rank-box { background: #FFF7ED; padding: 12px 16px; border-radius: 12px; border: 2px solid #FED7AA; display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .my-rank-circle { background: #475569; }
        .my-joins { color: #EA580C; font-weight: 800; }

        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .grid-row { grid-template-columns: 1fr; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .section-header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .target-widget { width: 100%; justify-content: space-between; }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr; }
          .milestone-nodes { overflow-x: auto; padding-bottom: 10px; gap: 20px; }
          .milestone-node { min-width: 80px; }
          .claim-reward-box { flex-direction: column; text-align: center; }
          .welcome-title { font-size: 22px; }
        }
      `}</style>
    </div>
  );
};

export default AgentDashboard;
