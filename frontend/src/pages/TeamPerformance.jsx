import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Coins, 
  Clock, 
  Award, 
  BarChart3, 
  Calendar,
  ChevronDown
} from 'lucide-react';
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
import KpiCard from '../components/KpiCard';
import API_BASE_URL from '../api/config';

const TeamPerformance = () => {
  const [timeRange, setTimeRange] = useState('This Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const ranges = ['This Week', 'This Month', 'This Quarter', 'This Year'];

  const weeklyData = stats?.weeklyActivity || [
    { day: 'Mon', joins: 0, calls: 0 },
    { day: 'Tue', joins: 0, calls: 0 },
    { day: 'Wed', joins: 0, calls: 0 },
    { day: 'Thu', joins: 0, calls: 0 },
    { day: 'Fri', joins: 0, calls: 0 },
    { day: 'Sat', joins: 0, calls: 0 },
    { day: 'Sun', joins: 0, calls: 0 }
  ];

  const getFunnel = (name) => stats?.funnelData?.find(f => f.name === name)?.value || 0;
  const leads = getFunnel('Applied');
  const contacted = getFunnel('Screening');
  const interviewed = getFunnel('Interviewing');
  const selected = getFunnel('Offered');
  const joined = getFunnel('Joined');
  
  const totalFunnelLeads = leads + contacted + interviewed + selected + joined;
  const leadToJoinRate = totalFunnelLeads > 0 ? ((joined / totalFunnelLeads) * 100).toFixed(1) : 0;
  const targetProgress = stats ? Math.min(100, Math.floor((stats.joinedThisMonth / (stats.monthlyTarget?.goal || 20)) * 100)) : 0;

  const myRankObj = stats?.leaderboard?.find(l => typeof l.name === 'string' && l.name.toLowerCase() === 'organic') || stats?.leaderboard?.[0] || { rank: 1, joins: '0 Joins' };

  return (
    <div className="content-wrapper team-performance">
      <div className="section-header">
        <div>
          <h1>My Performance Dashboard</h1>
          <p className="text-secondary">Track your recruitment metrics, incentives, and monthly targets.</p>
        </div>
        <div className="header-actions">
          <div className="dropdown-container" style={{ position: 'relative' }}>
            <div 
              className="date-picker-lite" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Calendar size={16} /> <span>{timeRange}</span> <ChevronDown size={14} />
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {ranges.map(range => (
                  <div 
                    key={range} 
                    className={`dropdown-item ${timeRange === range ? 'active' : ''}`}
                    onClick={() => {
                      setTimeRange(range);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {range}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => window.open(`${API_BASE_URL}/api/export`, '_blank')}
          >
            <BarChart3 size={18} /> Download Detailed Report
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Monthly Joins" value={stats?.joinedThisMonth?.toString() || '0'} icon={CheckCircle2} trend="up" trendValue="2" color="green" />
        <KpiCard title="Target Progress" value={`${targetProgress}%`} icon={Target} trend="up" trendValue="5" color="blue" />
        <KpiCard title="Calls Connected" value={stats?.connected?.toString() || '0'} icon={TrendingUp} trend="up" trendValue="15" color="purple" />
        <KpiCard title="Total Incentives" value={stats?.incentivesPaid || '₹0'} icon={Coins} trend="up" trendValue="10" color="blue" />
      </div>

      <div className="performance-charts-grid">
        <div className="card chart-card col-span-2">
          <div className="chart-header">
            <h3>Weekly Joins & Activity</h3>
            <p className="text-secondary">Number of successful joins achieved this week</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorJoins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="joins" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorJoins)" name="Successful Joins" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card rank-card">
          <div className="rank-header">
            <Award size={32} className="text-gold" />
            <div className="rank-info">
              <h3>Monthly Ranking</h3>
              <p>Top Performance Tier</p>
            </div>
          </div>
          <div className="rank-badge-box">
            <div className="circle-rank">
              <span className="rank-num">#{myRankObj.rank}</span>
              <span className="rank-total">of 15</span>
            </div>
          </div>
          <div className="rank-footer">
            <p>You have secured <strong>{myRankObj.joins}</strong> this month. Keep it up!</p>
          </div>
        </div>
      </div>

      <div className="card conversion-metrics">
        <div className="chart-header">
          <h3>Conversion Funnel (My Cases)</h3>
        </div>
        <div className="metrics-row">
          <div className="metric-box">
            <p className="m-val">{totalFunnelLeads}</p>
            <p className="m-lbl">Total Leads</p>
          </div>
          <div className="metric-sep">&gt;</div>
          <div className="metric-box">
            <p className="m-val">{contacted}</p>
            <p className="m-lbl">Contacted</p>
          </div>
          <div className="metric-sep">&gt;</div>
          <div className="metric-box">
            <p className="m-val">{interviewed}</p>
            <p className="m-lbl">Interviewed</p>
          </div>
          <div className="metric-sep">&gt;</div>
          <div className="metric-box">
            <p className="m-val">{selected}</p>
            <p className="m-lbl">Selected</p>
          </div>
          <div className="metric-sep">&gt;</div>
          <div className="metric-box text-blue">
            <p className="m-val">{joined}</p>
            <p className="m-lbl">Joined</p>
          </div>
        </div>
        <div className="metrics-avg text-secondary">
          <TrendingUp size={16} /> Your lead-to-join conversion rate is <strong>{leadToJoinRate}%</strong> (Team Avg: 6.5%)
        </div>
      </div>

      <style>{`
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        
        .performance-charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
        .col-span-2 { grid-column: span 2; }
        .chart-header { padding: 24px; border-bottom: 1px solid var(--border); }
        .chart-header h3 { font-size: 16px; font-weight: 700; }
        .chart-container { padding: 24px; }
        
        .rank-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px; }
        .rank-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; text-align: left; width: 100%; }
        .text-gold { color: #EAB308; }
        .circle-rank { width: 120px; height: 120px; border-radius: 50%; border: 8px solid #EFF6FF; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; box-shadow: var(--shadow-sm); }
        .rank-num { font-size: 32px; font-weight: 800; color: var(--accent-blue); }
        .rank-total { font-size: 12px; color: var(--text-secondary); font-weight: 600; }
        .rank-footer { margin-top: 24px; font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
        
        .conversion-metrics { padding: 0; }
        .metrics-row { display: flex; justify-content: space-around; align-items: center; padding: 32px 24px; }
        .metric-box { text-align: center; }
        .m-val { font-size: 24px; font-weight: 800; color: var(--text-primary); }
        .m-lbl { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; margin-top: 4px; }
        .metric-sep { font-size: 20px; color: #E2E8F0; font-weight: 300; }
        .metrics-avg { padding: 16px 24px; background: #F8FAFC; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 13px; }
        
        .date-picker-lite { display: flex; flex-direction: row; align-items: center; gap: 8px; background: white; border: 1px solid var(--border); padding: 10px 16px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; width: max-content; }
        .dropdown-menu { position: absolute; top: 110%; right: 0; background: white; border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-md); z-index: 100; min-width: 150px; padding: 8px 0; }
        .dropdown-item { padding: 10px 16px; font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: 0.2s; }
        .dropdown-item:hover { background: #F8FAFC; color: var(--text-primary); }
        .dropdown-item.active { background: #EFF6FF; color: var(--accent-blue); }

        @media (max-width: 1280px) {
          .performance-charts-grid { grid-template-columns: 1fr; }
          .col-span-2 { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default TeamPerformance;
