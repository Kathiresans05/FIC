import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Phone,
  MessageSquare,
  History,
  Download
} from 'lucide-react';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const AgentReferrals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/candidates`);
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filter by referredBy (Agent Name)
          const myRefs = data.filter(c => c.referredBy === user?.name || !c.referredBy); // fallback to all for demo if name is not set
          setReferrals(myRefs.map(c => ({
            id: `CAN-${c._id?.slice(-4).toUpperCase()}`,
            name: c.name,
            job: c.jobId?.title || 'Unknown Role',
            verification: 'Verified', // Mocking verification for now
            status: c.status,
            incentive: c.status === 'Joined' ? 'Paid' : (['Selected'].includes(c.status) ? 'Approved' : 'Pending'),
            updated: new Date(c.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [user]);

  const columns = [
    { 
      header: 'Candidate Name', 
      accessor: 'name',
      render: (row) => (
        <div className="candidate-cell">
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-secondary">{row.id}</p>
        </div>
      )
    },
    { header: 'Job Applied', accessor: 'job' },
    { 
      header: 'Verification', 
      accessor: 'verification',
      render: (row) => (
        <span className={`badge badge-${row.verification === 'Verified' ? 'green' : 'orange'}`}>
          {row.verification}
        </span>
      )
    },
    { 
      header: 'Pipeline Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`badge badge-${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Incentive Status', 
      accessor: 'incentive',
      render: (row) => (
        <span className={`badge badge-${row.incentive === 'Paid' ? 'green' : row.incentive === 'Approved' ? 'blue' : 'gray'}`}>
          {row.incentive}
        </span>
      )
    },
    { header: 'Last Update', accessor: 'updated' }
  ];

  const getStatusColor = (status) => {
    const map = {
      'Lead Created': 'gray',
      'Contacted': 'blue',
      'Interview Scheduled': 'orange',
      'Selected': 'green',
      'Joined': 'green',
      'Rejected': 'red'
    };
    return map[status] || 'gray';
  };

  const data = [
    { id: 'CAN-8842', name: 'Amit Bajaj', job: 'Junior Java Dev', verification: 'Verified', status: 'Interview Scheduled', incentive: 'Pending', updated: 'Today, 11:30 AM' },
    { id: 'CAN-8850', name: 'Priya Verma', job: 'React Lead', verification: 'Verified', status: 'Selected', incentive: 'Approved', updated: 'Yesterday' },
    { id: 'CAN-8790', name: 'Sandeep Patil', job: 'BPO Executive', verification: 'Verified', status: 'Joined', incentive: 'Paid', updated: '2 days ago' },
    { id: 'CAN-8912', name: 'Anjali Rawat', job: 'HR Manager', verification: 'Pending', status: 'Lead Created', incentive: 'N/A', updated: '3 days ago' },
    { id: 'CAN-8905', name: 'Vikram Singh', job: 'Python Dev', verification: 'Verified', status: 'Rejected', incentive: 'N/A', updated: '1 week ago' },
  ];

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>My Referrals</h1>
          <p className="text-secondary">Track the real-time status of candidates you have referred.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-outline" 
            onClick={() => window.location.href = `${API_BASE_URL}/api/export`}
          >
            <Download size={18} /> Export History
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/agent/refer')}
          >
            <Users size={18} /> New Referral
          </button>
        </div>
      </div>

      <div className="referral-stats">
        <div className="card stat-mini">
          <span className="label">Total Submitted</span>
          <p className="val">{referrals.length}</p>
        </div>
        <div className="card stat-mini">
          <span className="label">In Pipeline</span>
          <p className="val">{referrals.filter(r => !['Joined', 'Rejected'].includes(r.status)).length}</p>
        </div>
        <div className="card stat-mini">
          <span className="label">Successful Joins</span>
          <p className="val">{referrals.filter(r => r.status === 'Joined').length}</p>
        </div>
        <div className="card stat-mini">
          <span className="label">Earned Rewards</span>
          <p className="val text-green">₹{(referrals.filter(r => r.status === 'Joined').length * 10000).toLocaleString()}</p>
        </div>
      </div>

      <DataTable columns={columns} data={referrals} actions={true} />

      <div className="help-section-referrals mt-32">
        <div className="card help-card">
          <div className="help-icon"><History size={24} /></div>
          <div className="help-text">
            <h3>How Referral Incentives Work?</h3>
            <p>Incentives are triggered at different stages. For example, you get ₹1,000 when an interview is attended and ₹10,000 when the candidate joins. Check <strong>Reward Slabs</strong> for details.</p>
            <button className="btn btn-text-blue">View Reward Policy <ExternalLink size={14} /></button>
          </div>
        </div>
      </div>

      <style>{`
        .referral-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .stat-mini { padding: 20px; text-align: center; }
        .stat-mini .label { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }
        .stat-mini .val { font-size: 24px; font-weight: 800; margin-top: 8px; }
        .text-green { color: #16A34A; }
        
        .mt-32 { margin-top: 32px; }
        .help-card { display: flex; gap: 24px; padding: 24px; background: #F8FAFC; border: 1px solid var(--border); }
        .help-icon { width: 56px; height: 56px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; color: var(--accent-blue); flex-shrink: 0; box-shadow: var(--shadow-sm); }
        .help-text h3 { font-size: 16px; margin-bottom: 4px; }
        .help-text p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px; }
        .btn-text-blue { padding: 0; color: var(--accent-blue); font-weight: 600; text-decoration: underline; background: none; display: flex; align-items: center; gap: 6px; font-size: 14px; }

        @media (max-width: 640px) {
          .referral-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .stat-mini {
            padding: 16px 12px;
          }
          .stat-mini .label {
            font-size: 10px;
          }
          .stat-mini .val {
            font-size: 18px;
          }
          .help-card {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentReferrals;
