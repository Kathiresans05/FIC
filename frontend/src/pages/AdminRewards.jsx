import React, { useState } from 'react';
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
  History
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const AdminRewards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const milestones = [
    { id: 1, title: 'Early Starter Perk', criteria: '5 Joins in a Month', reward: 'Smartphone (₹15,000)', status: 'Active', achievers: 12 },
    { id: 2, title: 'Quarterly High-Flyer', criteria: '25 Joins in a Quarter', reward: 'Laptop (₹65,000)', status: 'Active', achievers: 3 },
    { id: 3, title: 'The Recruitment Legend', criteria: '100 Total Lifetime Joins', reward: 'International Trip (Couple)', status: 'Active', achievers: 1 },
    { id: 4, title: 'Top Referrer (Monthly)', criteria: 'Highest Valid Referrals', reward: '₹10,000 Cash Bonus', status: 'Active', achievers: 5 },
  ];

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

  const achieversData = [
    { id: 1, name: 'Suresh Raina', role: 'External Agent', milestone: 'Early Starter Perk', date: '21 Mar 2024', rewardStatus: 'Dispatched' },
    { id: 2, name: 'Anjali Sharma', role: 'Recruitment Manager', milestone: 'Quarterly High-Flyer', date: '15 Mar 2024', rewardStatus: 'Claimed' },
    { id: 3, name: 'Rahul Verma', role: 'Executive', milestone: 'Top Referrer (Monthly)', date: '10 Mar 2024', rewardStatus: 'Pending' },
    { id: 4, name: 'Karan Mehra', role: 'External Agent', milestone: 'The Recruitment Legend', date: '01 Mar 2024', rewardStatus: 'Dispatched' },
  ];

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Rewards & Milestones Management</h1>
          <p className="text-secondary">Define and track specialized rewards that go beyond standard incentives.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Milestone
          </button>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="milestones-grid">
        {milestones.map((m) => (
          <div key={m.id} className="card milestone-admin-card">
            <div className="m-icon-box">
              {m.id === 3 ? <Trophy size={24} className="text-gold" /> : m.achievers > 5 ? <Rocket size={24} className="text-blue" /> : <Gift size={24} className="text-purple" />}
            </div>
            <div className="m-content">
              <h3>{m.title}</h3>
              <p className="criteria">{m.criteria}</p>
              <div className="reward-tag">
                <Gift size={14} /> {m.reward}
              </div>
            </div>
            <div className="m-footer">
              <span className="stats"><Users size={14} /> <strong>{m.achievers}</strong> Achievers</span>
              <button className="icon-btn-sm"><ChevronRight size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="card achievers-list-card">
        <div className="chart-header">
          <h3>Recent Achievement Log</h3>
          <button className="btn btn-text-blue"><History size={16} /> Export Achievement History</button>
        </div>
        <DataTable columns={columns} data={achieversData} actions={false} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Milestone Reward"
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary">Save Milestone</button>
          </>
        )}
      >
        <form className="modal-form">
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>Milestone Title</label>
              <input type="text" placeholder="e.g. Platinum Recruiter Club" />
            </div>
            <div className="form-group">
              <label>Achievement Criteria</label>
              <select>
                <option>Number of Joins (Monthly)</option>
                <option>Number of Joins (Quarterly)</option>
                <option>Number of Joins (Lifetime)</option>
                <option>Total Incentive Earned</option>
                <option>Highest Valid Lead Count</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Value</label>
              <input type="number" placeholder="e.g. 50" />
            </div>
            <div className="form-group col-span-2">
              <label>Reward Description</label>
              <input type="text" placeholder="e.g. One-time ₹50,000 cash bonus + Trophy" />
            </div>
            <div className="form-group col-span-2">
              <label>Eligibility Rules</label>
              <textarea placeholder="Specify who can participate (e.g. Open for all internal members currently active)"></textarea>
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
      `}</style>
    </div>
  );
};

export default AdminRewards;
