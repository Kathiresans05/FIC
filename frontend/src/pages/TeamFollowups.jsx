import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  History,
  Calendar,
  ExternalLink
} from 'lucide-react';
import DataTable from '../components/DataTable';

import API_BASE_URL from '../api/config';

const TeamFollowups = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates`);
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Grouping candidates
  const scheduledToday = candidates.filter(c => {
    if (!c.followupDate) return false;
    const fDate = new Date(c.followupDate);
    return fDate >= today && fDate < tomorrow;
  });

  const resolvedWeek = candidates.filter(c => {
    const resolvedStatuses = ['Interested', 'Not Interested', 'Joined', 'Rejected'];
    if (!resolvedStatuses.includes(c.status)) return false;
    const updateDate = new Date(c.updatedAt || c.createdAt);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    return updateDate >= lastWeek;
  });

  const overdue = candidates.filter(c => {
    if (!c.followupDate) return false;
    const fDate = new Date(c.followupDate);
    const resolvedStatuses = ['Interested', 'Not Interested', 'Joined', 'Rejected'];
    return fDate < today && !resolvedStatuses.includes(c.status);
  });

  const pending = candidates.filter(c => {
    const pendingStatuses = ['Pending', 'Follow-up', 'No Answer', 'Called'];
    const isPendingStatus = pendingStatuses.includes(c.status) || !c.status;
    const notScheduledOrResolved = !scheduledToday.some(s => s._id === c._id) && !resolvedWeek.some(r => r._id === c._id);
    return isPendingStatus && notScheduledOrResolved;
  });

  let activeDataRaw = [];
  if (activeTab === 'pending') activeDataRaw = pending;
  else if (activeTab === 'scheduled') activeDataRaw = scheduledToday;
  else if (activeTab === 'history') activeDataRaw = resolvedWeek;

  const followups = activeDataRaw.map(c => ({
    id: c._id,
    name: c.name,
    phone: c.phone || 'N/A',
    job: c.jobId?.title || 'Unknown Role',
    lastAttemp: c.lastContacted ? new Date(c.lastContacted).toLocaleDateString() : 'Never',
    reason: c.notes || (c.status === 'Follow-up' ? 'Follow-up requested' : c.status || 'Pending'),
    priority: c.followupDate ? 'High' : 'Medium',
    rawPhone: c.phone
  }));

  const columns = [
    { 
      header: 'Candidate', 
      accessor: 'name',
      render: (row) => (
        <div className="candidate-cell">
          <div className="avatar-sm">{row.name.charAt(0)}</div>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-secondary">{row.job}</p>
          </div>
        </div>
      )
    },
    { header: 'Last Attempt', accessor: 'lastAttemp' },
    { 
      header: 'Follow-up Reason', 
      accessor: 'reason',
      render: (row) => <span className="text-sm italic text-secondary">"{row.reason}"</span>
    },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (row) => <span className={`badge badge-${row.priority === 'High' ? 'red' : row.priority === 'Medium' ? 'orange' : 'gray'}`}>{row.priority}</span>
    },
    {
      header: 'Quick Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex gap-2">
          <button className="icon-btn-sm text-blue" title="Call Now" onClick={() => row.rawPhone && window.open(`tel:${row.rawPhone.replace(/\s/g, '')}`)}><Phone size={14} /></button>
          <button className="icon-btn-sm text-green" title="WhatsApp" onClick={() => row.rawPhone && window.open(`https://wa.me/91${row.rawPhone.replace(/\s/g, '')}`, '_blank')}><MessageSquare size={14} /></button>
          <button className="icon-btn-sm" title="View Profile"><ExternalLink size={14} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="content-wrapper team-followups">
      <div className="section-header">
        <div>
          <h1>Follow-ups & Calling Queue</h1>
          <p className="text-secondary">Candidates who need a callback or haven't responded to previous attempts.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/team/candidates'}
          >
            <Phone size={18} /> Start Auto-Dialer
          </button>
        </div>
      </div>

      <div className="followup-stats">
        <div className="card mini-stat-item">
          <div className="ms-icon bg-orange-lite"><Clock size={20} /></div>
          <div>
            <p className="ms-value">{scheduledToday.length}</p>
            <p className="ms-label">Due Today</p>
          </div>
        </div>
        <div className="card mini-stat-item">
          <div className="ms-icon bg-red-lite"><AlertCircle size={20} /></div>
          <div>
            <p className="ms-value">{overdue.length}</p>
            <p className="ms-label">Overdue</p>
          </div>
        </div>
        <div className="card mini-stat-item">
          <div className="ms-icon bg-green-lite"><CheckCircle2 size={20} /></div>
          <div>
            <p className="ms-value">{resolvedWeek.length}</p>
            <p className="ms-label">Resolved (Week)</p>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending ({pending.length})</button>
        <button className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`} onClick={() => setActiveTab('scheduled')}>Scheduled Today ({scheduledToday.length})</button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Resolved ({resolvedWeek.length})</button>
      </div>

      <DataTable columns={columns} data={followups} actions={false} />

      <style>{`
        .followup-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .mini-stat-item { display: flex; align-items: center; gap: 16px; padding: 24px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .ms-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .bg-orange-lite { background: #FFF7ED; color: #F59E0B; }
        .bg-red-lite { background: #FEF2F2; color: #EF4444; }
        .bg-green-lite { background: #F0FDF4; color: #10B981; }
        .ms-value { font-size: 24px; font-weight: 700; color: var(--text-primary); }
        .ms-label { font-size: 13px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-top: 4px; }
        
        .candidate-cell { display: flex; align-items: center; gap: 12px; }
        .avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-secondary); font-size: 14px; }
        
        .tabs-container { display: flex; gap: 12px; border-bottom: 1px solid var(--border); margin-bottom: 24px; padding-bottom: 2px; }
        .tab-btn { padding: 12px 24px; font-size: 14px; font-weight: 600; color: var(--text-secondary); border-bottom: 2px solid transparent; transition: 0.2s; background: none; border: none; cursor: pointer; }
        .tab-btn:hover { color: var(--text-primary); background: #F8FAFC; }
        .tab-btn.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); background: #F8FAFF; }
        
        .flex { display: flex; }
        .gap-2 { gap: 10px; }
        
        @media (max-width: 768px) {
          .followup-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .mini-stat-item { padding: 16px; flex-direction: column; text-align: center; }
          .tabs-container { overflow-x: auto; white-space: nowrap; }
          .tab-btn { padding: 10px 16px; }
        }
      `}</style>
    </div>
  );
};

export default TeamFollowups;
