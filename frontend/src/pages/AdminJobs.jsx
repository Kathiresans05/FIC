import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Building2, MapPin, Users, Clock, ShieldAlert, X, Loader2, ArrowRight } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const JobVacancies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Information Technology',
    location: '',
    salary: '',
    experience: '',
    vacancies: 1,
    priority: 'High',
    incentive: '',
    status: 'Open',
    description: ''
  });

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditJob = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title || '',
      company: job.company || '',
      category: job.category || 'Information Technology',
      location: job.location || '',
      salary: job.salary || '',
      experience: job.experience || '',
      vacancies: job.vacancies || 1,
      priority: job.priority || 'Medium',
      incentive: job.incentive || '',
      status: job.status || 'Open',
      description: job.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete the vacancy for "${job.title}" at ${job.company}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${job._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchJobs();
      } else {
        const result = await response.json();
        alert(`Failed to delete vacancy: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    // Ensure numeric fields are sent as numbers
    const submissionData = {
      ...formData,
      vacancies: Number(formData.vacancies) || 1
    };

    try {
      const url = editingId ? `${API_BASE_URL}/api/jobs/${editingId}` : `${API_BASE_URL}/api/jobs`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ 
          title: '', company: '', category: 'Information Technology', 
          location: '', salary: '', experience: '', vacancies: 1, 
          priority: 'High', incentive: '', status: 'Open', description: '' 
        });
        fetchJobs();
      } else {
        const errorMsg = result.errors ? result.errors.join('\n') : (result.message || 'Unknown error');
        alert(`Failed to ${editingId ? 'update' : 'create'} vacancy:\n${errorMsg}`);
      }
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'creating'} vacancy:`, error);
      alert(`Error ${editingId ? 'updating' : 'creating'} vacancy. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    { header: 'Location', accessor: 'location' },
    { 
      header: 'Experience', 
      accessor: 'experience',
      render: (row) => <span className="text-secondary">{row.experience}</span>
    },
    { 
      header: 'Vacancies', 
      accessor: 'vacancies',
      render: (row) => <span className="font-semibold">{row.vacancies}</span>
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

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Job Vacancy Management</h1>
          <p className="text-secondary">Create, manage, and assign job openings to teams and agents.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => fetchJobs()}>Refresh</button>
          <button className="btn btn-primary" onClick={() => {
            setEditingId(null);
            setFormData({ 
              title: '', company: '', category: 'Information Technology', 
              location: '', salary: '', experience: '', vacancies: 1, 
              priority: 'High', incentive: '', status: 'Open', description: '' 
            });
            setIsModalOpen(true);
          }}>
            <Plus size={18} /> Add New Vacancy
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={jobs} 
        actions={true} 
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Job Vacancy" : "Create New Job Vacancy"}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body-scroll">
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label>Job Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} type="text" placeholder="e.g. Senior Software Engineer" required />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input name="company" value={formData.company} onChange={handleInputChange} type="text" placeholder="Enter company name" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Banking">Banking</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="City or Remote" required />
              </div>
              <div className="form-group">
                <label>Salary Range (Annual)</label>
                <input name="salary" value={formData.salary} onChange={handleInputChange} type="text" placeholder="e.g. 12L - 18L" required />
              </div>
              <div className="form-group">
                <label>Experience Required</label>
                <input name="experience" value={formData.experience} onChange={handleInputChange} type="text" placeholder="e.g. 5-8 Years" required />
              </div>
              <div className="form-group">
                <label>Vacancy Count</label>
                <input name="vacancies" value={formData.vacancies} onChange={handleInputChange} type="number" placeholder="Number of openings" required />
              </div>
              <div className="form-group">
                <label>Incentive (₹)</label>
                <input name="incentive" value={formData.incentive} onChange={handleInputChange} type="text" placeholder="e.g. 5,000" required />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleInputChange}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group col-span-2">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Open">Open</option>
                  <option value="Hold">Hold</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="form-group col-span-2">
                <label>Job Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Paste detailed job description here..." rows={3} required></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'Update Vacancy' : 'Create Vacancy')}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        .modal-body-scroll { max-height: 60vh; overflow-y: auto; padding-right: 10px; margin-bottom: 5px; }
        .modal-body-scroll::-webkit-scrollbar { width: 6px; }
        .modal-body-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .modal-form label { font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; display: block; }
        .modal-form input, .modal-form select, .modal-form textarea { padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; width: 100%; box-sizing: border-box; font-size: 14px; }
        .modal-form input:focus { border-color: #2563EB; outline: none; }
      `}</style>

      <style>{`
        .job-id-text { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
        .job-title-text { font-weight: 600; color: var(--text-primary); }
        .font-semibold { font-weight: 600; }
        
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }
        .form-group input, .form-group select, .form-group textarea {
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 14px;
          background: #F8FAFC;
          outline: none;
          box-sizing: border-box;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--accent-blue);
          background: white;
        }
        .col-span-2 { grid-column: span 2; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default JobVacancies;
