import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserSquare2, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  MoreVertical,
  Loader2
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const AdminTeam = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'TeamMember',
    location: '',
    status: 'Active'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const role = activeTab === 'team' ? 'TeamMember' : 'Agent';
      const response = await fetch(`${API_BASE_URL}/api/users?role=${role}`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        role: activeTab === 'team' ? 'TeamMember' : 'Agent',
        status: activeTab === 'team' ? 'Active' : 'Pending'
      };

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', mobile: '', role: 'TeamMember', location: '', status: 'Active' });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.message}`);
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamColumns = [
    { 
      header: 'Member Name', 
      accessor: 'name',
      render: (row) => (
        <div className="user-cell">
          <div className="avatar-sm">{row.name.charAt(0)}</div>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-secondary">{row.role === 'TeamMember' ? 'Recruiter' : row.role}</p>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Assigned Jobs', accessor: 'assignedJobs' },
    { 
      header: 'Performance', 
      accessor: 'performance',
      render: (row) => (
        <div className="perf-cell">
          <span className="text-sm font-medium">{row.joins || 0} Joins</span>
          <div className="perf-bar"><div className="bar-fill" style={{ width: `${row.perf || 0}%` }}></div></div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <span className={`badge badge-${row.status === 'Active' ? 'green' : 'gray'}`}>{row.status}</span>
    }
  ];

  const agentColumns = [
    { 
      header: 'Agent Name', 
      accessor: 'name',
      render: (row) => (
        <div className="user-cell">
          <div className="avatar-sm bg-blue">{row.name.charAt(0)}</div>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-secondary">{row.location}</p>
          </div>
        </div>
      )
    },
    { header: 'Referrals', accessor: 'referrals' },
    { header: 'Converted', accessor: 'converted' },
    { 
      header: 'Earnings', 
      accessor: 'earnings',
      render: (row) => <span className="font-semibold">₹{row.earnings || 0}</span>
    },
    { 
      header: 'Rating', 
      accessor: 'rating',
      render: (row) => <span className="badge badge-orange">{row.rating || 0} ★</span>
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <span className={`badge badge-${row.status === 'Verified' ? 'green' : 'blue'}`}>{row.status}</span>
    }
  ];

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Team & Agent Management</h1>
          <p className="text-secondary">Manage internal consultancy team and external recruitment agents.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> {activeTab === 'team' ? 'Add Team Member' : 'Add New Agent'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={18} /> Consultancy Team
        </button>
        <button 
          className={`tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          <UserSquare2 size={18} /> External Agents
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Fetching {activeTab} data...</p>
        </div>
      ) : (
        <DataTable 
          columns={activeTab === 'team' ? teamColumns : agentColumns} 
          data={users} 
          actions={true} 
        />
      )}

      {/* Add Member/Agent Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'team' ? 'Add New Team Member' : 'Register New External Agent'}
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateUser} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : (activeTab === 'team' ? 'Add Member' : 'Register Agent')}
            </button>
          </>
        )}
      >
        <form className="modal-form" onSubmit={handleCreateUser}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Enter name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="email@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                placeholder="Set a login password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input 
                type="text" 
                required 
                placeholder="+91 XXXXX XXXXX" 
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
            {activeTab === 'agents' && (
              <div className="form-group">
                <label>Location / City</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Bangalore" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            )}
            {activeTab === 'team' && (
              <div className="form-group">
                <label>Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="TeamMember">Recruiter</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
            )}
          </div>
        </form>
      </Modal>

      <style>{`
        .user-cell { display: flex; align-items: center; gap: 12px; }
        .avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #64748B; font-size: 14px; }
        .avatar-sm.bg-blue { background: #DBEAFE; color: #2563EB; }
        
        .tabs-container { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border); }
        .tab-btn { display: flex; align-items: center; gap: 10px; padding: 12px 20px; font-size: 14px; font-weight: 600; color: var(--text-secondary); border-bottom: 2px solid transparent; transition: 0.2s; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; }
        .tab-btn:hover { color: var(--accent-blue); }
        .tab-btn.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }
        
        .perf-cell { display: flex; flex-direction: column; gap: 6px; width: 120px; }
        .perf-bar { height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--accent-blue); border-radius: 3px; }

        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default AdminTeam;
