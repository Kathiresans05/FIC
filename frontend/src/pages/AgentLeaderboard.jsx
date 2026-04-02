import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Users, 
  Zap, 
  MapPin, 
  ArrowUpRight, 
  Search, 
  Filter,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const AgentLeaderboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState({ rank: '--', joins: 0 });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stats`);
        const stats = await res.json();
        const lb = stats.leaderboard || [];
        
        // Process top 3 for podium (Order: 2, 1, 3 for columns)
        const top1 = lb.find(a => a.rank === 1) || { rank: 1, name: '...', joins: 0, earnings: '0', badge: 'Gold', color: '#F59E0B' };
        const top2 = lb.find(a => a.rank === 2) || { rank: 2, name: '...', joins: 0, earnings: '0', badge: 'Silver', color: '#94A3B8' };
        const top3 = lb.find(a => a.rank === 3) || { rank: 3, name: '...', joins: 0, earnings: '0', badge: 'Bronze', color: '#B45309' };
        
        const formattedTop = [
          { ...top2, earnings: (top2.joins * 5000).toLocaleString() },
          { ...top1, earnings: (top1.joins * 5000).toLocaleString() },
          { ...top3, earnings: (top3.joins * 5000).toLocaleString() }
        ];
        setTopAgents(formattedTop);

        // Process rest of table
        const tableData = lb.map(a => ({
          ...a,
          earnings: (a.joins * 5000).toLocaleString(),
          referrals: a.joins * 3 // Mocked referrals for now
        }));
        setData(tableData);

        // Find my rank
        const self = tableData.find(a => a.name === user?.name);
        if (self) {
          setMyRank({ rank: self.rank, joins: self.joins });
        } else {
          // If not in top 10, use current user stats
          setMyRank({ rank: '>10', joins: stats.joinedThisMonth || 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user]);

  const columns = [
    { 
      header: 'Rank', 
      accessor: 'rank',
      render: (row) => (
        <span className={`rank-badge rank-${row.rank}`}>#{row.rank}</span>
      )
    },
    { 
      header: 'Agent Name', 
      accessor: 'name',
      render: (row) => (
        <div className="agent-cell-min">
          <div className="agent-avatar-sm">{row.name.charAt(0)}</div>
          <div>
            <p className="agent-name-text">{row.name}</p>
            <p className="agent-location-text"><MapPin size={10} /> {row.location}</p>
          </div>
        </div>
      )
    },
    { header: 'Referrals', accessor: 'referrals' },
    { 
      header: 'Joined', 
      accessor: 'joins',
      render: (row) => <span className="text-green font-bold">{row.joins}</span>
    },
    { 
      header: 'Earnings (₹)', 
      accessor: 'earnings',
      render: (row) => <span className="earnings-text">₹{row.earnings}</span>
    },
    { 
      header: 'Trend', 
      accessor: 'trend',
      render: () => <TrendingUp size={16} className="text-blue" />
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="content-wrapper agent-leaderboard">
      <div className="section-header">
        <div>
          <h1>Elite Agent Leaderboard</h1>
          <p className="text-secondary">Recognizing the top recruitment superstars across the Forge India network.</p>
        </div>
        <div className="header-actions">
           <div className="last-sync-badge">
             <Zap size={14} /> <span>Updated: 5 Mins Ago</span>
           </div>
        </div>
      </div>

      {/* Podium Section */}
      <div className="podium-container">
        {topAgents.map((agent) => (
          <div key={agent.id} className={`podium-position pos-${agent.rank}`}>
            <div className={` podium-card card animate-up delay-${agent.rank}`}>
              <div className="podium-rank-icon" style={{ backgroundColor: agent.color }}>
                {agent.rank === 1 ? <Trophy size={20} /> : <Medal size={20} />}
              </div>
              <div className="podium-avatar">
                {agent.name.charAt(0)}
                {agent.rank === 1 && <div className="crown-icon">👑</div>}
              </div>
              <h3 className="podium-name">{agent.name}</h3>
              <p className="podium-location">{agent.location}</p>
              
              <div className="podium-stats">
                <div className="ps-item">
                  <span className="ps-label">Joins</span>
                  <span className="ps-val">{agent.joins}</span>
                </div>
                <div className="ps-divider"></div>
                <div className="ps-item">
                  <span className="ps-label">Earnings</span>
                  <span className="ps-val">₹{agent.earnings}</span>
                </div>
              </div>
              
              <div className={`rank-pill-large rank-${agent.rank}`}>
                #{agent.rank} {agent.badge}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lb-controls">
        <div className="search-box-lb card">
          <Search size={18} />
          <input type="text" placeholder="Search for agents ranking..." />
        </div>
        <div className="lb-filters">
          <button className="btn btn-outline"><Filter size={18} /> Global Filters</button>
        </div>
      </div>

      <div className="card table-container-card">
        <DataTable columns={columns} data={data} showActions={false} />
      </div>

      {/* My Standing Section - Now Static below table */}
      <div className="my-standing-footer card animate-up">
        <div className="ms-main">
          <div className="ms-rank">
            <span className="ms-label">Your Current Rank</span>
            <p className="ms-val">#{myRank.rank}</p>
          </div>
          <div className="ms-info">
            <p><strong>{myRank.rank === 1 ? 'Amazing Work!' : 'Keep going,'} {user?.name?.split(' ')[0] || 'Rahul'}!</strong> {myRank.rank <= 10 ? `You are among the top performers!` : `You are ${myRank.rank === '>10' ? (data[9]?.joins || 10) - myRank.joins + 1 : 0} successful joins away from breaking into the Top 10.`}</p>
            <div className="ms-progress-mini">
              <div className="msp-bar"><div className="msp-fill" style={{ width: `${Math.min((myRank.joins / (data[0]?.joins || 20)) * 100, 100)}%` }}></div></div>
              <span>Status Track</span>
            </div>
          </div>
        </div>
        <div className="ms-action">
          <button className="btn btn-primary">Refer More Candidates <ArrowUpRight size={18} /></button>
        </div>
      </div>

      <style>{`
        .agent-leaderboard { padding-bottom: 120px; }
        
        /* Podium Styles */
        .podium-container { display: flex; align-items: flex-end; justify-content: center; gap: 24px; margin: 40px 0 60px; min-height: 420px; }
        .podium-position { flex: 1; max-width: 280px; }
        .podium-card { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 24px 24px; border-radius: var(--radius-lg); }
        
        .pos-1 { order: 2; transform: translateY(-20px); z-index: 5; }
        .pos-2 { order: 1; z-index: 4; }
        .pos-3 { order: 3; z-index: 3; }
        
        .pos-1 .podium-card { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; border: 2px solid #F59E0B; height: 420px; justify-content: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .pos-2 .podium-card { height: 340px; background: white; box-shadow: var(--shadow-md); }
        .pos-3 .podium-card { height: 300px; background: white; box-shadow: var(--shadow-sm); }
        
        .podium-rank-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; position: absolute; top: -25px; left: 50%; transform: translateX(-50%); box-shadow: 0 8px 16px rgba(0,0,0,0.15); z-index: 10; }
        
        .podium-avatar { width: 90px; height: 90px; border-radius: 50%; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; color: #1e293b; margin-bottom: 20px; position: relative; border: 4px solid white; box-shadow: var(--shadow-sm); }
        .pos-1 .podium-avatar { width: 110px; height: 110px; background: #FFEDD5; color: #D97706; border-color: #F59E0B; }
        .crown-icon { position: absolute; top: -30px; left: 50%; transform: translateX(-50%) rotate(-10deg); font-size: 36px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); }
        
        .podium-name { font-size: 20px; font-weight: 800; margin-bottom: 6px; color: #1E293B; }
        .pos-1 .podium-name { color: #FFFFFF; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .podium-location { font-size: 14px; color: #64748B; margin-bottom: 24px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px; }
        .pos-1 .podium-location { color: #94A3B8; }
        
        .podium-stats { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 12px 20px; background: #F8FAFC; border-radius: 40px; }
        .pos-1 .podium-stats { background: rgba(255,255,255,0.1); }
        .ps-item { display: flex; flex-direction: column; gap: 2px; }
        .ps-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94A3B8; }
        .ps-val { font-size: 15px; font-weight: 800; }
        .ps-divider { width: 1px; height: 24px; background: #E2E8F0; }
        .pos-1 .ps-divider { background: rgba(255,255,255,0.2); }
        
        .rank-pill-large { font-size: 12px; font-weight: 800; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-top: auto; }
        .rank-1 { background: #FFEDD5; color: #D97706; }
        .rank-2 { background: #F1F5F9; color: #475569; }
        .rank-3 { background: #FEF3C7; color: #B45309; }
        
        /* LB Controls */
        .lb-controls { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin: 48px 0 24px; }
        .search-box-lb { display: flex; align-items: center; gap: 12px; background: white; border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; flex: 1; max-width: 480px; box-shadow: var(--shadow-sm); }
        .search-box-lb input { border: none; background: none; outline: none; font-size: 14px; width: 100%; font-weight: 500; }
        
        .table-container-card { padding: 0; overflow: hidden; border: 1px solid var(--border); margin-bottom: 0; }
        .lb-bottom-spacer { display: none; }
        
        /* Table Style Overrides */
        .rank-badge { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 14px; }
        .rank-4 { color: #64748B; }
        .agent-cell-min { display: flex; align-items: center; gap: 12px; }
        .agent-avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; }
        .agent-name-text { font-size: 14px; font-weight: 700; color: #1E293B; }
        .agent-location-text { font-size: 11px; color: #94A3B8; display: flex; align-items: center; gap: 4px; }
        .earnings-text { font-weight: 800; color: #1E293B; }
        
        /* Static Rank Section - Integrated below table */
        .my-standing-footer { 
          margin-top: 24px;
          padding: 24px 40px; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          background: #0F172A; 
          color: white; 
          border: none; 
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15); 
          border-radius: 16px; 
          min-height: 80px;
          transition: all 0.3s ease;
        }
        .ms-main { display: flex; align-items: center; gap: 48px; flex: 1; }
        .ms-rank { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          padding-right: 32px; 
          border-right: 1.5px solid rgba(255, 255, 255, 0.1); 
          min-width: 130px; 
        }
        .ms-label { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.2px; line-height: 1; }
        .ms-val { font-size: 34px; font-weight: 900; color: var(--accent-orange); line-height: 1; margin-top: 6px; letter-spacing: -1px; }
        
        .ms-info { flex: 1; max-width: 520px; }
        .ms-info p { font-size: 13.5px; color: #CBD5E1; margin-bottom: 8px; font-weight: 500; line-height: 1.4; }
        .ms-progress-mini { display: flex; align-items: center; gap: 14px; }
        .msp-bar { flex: 1; height: 5px; background: rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden; }
        .msp-fill { height: 100%; background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%); box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
        .ms-progress-mini span { font-size: 11px; font-weight: 800; color: #F59E0B; width: 65px; }
        
        .ms-action { margin-left: 24px; }
        .ms-action .btn-primary { 
          padding: 10px 24px; 
          font-size: 13px;
          font-weight: 700; 
          border-radius: 40px;
          background: var(--accent-blue);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ms-action .btn-primary:hover {
          transform: translateY(-2px);
          background: #3B82F6;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }
        .ms-action .btn-primary:hover { 
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
          background: #FBBF24;
        }
        
        .last-sync-badge { font-size: 12px; font-weight: 700; color: var(--text-secondary); background: #F1F5F9; padding: 6px 14px; border-radius: 40px; display: flex; align-items: center; gap: 6px; }
        
        /* Animation */
        .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0s; }
        .delay-3 { animation-delay: 0.2s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 1024px) {
          .podium-container { flex-direction: column; align-items: center; height: auto; gap: 60px; margin-top: 60px; }
          .pos-1 { order: 1; transform: none; }
          .pos-2 { order: 2; }
          .pos-3 { order: 3; }
          .my-standing-footer { left: 16px; right: 16px; flex-direction: column; gap: 24px; text-align: center; }
          .ms-main { flex-direction: column; gap: 20px; }
        }
      `}</style>
    </div>
  );
};

export default AgentLeaderboard;
