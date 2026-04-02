import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  UserPlus, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Coins, 
  Trophy,
  Loader2,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import API_BASE_URL from '../api/config';
import DataTable from '../components/DataTable';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    todayNewJobs: 0,
    todayInterviews: 0,
    joinedThisMonth: 0,
    incentivesPaid: '₹0',
    funnelData: [],
    joiningTrend: [],
    recentActivity: [],
    performanceData: [],
    upcomingPayouts: []
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [vacancyData, setVacancyData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '',
    vacancies: 1,
    category: 'Information Technology'
  });

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();
      setStats(prev => ({
        ...prev,
        ...data,
        funnelData: data.funnelData || [],
        joiningTrend: data.joiningTrend || [],
        recentActivity: data.recentActivity || [],
        performanceData: data.performanceData || [],
        upcomingPayouts: data.upcomingPayouts || []
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchJobs();
  }, []);

  const handleExport = () => {
    window.open(`${API_BASE_URL}/api/export`, '_blank');
  };

  const handleInputChange = (e) => {
    setVacancyData({ ...vacancyData, [e.target.name]: e.target.value });
  };

  const handleCreateVacancy = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacancyData)
      });
      const result = await response.json();
      if (response.ok) {
        setIsModalOpen(false);
        setVacancyData({ title: '', company: '', location: '', salary: '', experience: '', vacancies: 1, category: 'Information Technology' });
        fetchStats();
        fetchJobs();
      } else {
        const errorMsg = result.errors ? result.errors.join('\n') : (result.message || 'Unknown error');
        alert(`Failed to create vacancy:\n${errorMsg}`);
      }
    } catch (error) {
      console.error('Error creating vacancy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobColumns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Company', accessor: 'company' },
    { header: 'Location', accessor: 'location' },
    { header: 'Category', accessor: 'category' }
  ];

  return (
    <div className="content-wrapper admin-home">
      <div className="section-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-secondary">Overview of recruitment operations and performance highlights.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleExport}>Export Report</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><UserPlus size={18} /> New Vacancy</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Active Jobs" value={loading ? "..." : stats.activeJobs.toString()} icon={Briefcase} trend="up" trendValue={loading ? "0" : "12"} color="orange" />
        <KpiCard title="Total Candidates" value={loading ? "..." : stats.totalCandidates.toLocaleString()} icon={Users} trend="up" trendValue={loading ? "0" : "8"} color="purple" />
        <KpiCard title="Today New Jobs" value={loading ? "..." : stats.todayNewJobs.toString()} icon={UserPlus} trend="up" trendValue={loading ? "0" : "2"} color="orange" />
        <KpiCard title="Interview Today" value={loading ? "..." : stats.todayInterviews.toString()} icon={Calendar} trend="down" trendValue={loading ? "0" : "5"} color="red" />
        <KpiCard title="Joined This Month" value={loading ? "..." : stats.joinedThisMonth.toString()} icon={CheckCircle2} trend="up" trendValue={loading ? "0" : "22"} color="green" />
        <KpiCard title="Incentives Paid" value={stats.incentivesPaid} icon={Coins} trend="up" trendValue="15" color="orange" />
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Hiring Funnel</h3>
            <p className="text-secondary">Conversion rates across different stages</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <h3>Monthly Joining Trend</h3>
            <p className="text-secondary">Successful joins over the last 6 months</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.joiningTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card activity-card">
          <div className="chart-header">
            <h3>Recent Candidate Activity</h3>
            <button className="text-accent btn-text">View All</button>
          </div>
          <div className="activity-list">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ backgroundColor: `var(--accent-${activity.status})` }}></div>
                  <div className="activity-info">
                    <p className="activity-text"><strong>{activity.name}</strong> - {activity.action}</p>
                    <span className="activity-time">{formatTimeAgo(activity.time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        <div className="card chart-card col-span-2">
          <div className="chart-header">
            <h3>Top Performing Executives</h3>
            <p className="text-secondary">Comparing successful joins and revenue</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#F59E0B" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="joins" fill="#F59E0B" name="Joins" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card payout-card">
          <div className="chart-header">
            <h3>Upcoming Payouts</h3>
            <button className="text-accent btn-text">Review All</button>
          </div>
          <div className="payout-list">
            {stats.upcomingPayouts.length > 0 ? (
              stats.upcomingPayouts.map((payout, i) => (
                <div key={i} className="payout-item">
                  <div className="payout-info">
                    <p className="payout-id">{payout.id}</p>
                    <p className="payout-user">{payout.user}</p>
                  </div>
                  <div className="payout-amount text-right">
                    <p className="amount-val">{payout.amount}</p>
                    <p className="amount-date">{payout.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary text-center py-4">No pending payouts</p>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container animate-slide-in">
            <div className="modal-header">
              <h3>Create New Vacancy</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form className="modal-form" onSubmit={handleCreateVacancy}>
              <div className="form-group">
                <label>Job Title</label>
                <input name="title" value={vacancyData.title} onChange={handleInputChange} placeholder="e.g. Senior Frontend Developer" required />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input name="company" value={vacancyData.company} onChange={handleInputChange} placeholder="e.g. Google India" required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={vacancyData.location} onChange={handleInputChange} placeholder="City or Remote" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={vacancyData.category} onChange={handleInputChange}>
                    <option>Information Technology</option>
                    <option>Banking</option>
                    <option>Sales</option>
                    <option>Corporate</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Salary Slab</label>
                  <input name="salary" value={vacancyData.salary} onChange={handleInputChange} placeholder="e.g. 15-20 LPA" required />
                </div>
                <div className="form-group">
                  <label>Experience Required</label>
                  <input name="experience" value={vacancyData.experience} onChange={handleInputChange} placeholder="e.g. 5-8 Years" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Vacancy'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-container { background: white; width: 100%; max-width: 540px; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .modal-header { padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 20px; font-weight: 800; color: #1E293B; }
        .close-btn { background: #F1F5F9; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: 0.2s; }
        .close-btn:hover { background: #E2E8F0; color: #0F172A; }
        .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .modal-footer { padding: 20px 24px 24px; display: flex; justify-content: flex-end; gap: 12px; }
        .modal-form input, .modal-form select { padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; font-size: 14px; background: #F8FAFC; width: 100%; box-sizing: border-box; }
        .modal-form input:focus { border-color: #F59E0B; background: white; outline: none; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-slide-in { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .col-span-2 { grid-column: span 2; }
        .activity-list, .payout-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .activity-item { display: flex; gap: 12px; align-items: center; }
        .activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .payout-item { display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
