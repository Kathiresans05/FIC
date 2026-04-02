import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Download,
  Filter,
  Check,
  ChevronDown,
  Loader2
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const AdminIncentives = () => {
  const [activeTab, setActiveTab] = useState('payouts');
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Edit State
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Form State for new rule
  const [newRule, setNewRule] = useState({
    name: '',
    triggerStage: 'Lead Created',
    applicableRole: 'All Roles',
    payoutType: 'Fixed',
    value: '',
    conditions: ''
  });

  const API_BASE_URL = 'http://localhost:5000/api/incentives';
  
  const handleEditRule = (rule) => {
    setEditingRuleId(rule._id);
    setNewRule({
      name: rule.name,
      triggerStage: rule.triggerStage,
      applicableRole: rule.applicableRole,
      payoutType: rule.payoutType,
      value: rule.value,
      conditions: rule.conditions || ''
    });
    setIsRuleModalOpen(true);
  };

  const handleDeleteRule = async (rule) => {
    if (!window.confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/rules/${rule._id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Failed to delete rule');
    }
  };

  const handleEditPayout = (payout) => {
    setSelectedPayout(payout);
    setIsPayoutModalOpen(true);
  };

  const handleDeletePayout = async (payout) => {
    if (!window.confirm(`Are you sure you want to delete payout record ${payout.payoutId}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/payouts/${payout._id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting payout:', error);
      alert('Failed to delete payout');
    }
  };

  const handleUpdatePayoutStatus = async (status) => {
    setSubmitting(true);
    try {
      await axios.patch(`${API_BASE_URL}/payouts/${selectedPayout._id}`, { status });
      setIsPayoutModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating payout status:', error);
      alert('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payoutsRes, rulesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/payouts`),
        axios.get(`${API_BASE_URL}/rules`)
      ]);
      setPayouts(payoutsRes.data);
      setRules(rulesRes.data);
    } catch (error) {
      console.error('Error fetching incentive data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRuleId) {
        await axios.patch(`${API_BASE_URL}/rules/${editingRuleId}`, newRule);
      } else {
        await axios.post(`${API_BASE_URL}/rules`, newRule);
      }
      setIsRuleModalOpen(false);
      setEditingRuleId(null);
      setNewRule({
        name: '',
        triggerStage: 'Lead Created',
        applicableRole: 'All Roles',
        payoutType: 'Fixed',
        value: '',
        conditions: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving rule:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateStats = () => {
    const pending = payouts
      .filter(p => p.status === 'Pending' || p.status === 'Approved')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const approvedUnpaid = payouts
      .filter(p => p.status === 'Approved')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const paidMonth = payouts
      .filter(p => p.status === 'Paid')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      pending: (pending / 100000).toFixed(2) + 'L',
      approved: (approvedUnpaid / 100000).toFixed(2) + 'L',
      paid: (paidMonth / 100000).toFixed(2) + 'L',
      pendingCount: payouts.filter(p => p.status === 'Pending').length
    };
  };

  const stats = calculateStats();

  const payoutColumns = [
    { 
      header: 'Payout ID & Date', 
      accessor: 'payoutId',
      render: (row) => (
        <div>
          <p className="font-semibold text-sm">{row.payoutId}</p>
          <p className="text-xs text-secondary">{new Date(row.date).toLocaleDateString()}</p>
        </div>
      )
    },
    { 
      header: 'User Name', 
      accessor: 'userId.name',
      render: (row) => (
        <div>
          <p className="font-semibold">{row.userId?.name || 'N/A'}</p>
          <p className="text-xs text-secondary">{row.userId?.role || 'N/A'}</p>
        </div>
      )
    },
    { header: 'Incentive Type', accessor: 'type' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => <span className="font-bold">₹{row.amount.toLocaleString()}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`badge badge-${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];

  const ruleColumns = [
    { header: 'Rule Name', accessor: 'name' },
    { header: 'Trigger Stage', accessor: 'triggerStage' },
    { 
      header: 'Amount / Logic', 
      accessor: 'value',
      render: (row) => (
        <span className="font-medium text-blue">
          {row.payoutType === 'Fixed' ? `₹${row.value.toLocaleString()}` : `${row.value}%`}
        </span>
      )
    },
    { header: 'Role', accessor: 'applicableRole' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <span className={`badge badge-${row.status === 'Active' ? 'green' : 'gray'}`}>{row.status}</span>
    }
  ];

  const getStatusColor = (status) => {
    const map = {
      'Pending': 'orange',
      'Approved': 'blue',
      'Paid': 'green',
      'Rejected': 'red'
    };
    return map[status] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading Incentives & Payouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Incentives & Payouts</h1>
          <p className="text-secondary">Manage payout requests and configure incentive calculation rules.</p>
        </div>
        {activeTab === 'rules' && (
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setIsRuleModalOpen(true)}>
              <Plus size={18} /> Add New Rule
            </button>
          </div>
        )}
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('payouts')}
        >
          <CreditCard size={18} /> Payout Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Coins size={18} /> Incentive Rules
        </button>
      </div>

      {activeTab === 'payouts' ? (
        <>
          <div className="payout-stats-grid">
            <div className="stat-card">
              <span className="stat-label">Pending Approval</span>
              <p className="stat-value">₹{stats.pending}</p>
              <span className="stat-link">Review {stats.pendingCount} requests <ChevronDown size={14} /></span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Approved & Unpaid</span>
              <p className="stat-value">₹{stats.approved}</p>
              <span className="stat-link">Process payments <ChevronDown size={14} /></span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Paid (Month)</span>
              <p className="stat-value">₹{stats.paid}</p>
              <span className="stat-link">View history <ChevronDown size={14} /></span>
            </div>
          </div>
          <DataTable 
            columns={payoutColumns} 
            data={payouts} 
            actions={true} 
            onEdit={handleEditPayout}
            onDelete={handleDeletePayout}
          />
        </>
      ) : (
        <DataTable 
          columns={ruleColumns} 
          data={rules} 
          actions={true} 
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
        />
      )}

      <Modal 
        isOpen={isRuleModalOpen} 
        onClose={() => {
          setIsRuleModalOpen(false);
          setEditingRuleId(null);
        }}
        title={editingRuleId ? "Edit Incentive Rule" : "Add New Incentive Rule"}
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => {
              setIsRuleModalOpen(false);
              setEditingRuleId(null);
            }} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateRule} disabled={submitting}>
              {submitting ? 'Saving...' : (editingRuleId ? 'Update Rule' : 'Create Rule')}
            </button>
          </>
        )}
      >
        <form className="modal-form" onSubmit={handleCreateRule}>
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>Rule Name</label>
              <input 
                type="text" 
                placeholder="e.g. Standard Selection Bonus" 
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Trigger Stage</label>
              <select 
                value={newRule.triggerStage}
                onChange={(e) => setNewRule({...newRule, triggerStage: e.target.value})}
              >
                <option>Lead Created</option>
                <option>Interview Scheduled</option>
                <option>Selected</option>
                <option>Joined</option>
                <option>30 Days Completed</option>
                <option>90 Days Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Applicable Role</label>
              <select 
                value={newRule.applicableRole}
                onChange={(e) => setNewRule({...newRule, applicableRole: e.target.value})}
              >
                <option>All Roles</option>
                <option>Consultancy Executive</option>
                <option>External Agent</option>
                <option>Recruitment Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payout Type</label>
              <select 
                value={newRule.payoutType}
                onChange={(e) => setNewRule({...newRule, payoutType: e.target.value})}
              >
                <option value="Fixed">Fixed Amount (₹)</option>
                <option value="Percentage">Percentage of Salary (%)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Value (₹ or %)</label>
              <input 
                type="number" 
                placeholder="e.g. 5000 or 5" 
                value={newRule.value}
                onChange={(e) => setNewRule({...newRule, value: e.target.value})}
                required
              />
            </div>
            <div className="form-group col-span-2">
              <label>Conditions / Cap</label>
              <textarea 
                placeholder="Specify any additional conditions (e.g. Minimum 5 joins in a month to trigger this rule)"
                value={newRule.conditions}
                onChange={(e) => setNewRule({...newRule, conditions: e.target.value})}
              ></textarea>
            </div>
          </div>
        </form>
      </Modal>

      {/* Payout Status Update Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Update Payout Status"
        footer={<button className="btn btn-outline" onClick={() => setIsPayoutModalOpen(false)}>Close</button>}
      >
        <div className="status-update-container">
          <p className="status-modal-desc">
            Update the status for <strong>{selectedPayout?.payoutId}</strong> ({selectedPayout?.userId?.name}).
            Current status: <span className={`badge badge-${getStatusColor(selectedPayout?.status)}`}>{selectedPayout?.status}</span>
          </p>
          
          <div className="status-actions">
            <button 
              className="status-btn btn-approve" 
              onClick={() => handleUpdatePayoutStatus('Approved')}
              disabled={submitting || selectedPayout?.status === 'Approved'}
            >
              <Check size={18} /> Approve Payout
            </button>
            
            <button 
              className="status-btn btn-paid" 
              onClick={() => handleUpdatePayoutStatus('Paid')}
              disabled={submitting || selectedPayout?.status === 'Paid'}
            >
              <CreditCard size={18} /> Mark as Paid
            </button>
            
            <button 
              className="status-btn btn-reject" 
              onClick={() => handleUpdatePayoutStatus('Rejected')}
              disabled={submitting || selectedPayout?.status === 'Rejected'}
            >
              <XCircle size={18} /> Reject Request
            </button>
          </div>
        </div>
      </Modal>

      <style>{`
        .tabs-container { display: flex; gap: 8px; border-bottom: 1px solid var(--border); margin: 4px 0 20px; padding-bottom: 2px; }
        .tab-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; color: #64748B; border-bottom: 2px solid transparent; transition: 0.2s; background: none; border: none; cursor: pointer; border-radius: 8px 8px 0 0; line-height: 1.2; }
        .tab-btn:hover { color: var(--text-primary); background: #F8FAFC; }
        .tab-btn.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); background: #EFF6FF; }
        .tab-btn svg { color: currentColor; }

        .payout-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .stat-card { background: white; border: 1px solid var(--border); padding: 20px 24px; border-radius: 14px; box-shadow: var(--shadow-sm); transition: 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: #CBD5E1; }
        .stat-label { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; }
        .stat-value { font-size: 26px; font-weight: 800; color: var(--text-primary); margin: 10px 0; }
        .stat-link { font-size: 12px; color: var(--accent-blue); font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 2px 0; width: fit-content; transition: 0.2s; }
        .stat-link:hover { color: #1E40AF; }
        
        .text-blue { color: var(--accent-blue); }

        @media (max-width: 768px) {
          .payout-stats-grid { grid-template-columns: 1fr; gap: 12px; }
          .tabs-container { overflow-x: auto; white-space: nowrap; margin-bottom: 16px; }
          .tab-btn { padding: 10px 14px; }
        }

        .status-update-container { display: flex; flex-direction: column; gap: 20px; padding: 8px 0; }
        .status-modal-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
        .status-actions { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .status-btn { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .btn-approve { background: #EFF6FF; color: #1E40AF; border-color: #DBEAFE; }
        .btn-approve:hover:not(:disabled) { background: #DBEAFE; transform: translateY(-1px); }
        .btn-paid { background: #F0FDF4; color: #166534; border-color: #DCFCE7; }
        .btn-paid:hover:not(:disabled) { background: #DCFCE7; transform: translateY(-1px); }
        .btn-reject { background: #FEF2F2; color: #991B1B; border-color: #FEE2E2; }
        .btn-reject:hover:not(:disabled) { background: #FEE2E2; transform: translateY(-1px); }
        .status-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
      `}</style>
    </div>
  );
};

export default AdminIncentives;
