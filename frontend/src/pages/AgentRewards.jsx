import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Rocket, 
  Trophy, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Award, 
  Star,
  Zap,
  Info,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const AgentRewards = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ joinedThisMonth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats${user?.id ? `?userId=${user.id}` : ''}`);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const joinedCount = stats?.joinedThisMonth || 0;
  const points = joinedCount * 1000;

  const milestones = [
    { id: 1, title: 'Early Starter', target: '5 Joins', reward: 'Smartphone', goal: 5 },
    { id: 2, title: 'Pro Referrer', target: '10 Joins', reward: '₹25,000 Cash', goal: 10 },
    { id: 3, title: 'Elite Circle', target: '15 Joins', reward: 'Goa Trip (3D/2N)', goal: 15 },
    { id: 4, title: 'Recruitment King', target: '25 Joins', reward: 'International Trip', goal: 25 },
  ];

  // Helper to get milestone status
  const getMilestoneInfo = (m, idx) => {
    const completed = joinedCount >= m.goal;
    const isNext = !completed && (idx === 0 || joinedCount >= milestones[idx-1].goal);
    const locked = !completed && !isNext;
    const progress = completed ? 100 : (isNext ? (joinedCount / m.goal) * 100 : 0);
    
    return { ...m, completed, isNext, locked, progress };
  };

  const processedMilestones = milestones.map((m, i) => getMilestoneInfo(m, i));
  const currentMilestone = processedMilestones.find(m => m.isNext) || (joinedCount >= 25 ? processedMilestones[3] : processedMilestones[0]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const nextGoal = currentMilestone.goal;
  const progressPercent = Math.min((joinedCount / nextGoal) * 100, 100);

  return (
    <div className="content-wrapper agent-rewards-page">
      <div className="section-header">
        <div>
          <h1>Rewards & Milestones</h1>
          <p className="text-secondary">Unlock exclusive rewards as you reach recruitment milestones.</p>
        </div>
        <div className="header-actions">
          <div className="points-badge">
            <Zap size={16} /> <span>Current Points: <strong>{points.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Achievement Card */}
      <div className="card achievement-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2 className="text-blue">You're on Fire, {user?.name?.split(' ')[0] || 'Rahul'}!</h2>
            <p>
              {joinedCount >= 5 
                ? `You have successfully unlocked the Early Starter milestone! `
                : `Refer more candidates to unlock your first reward (Smartphone). `}
              {joinedCount < 25 && `Complete ${nextGoal - joinedCount} more joins to grab the ${currentMilestone.reward}.`}
            </p>
            <div className="hero-progress-container">
              <div className="hp-header">
                <span>Progress to {joinedCount >= nextGoal ? 'Milestone' : 'next reward'}</span>
                <span>{joinedCount} / {nextGoal} Joins</span>
              </div>
              <div className="hp-bar"><div className="fill" style={{ width: `${progressPercent}%` }}></div></div>
            </div>
            <button className="btn btn-primary">View Reward Policy</button>
          </div>
          <div className="hero-icon">
            <Rocket size={120} />
          </div>
        </div>
      </div>

      <h2 className="sub-section-title">Your Milestone Journey</h2>
      <div className="milestones-path">
        {processedMilestones.map((m, i) => (
          <div key={m.id} className={`milestone-step ${m.completed ? 'completed' : ''} ${m.isNext ? 'active' : ''} ${m.locked ? 'locked' : ''}`}>
            <div className="step-marker">
              {m.completed ? <CheckCircle2 size={20} /> : m.isNext ? <Star size={20} /> : <Trophy size={20} />}
              {i < processedMilestones.length - 1 && <div className="connector-line"></div>}
            </div>
            <div className="step-card card">
              <div className="step-header">
                <div>
                  <h3>{m.title}</h3>
                  <p className="target">Target: {m.target}</p>
                </div>
                {m.completed && <span className="status-tag tag-green">Unlocked</span>}
                {m.isNext && <span className="status-tag tag-blue">In Progress</span>}
                {m.locked && <span className="status-tag tag-gray">Locked</span>}
              </div>
              <div className="step-body">
                <div className="reward-info">
                  <Gift size={20} className="text-blue" />
                  <div className="ri-text">
                    <p className="ri-label">Reward</p>
                    <p className="ri-val">{m.reward}</p>
                  </div>
                </div>
                {m.isNext && (
                  <div className="step-progress-mini">
                    <div className="sp-bar"><div className="fill" style={{ width: `${m.progress}%` }}></div></div>
                    <span>{Math.round(m.progress)}% Completed</span>
                  </div>
                )}
              </div>
              <div className="step-footer">
                {m.completed ? (
                  <button className="btn btn-outline btn-sm btn-block">Claim Details</button>
                ) : m.locked ? (
                  <button className="btn btn-text-gray btn-sm btn-block" disabled><TrendingUp size={14} /> Reach {m.target} to unlock</button>
                ) : (
                  <button className="btn btn-primary btn-sm btn-block">Refer Now</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="reward-slabs card">
        <div className="chart-header">
          <h3>Reward Slabs & Tiers</h3>
          <Info size={18} className="text-secondary" />
        </div>
        <div className="slabs-grid">
          <div className="slab-item">
            <span className="tier">Tier 1 (Silver)</span>
            <p className="ben">Base Incentive + 5% Bonus</p>
            <span className="req">Requires 5+ Active Candidates</span>
          </div>
          <div className="slab-item active">
            <span className="tier">Tier 2 (Gold)</span>
            <p className="ben">Base Incentive + 10% Bonus</p>
            <span className="req">Current Status</span>
          </div>
          <div className="slab-item">
            <span className="tier">Tier 3 (Platinum)</span>
            <p className="ben">Base Incentive + 20% Bonus</p>
            <span className="req">Requires 25+ Active Candidates</span>
          </div>
        </div>
      </div>

      <style>{`
        .points-badge { display: flex; align-items: center; gap: 8px; background: #FFF7ED; padding: 10px 16px; border: 1px solid #FFEDD5; border-radius: 40px; font-size: 14px; color: #9A3412; }
        
        .achievement-hero { background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border: 1px solid #BAE6FD; padding: 40px; margin-bottom: 40px; overflow: hidden; }
        .hero-content { display: flex; align-items: center; justify-content: space-between; gap: 40px; position: relative; }
        .hero-text { flex: 1; min-width: 0; }
        .hero-text h2 { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
        .hero-text p { font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px; max-width: 500px; }
        .hero-progress-container { margin-bottom: 24px; max-width: 400px; }
        .hp-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #0369A1; margin-bottom: 8px; }
        .hp-bar { height: 10px; background: white; border-radius: 5px; overflow: hidden; }
        .hp-bar .fill { height: 100%; background: var(--accent-blue); width: 40%; box-shadow: 0 0 10px rgba(59,130,246,0.5); }
        .hero-icon { color: #BFDBFE; opacity: 0.8; transform: rotate(15deg); }
        
        .sub-section-title { font-size: 18px; font-weight: 700; margin-bottom: 24px; }
        
        /* Milestone Journey Path */
        .milestones-path { display: flex; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
        .milestone-step { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 16px; position: relative; }
        .step-marker { width: 44px; height: 44px; border-radius: 50%; background: white; border: 2px solid #E2E8F0; display: flex; align-items: center; justify-content: center; color: #94A3B8; position: relative; z-index: 2; margin-left: auto; margin-right: auto; }
        .connector-line { position: absolute; top: 22px; left: calc(50% + 22px); width: calc(100% + 2px); height: 2px; background: #E2E8F0; z-index: 1; }
        
        .completed .step-marker { background: #F0FDF4; border-color: #10B981; color: #10B981; }
        .completed .connector-line { background: #10B981; }
        .active .step-marker { background: #EFF6FF; border-color: #3B82F6; color: #3B82F6; box-shadow: 0 0 15px rgba(59,130,246,0.3); }
        
        .step-card { padding: 20px; transition: 0.3s; height: 100%; }
        .step-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .step-header h3 { font-size: 15px; font-weight: 700; }
        .step-header .target { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .status-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; }
        .tag-green { background: #F0FDF4; color: #10B981; }
        .tag-blue { background: #EFF6FF; color: #3B82F6; }
        .tag-gray { background: #F1F5F9; color: #94A3B8; }
        
        .step-body { margin-bottom: 20px; }
        .reward-info { display: flex; align-items: center; gap: 12px; }
        .ri-label { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; }
        .ri-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        
        .step-progress-mini { margin-top: 16px; }
        .sp-bar { height: 4px; background: #F1F5F9; border-radius: 2px; margin-bottom: 6px; }
        .sp-bar .fill { height: 100%; background: var(--accent-blue); }
        .step-progress-mini span { font-size: 11px; font-weight: 600; color: var(--text-secondary); }
        
        .step-footer .btn-block { width: 100%; font-size: 12px; font-weight: 700; padding: 10px; }
        .btn-text-gray { background: #F8FAFC; color: #94A3B8; cursor: not-allowed; border: 1px solid #E2E8F0; }
        
        /* Reward Slabs */
        .reward-slabs { padding: 24px; }
        .slabs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 20px; }
        .slab-item { padding: 20px; border: 1px solid var(--border); border-radius: var(--radius-md); transition: 0.2s; }
        .slab-item.active { background: #EFF6FF; border-color: #3B82F6; box-shadow: 0 0 15px rgba(59,130,246,0.1); }
        .slab-item .tier { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }
        .slab-item .ben { font-size: 14px; font-weight: 700; margin: 8px 0; }
        .slab-item .req { font-size: 11px; color: var(--text-secondary); font-weight: 600; }
        .slab-item.active .req { color: var(--accent-blue); }

        @media (max-width: 1280px) {
          .milestones-path { grid-template-columns: 1fr 1fr; }
          .slabs-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AgentRewards;
