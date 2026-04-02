import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart as PieChartIcon, 
  Filter, 
  Download, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import axios from 'axios';
import Modal from '../components/Modal';

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState('This Month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: { totalJoins: 0, activeJobs: 0, incentiveLiability: 0, avgTimeToHire: 0 },
    funnelData: [],
    sourceData: [],
    monthlyTrend: [],
    teamPerf: []
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const COLORS = ['#F59E0B', '#10B981', '#FCD34D', '#3B82F6', '#8B5CF6'];

  const fetchStats = async (range = timeRange) => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_BASE}/api/reports/stats?range=${range}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching report stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const handleRangeChange = (range) => {
    setTimeRange(range);
    setIsDropdownOpen(false);
  };

  const handleExport = () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    window.open(`${API_BASE}/api/reports/export`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Generating Analytics Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper reports-page">
      <div className="section-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-secondary">Comprehensive performance metrics for jobs, candidates, and team productivity.</p>
        </div>
        <div className="header-actions">
          <div className="dropdown-container">
            <div className="dropdown-lite" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Calendar size={16} /> <span>{timeRange}</span> <ChevronDown size={14} />
            </div>
            {isDropdownOpen && (
              <div className="range-dropdown shadow-lg">
                {['Today', 'This Week', 'This Month', 'This Year', 'All Time'].map(range => (
                  <div key={range} className="range-item" onClick={() => handleRangeChange(range)}>{range}</div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-outline" onClick={() => setIsFilterModalOpen(true)}><Filter size={18} /> Filters</button>
          <button className="btn btn-primary" onClick={handleExport}><Download size={18} /> Export Data</button>
        </div>
      </div>

      {/* Top Level Summary Stats */}
      <div className="top-stats-grid">
        <div className="card report-stat">
          <div className="rs-main">
            <span className="rs-label">Total Candidate Joins</span>
            <p className="rs-value">{data.summary.totalJoins}</p>
          </div>
          <div className="rs-trend up">
            <ArrowUpRight size={14} /> Live Data
          </div>
        </div>
        <div className="card report-stat">
          <div className="rs-main">
            <span className="rs-label">Avg. Time to Hire</span>
            <p className="rs-value">{data.summary.avgTimeToHire} Days</p>
          </div>
          <div className="rs-trend down">
            <ArrowDownRight size={14} /> Optimized
          </div>
        </div>
        <div className="card report-stat">
          <div className="rs-main">
            <span className="rs-label">Active Job Slots</span>
            <p className="rs-value">{data.summary.activeJobs}</p>
          </div>
          <div className="rs-trend up">
            <ArrowUpRight size={14} /> {data.summary.activeJobs} Openings
          </div>
        </div>
        <div className="card report-stat">
          <div className="rs-main">
            <span className="rs-label">Incentive Liability</span>
            <p className="rs-value">₹{(data.summary.incentiveLiability / 100000).toFixed(2)}L</p>
          </div>
          <div className="rs-trend up">
            <ArrowUpRight size={14} /> Current
          </div>
        </div>
      </div>

      <div className="reports-main-grid">
        {/* Full Hiring Funnel */}
        <div className="card chart-card col-span-2">
          <div className="chart-header">
            <h3>Hiring Funnel Distribution</h3>
            <p className="text-secondary">Candidate drop-off analysis across recruitment stages</p>
          </div>
          <div className="funnel-container chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.funnelData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} />
                <Tooltip cursor={{fill: '#F8FAFC'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {data.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Candidate Sourcing Channels</h3>
          </div>
          <div className="chart-container flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card chart-card col-span-2">
          <div className="chart-header">
            <h3>Monthly Target Tracking</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeDasharray="5 5" name="Projected" />
                <Line type="monotone" dataKey="achieved" stroke="#F59E0B" strokeWidth={3} activeDot={{ r: 8 }} name="Achieved Joins" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Leaderboard Performance */}
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Team Success Metric</h3>
          </div>
          <div className="performance-list">
            {data.teamPerf.map((person, i) => (
              <div key={i} className="perf-item-row">
                <div className="pi-info">
                  <p className="pi-name">{person.name}</p>
                  <span className="pi-joins">{person.joins} Joins</span>
                </div>
                <div className="pi-bar-box">
                  <div className="pi-bar"><div className="pi-fill" style={{ width: `${person.performance}%` }}></div></div>
                  <span className="pi-val">{Math.round(person.performance)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .top-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .report-stat { padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; border: 1px solid var(--border); }
        .rs-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        .rs-value { font-size: 28px; font-weight: 800; color: var(--text-primary); margin-top: 4px; }
        .rs-trend { font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; width: fit-content; }
        .rs-trend.up { color: #16A34A; background: #F0FDF4; }
        .rs-trend.down { color: #DC2626; background: #FEF2F2; }
        
        .reports-main-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .col-span-2 { grid-column: span 2; }
        .chart-card { border: 1px solid var(--border); }
        .chart-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 24px;
        }
        .chart-header h3 { 
          font-size: 18px; 
          font-weight: 700; 
          color: var(--text-primary);
        }
        .chart-header p {
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 100%;
        }
        
        .performance-list { display: flex; flex-direction: column; gap: 20px; padding: 0 24px 24px; }
        .perf-item-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .pi-info { flex: 1; }
        .pi-name { font-weight: 700; color: var(--text-primary); font-size: 14px; margin-bottom: 2px; }
        .pi-joins { color: var(--text-secondary); font-size: 12px; font-weight: 500;}
        .pi-bar-box { width: 140px; display: flex; align-items: center; gap: 12px; }
        .pi-bar { flex: 1; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
        .pi-fill { height: 100%; background: var(--accent-orange); }
        .pi-val { font-size: 12px; font-weight: 700; color: var(--text-primary); width: 32px; text-align: right; }
        
        .dropdown-lite { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid var(--border); padding: 8px 12px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .dropdown-lite:hover { border-color: var(--accent-blue); background: #F8FAFF; }
        .dropdown-container { position: relative; }
        .range-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid var(--border); border-radius: 12px; width: 180px; z-index: 100; padding: 6px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .range-item { padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748B; cursor: pointer; border-radius: 8px; transition: 0.2s; }
        .range-item:hover { background: #F0F7FF; color: var(--accent-blue); }

        .filter-modal-content { padding: 10px 0; }
        .filter-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-label-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .filter-label-row label { font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-label-row svg { color: var(--accent-blue); opacity: 0.7; }
        
        .elite-select { 
          width: 100%; 
          padding: 12px 16px; 
          background: #F8FAFC; 
          border: 1.5px solid #E2E8F0; 
          border-radius: 12px; 
          font-size: 14px; 
          font-weight: 600; 
          color: var(--text-primary); 
          outline: none; 
          transition: all 0.2s;
          cursor: pointer;
        }
        .elite-select:focus { border-color: var(--accent-blue); background: white; box-shadow: 0 0 0 4px rgba(37,99,235,0.06); }
        .elite-select:hover { border-color: #CBD5E1; }
        
        @media (max-width: 1280px) {
          .reports-main-grid { grid-template-columns: 1fr; }
          .col-span-2 { grid-column: span 1; }
        }
      `}</style>

      <Modal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        title="Apply Analytics Filters"
        footer={(
          <>
            <button className="btn btn-outline" style={{ borderRadius: '10px' }} onClick={() => setIsFilterModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ borderRadius: '10px' }} onClick={() => setIsFilterModalOpen(false)}>Apply Filters</button>
          </>
        )}
      >
        <div className="filter-modal-content">
          <div className="filter-grid">
            <div className="filter-group">
              <div className="filter-label-row">
                <BarChart3 size={16} />
                <label>Job Role / Position</label>
              </div>
              <select className="elite-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option>All Positions</option>
                <option>Sales Executive</option>
                <option>Delivery Partner</option>
                <option>Software Engineer</option>
                <option>Warehouse Worker</option>
              </select>
            </div>
            
            <div className="filter-group">
              <div className="filter-label-row">
                <Users size={16} />
                <label>Sourcing Channel</label>
              </div>
              <select className="elite-select">
                <option>All Channels</option>
                <option>Direct Application</option>
                <option>Agent Referral</option>
                <option>Internal Referral</option>
                <option>LinkedIn / Social</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReports;
