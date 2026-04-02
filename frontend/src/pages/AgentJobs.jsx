import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Clock, 
  Coins, 
  ChevronRight,
  Info,
  Building2,
  CheckCircle2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const AgentJobs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching agent jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleRefer = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="content-wrapper agent-jobs">
      <div className="section-header">
        <div>
          <h1>Job Openings Feed</h1>
          <p className="text-secondary">Browse active jobs and refer candidates to earn incentives.</p>
        </div>
        <div className="header-actions">
          <div className="search-box-inner">
            <Search size={18} />
            <input type="text" placeholder="Search by role or company..." />
          </div>
          <button className="btn btn-outline">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="agent-jobs-grid">
        {loading ? (
          <div className="loading-state col-span-full">
            <Loader2 className="animate-spin text-accent-blue" size={40} />
            <p>Loading active job feed...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state col-span-full">
            <p>No active job openings at the moment.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className={`card agent-job-card ${job.priority === 'High' ? 'priority-high' : ''}`}>
            {job.priority === 'High' && (
              <div className="priority-badge">
                <span className="badge badge-red">Urgent</span>
              </div>
            )}
            <div className="job-card-header">
              <div className="company-logo-sm">
                <Building2 size={24} />
              </div>
              <div className="job-title-info">
                <h3 className="j-title">{job.title}</h3>
                <p className="j-company">{job.company}</p>
              </div>
            </div>

            <div className="job-card-details">
              <div className="jd-item"><MapPin size={14} /> {job.location}</div>
              <div className="jd-item"><Briefcase size={14} /> {job.experience}</div>
              <div className="jd-item"><Clock size={14} /> {job.type}</div>
            </div>

            <div className="job-card-incentive">
              <div className="inc-box">
                <Coins size={18} className="text-green" />
                <div>
                  <p className="inc-amount">₹{job.incentive}</p>
                  <p className="inc-text">Referral Incentive</p>
                </div>
              </div>
              <div className="salary-box">
                <p className="sal-val">{job.salary}</p>
              </div>
            </div>

            <div className="job-card-footer">
              <button className="btn btn-text-blue" onClick={() => handleRefer(job)}>View Details</button>
              <button className="btn btn-primary" onClick={() => handleRefer(job)}>
                Refer Candidate <ArrowRight size={16} />
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Refer Candidate for ${selectedJob?.title}`}
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary">Submit Referral</button>
          </>
        )}
      >
        <form className="modal-form">
          <div className="form-grid">
            <div className="form-group col-span-2">
              <h4 className="form-section-title">Candidate Details</h4>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter candidate's full name" />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="text" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="example@email.com" />
            </div>
            <div className="form-group">
              <label>Current Location</label>
              <input type="text" placeholder="City" />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input type="text" placeholder="e.g. B.Tech, MBA" />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" placeholder="Years" />
            </div>
            <div className="form-group col-span-2">
              <label>Upload Resume (PDF/DOC)</label>
              <div className="file-upload-box">
                <Plus size={24} />
                <p>Click to browse or drag & drop</p>
                <span>Max size: 5MB</span>
              </div>
            </div>
            <div className="form-group col-span-2">
              <label>Referral Note (Optional)</label>
              <textarea placeholder="Any specific reasons why you are recommending this candidate?"></textarea>
            </div>
          </div>
        </form>
      </Modal>

      <style>{`
        .agent-jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; margin-top: 32px; min-height: 400px; }
        .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 100px 0; color: var(--text-secondary); width: 100%; grid-column: 1 / -1; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Premium Search Box */
        .search-box-inner { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          background: white; 
          border: 1px solid var(--border); 
          border-radius: 40px; 
          padding: 8px 16px; 
          width: 320px; 
          transition: all 0.2s;
          box-shadow: var(--shadow-sm);
        }
        .search-box-inner:focus-within {
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          width: 360px;
        }
        .search-box-inner input { 
          border: none; 
          background: none; 
          outline: none; 
          font-size: 14px; 
          width: 100%; 
          color: var(--text-primary);
        }
        .search-box-inner svg { color: var(--text-secondary); flex-shrink: 0; }

        
        .agent-job-card { position: relative; display: flex; flex-direction: column; gap: 20px; transition: 0.2s; border-radius: var(--radius-lg); }
        .agent-job-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--accent-blue); }
        .priority-high { border-left: 4px solid var(--accent-red); }
        .priority-badge { position: absolute; top: 12px; right: 12px; }
        
        .job-card-header { display: flex; align-items: center; gap: 16px; }
        .company-logo-sm { width: 50px; height: 50px; background: #F1F5F9; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
        .j-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .j-company { font-size: 14px; color: var(--text-secondary); }
        
        .job-card-details { display: flex; flex-wrap: wrap; gap: 16px; }
        .jd-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); background: #F8FAFC; padding: 4px 10px; border-radius: 4px; }
        
        .job-card-incentive { background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: var(--radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .inc-box { display: flex; align-items: center; gap: 12px; }
        .inc-amount { font-size: 18px; font-weight: 800; color: #15803D; }
        .inc-text { font-size: 11px; text-transform: uppercase; font-weight: 600; color: #166534; }
        .sal-val { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
        
        .job-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .btn-text-blue { color: var(--accent-blue); font-weight: 600; text-decoration: underline; background: none; }
        
        .form-section-title { font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px; }
        
        /* Modal Form Refinement */
        .modal-form { display: flex; flex-direction: column; gap: 24px; margin-top: 8px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 14px; font-weight: 600; color: #1E293B; }
        .form-group input, .form-group select, .form-group textarea { 
          padding: 12px 14px; 
          border: 1px solid #E2E8F0; 
          border-radius: 8px; 
          font-size: 14px; 
          color: #0F172A; 
          width: 100%; 
          outline: none; 
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          background-color: #FFFFFF;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { 
          border-color: var(--accent-blue); 
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); 
        }
        .col-span-2 { grid-column: span 2; }
        
        .file-upload-box { border: 2px dashed #CBD5E1; border-radius: 12px; padding: 40px; text-align: center; color: var(--text-secondary); cursor: pointer; transition: 0.2s; background: #F8FAFC; }
        .file-upload-box:hover { border-color: var(--accent-blue); background: #F0F9FF; color: var(--accent-blue); }
        .file-upload-box p { font-size: 14px; font-weight: 600; margin: 12px 0 4px; }
        .file-upload-box span { font-size: 12px; opacity: 0.7; }
        
        @media (max-width: 640px) {
          .agent-jobs-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AgentJobs;
