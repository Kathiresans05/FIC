import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Gift, 
  Rocket, 
  Plus, 
  ChevronRight, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  History,
  Loader2,
  Trash2
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const AdminRewards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  const initialFormState = {
    title: '',
    criteria: 'Joins in a Month',
    targetValue: '',
    rewardDesc: '',
    eligibility: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rewards`);
      const data = await response.json();
      setRewards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/achievements`);
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchAchievements();
  }, []);

  const openCreateModal = () => {
    setEditingReward(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      criteria: reward.criteria,
      targetValue: reward.targetValue,
      rewardDesc: reward.rewardDesc,
      eligibility: reward.eligibility || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.criteria || !formData.targetValue || !formData.rewardDesc) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingReward 
        ? `${API_BASE_URL}/api/rewards/${editingReward._id}` 
        : `${API_BASE_URL}/api/rewards`;
      
      const method = editingReward ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchRewards();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.message}`);
      }
    } catch (error) {
      alert('Network error while saving reward');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingReward) return;
    if (!window.confirm('Are you sure you want to delete this reward milestone?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/rewards/${editingReward._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchRewards();
      } else {
        alert('Error deleting reward');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const columns = [
    { 
      header: 'Achiever Name', 
      accessor: 'name',
      render: (row) => (
        <div className="achiever-cell">
          <div className="avatar-sm">{row.name.charAt(0)}</div>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-secondary">{row.role}</p>
          </div>
        </div>
      )
    },
    { header: 'Milestone Attained', accessor: 'milestone' },
    { header: 'Date Achieved', accessor: 'date' },
    { 
      header: 'Reward Status', 
      accessor: 'rewardStatus',
      render: (row) => (
        <span className={`badge badge-${row.rewardStatus === 'Claimed' ? 'green' : row.rewardStatus === 'Dispatched' ? 'blue' : 'orange'}`}>
          {row.rewardStatus}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: () => <button className="icon-btn-sm"><MoreVertical size={16} /></button>
    }
  ];

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Rewards & Milestones Management</h1>
          <p className="text-secondary">Define and track specialized rewards that go beyond standard incentives.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> New Milestone
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px', gap: '16px', color: '#64748B' }}>
          <Loader2 className="animate-spin text-accent-blue" size={40} />
          <p>Fetching active rewards...</p>
        </div>
      ) : (
        <div className="milestones-grid">
          {rewards.map((m, index) => (
            <div key={m._id} className="card milestone-admin-card">
              <div className="m-icon-box">
                {index % 3 === 0 ? <Rocket size={24} className="text-blue" /> : index % 3 === 1 ? <Gift size={24} className="text-purple" /> : <Trophy size={24} className="text-gold" />}
              </div>
              <div className="m-content">
                <h3>{m.title}</h3>
                <p className="criteria">{m.targetValue} {m.criteria}</p>
                <div className="reward-tag">
                  <Gift size={14} /> {m.rewardDesc}
                </div>
              </div>
              <div className="m-footer">
                <span className="stats"><Users size={14} /> <strong>{m.achievers || 0}</strong> Achievers</span>
                <button className="icon-btn-sm" onClick={() => openEditModal(m)} title="View & Edit Reward"><ChevronRight size={18} /></button>
              </div>
            </div>
          ))}
          {rewards.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', border: '2px dashed #CBD5E1', borderRadius: '12px', color: '#64748B' }}>
              <Gift size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No rewards created yet. Click "New Milestone" to get started.</p>
            </div>
          )}
        </div>
      )}

      <div className="card achievers-list-card">
        <div className="chart-header">
          <h3>Recent Achievement Log</h3>
          <button className="btn btn-text-blue"><History size={16} /> Export Achievement History</button>
        </div>
        <DataTable columns={columns} data={achievements} actions={false} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingReward ? "View & Edit Milestone Reward" : "Create New Milestone Reward"}
        footer={(
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {editingReward ? (
              <button className="btn btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444' }} onClick={handleDelete} type="button">
                <Trash2 size={16} className="mr-1" style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Delete
              </button>
            ) : (
              <div></div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)} type="button">Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={isSubmitting} type="button">
                {isSubmitting ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </div>
        )}
      >
        <form className="modal-form" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>Milestone Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Platinum Recruiter Club" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Achievement Criteria</label>
              <select 
                value={formData.criteria}
                onChange={(e) => setFormData({...formData, criteria: e.target.value})}
              >
                <option value="Joins in a Month">Number of Joins (Monthly)</option>
                <option value="Joins in a Quarter">Number of Joins (Quarterly)</option>
                <option value="Total Lifetime Joins">Number of Joins (Lifetime)</option>
                <option value="Total Incentive Earned">Total Incentive Earned</option>
                <option value="Highest Valid Lead Count">Highest Valid Lead Count</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Value</label>
              <input 
                type="number" 
                required
                placeholder="e.g. 50" 
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
              />
            </div>
            <div className="form-group col-span-2">
              <label>Reward Description</label>
              <input 
                type="text" 
                required
                placeholder="e.g. One-time ₹50,000 cash bonus + Trophy" 
                value={formData.rewardDesc}
                onChange={(e) => setFormData({...formData, rewardDesc: e.target.value})}
              />
            </div>
            <div className="form-group col-span-2">
              <label>Eligibility Rules</label>
              <textarea 
                placeholder="Specify who can participate (e.g. Open for all internal members currently active)"
                value={formData.eligibility}
                onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
              ></textarea>
            </div>
          </div>
        </form>
      </Modal>

      <style>{`
        .milestones-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .milestone-admin-card { display: flex; flex-direction: column; gap: 16px; border-left: 4px solid var(--accent-blue); transition: 0.2s; }
        .milestone-admin-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-left-color: var(--primary); }
        
        .m-icon-box { width: 44px; height: 44px; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: var(--accent-blue); }
        .text-gold { color: #EAB308; }
        .text-purple { color: #A855F7; }
        
        .m-content h3 { font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .m-content .criteria { font-size: 13px; color: var(--text-secondary); margin: 4px 0 12px; }
        .reward-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #F0FDF4; border: 1px solid #DCFCE7; color: #166534; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        
        .m-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); }
        .m-footer .stats { font-size: 12px; display: flex; align-items: center; gap: 6px; color: var(--text-secondary); }
        
        .achiever-cell { display: flex; align-items: center; gap: 12px; }
        .avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-secondary); font-size: 14px; }
        
        .achievers-list-card { padding: 0; }
        .chart-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .chart-header h3 { font-size: 16px; font-weight: 700; }
        
        .modal-form { display: flex; flex-direction: column; gap: 24px; margin-top: 8px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .col-span-2 { grid-column: span 2; }
        .form-group label { font-size: 14px; font-weight: 600; color: #1E293B; }
        .form-group input, .form-group select, .form-group textarea { padding: 10px 14px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; color: #0F172A; width: 100%; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; background-color: #FFFFFF; }
        .form-group textarea { min-height: 80px; resize: vertical; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(37,99,235, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminRewards;
