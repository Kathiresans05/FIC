import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Monitor,
  Landmark,
  Headphones,
  Briefcase,
  Users,
  CheckCircle2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import API_BASE_URL from '../api/config';
import DataTable from '../components/DataTable';

const TeamJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
    fetchJobs();
  }, []);

  const columns = [
    { 
      header: 'Job ID & Title', 
      accessor: '_id',
      render: (row) => (
        <div className="job-info">
          <p className="job-id-text">ID: {row._id ? row._id.substring(row._id.length - 8).toUpperCase() : 'N/A'}</p>
          <p className="job-title-text">{row.title}</p>
        </div>
      )
    },
    { header: 'Company', accessor: 'company' },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => <span className="text-secondary" style={{ fontSize: '13px' }}>{row.category}</span>
    },
    { header: 'Location', accessor: 'location' },
    { 
      header: 'Experience', 
      accessor: 'experience',
      render: (row) => <span className="text-secondary">{row.experience || 'Fresher'}</span>
    },
    { 
      header: 'Vacancies', 
      accessor: 'vacancies',
      render: (row) => <span className="font-semibold">{row.vacancies || 1}</span>
    },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (row) => (
        <span className={`badge badge-${row.priority === 'High' ? 'red' : row.priority === 'Medium' ? 'orange' : 'gray'}`}>
          {row.priority || 'Medium'}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`badge badge-${row.status === 'Open' ? 'green' : (row.status === 'Hold' ? 'orange' : 'gray')}`}>
          {row.status || 'Open'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-accent-blue" size={40} />
      </div>
    );
  }

  return (
    <div className="content-wrapper team-jobs">
      <div className="section-header">
        <div>
          <h1>Job Vacancies</h1>
          <p className="text-secondary">View and manage recruitment pipelines for your assigned positions.</p>
        </div>
        <div className="header-actions">
          <div className="search-box-md">
            <Search size={18} />
            <input type="text" placeholder="Search vacancies..." />
          </div>
          <button className="btn btn-outline"><Filter size={18} /> Filters</button>
        </div>
      </div>

      <div className="all-jobs-table animate-slide-in shadow-sm">
        <DataTable columns={columns} data={jobs} />
      </div>

      <style>{`
        .job-info { display: flex; flex-direction: column; gap: 4px; }
        .job-id-text { font-size: 11px; color: var(--text-secondary); font-weight: 500; margin: 0; }
        .job-title-text { font-weight: 600; color: var(--text-primary); margin: 0; }
        .font-semibold { font-weight: 600; }
        
        /* Badges */
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
        .badge-red { background: #FEF2F2; color: #DC2626; border: 1px solid #FEE2E2; }
        .badge-orange { background: #FFF7ED; color: #EA580C; border: 1px solid #FFEDD5; }
        .badge-green { background: #F0FDF4; color: #16A34A; border: 1px solid #DCFCE7; }
        .badge-gray { background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0; }
        
        .search-box-md { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 8px 12px; flex: 1; max-width: 400px; }
        .search-box-md input { border: none; background: none; outline: none; font-size: 14px; width: 100%; }
        
        .all-jobs-table { margin-top: 10px; background: white; border-radius: var(--radius-lg); }
        .animate-slide-in { animation: slideIn 0.4s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default TeamJobs;
