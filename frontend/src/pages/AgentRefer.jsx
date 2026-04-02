import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UserPlus, 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Target,
  Loader2
} from 'lucide-react';
import API_BASE_URL from '../api/config';

const AgentRefer = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    qualification: '',
    experience: '',
    notes: ''
  });

  // Fetch Jobs from Backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        const data = await response.json();
        setActiveJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        jobId: selectedJob._id,
        referredBy: 'Agent-Rahul' // Mock agent name for now
      };

      const response = await fetch(`${API_BASE_URL}/api/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', location: '', qualification: '', experience: '', notes: '' });
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting referral:', error);
      alert('Backend server not responding. Ensure it is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = activeJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-wrapper refer-desk">
      <div className="section-header">
        <div>
          <h1>Referral Desk</h1>
          <p className="text-secondary">Directly refer candidates for active job openings across India.</p>
        </div>
        {!submitted && (
          <div className="header-actions">
             <div className="step-indicator">
               <span className={!selectedJob ? 'active' : ''}>1. Select Job</span>
               <ArrowRight size={14} />
               <span className={selectedJob ? 'active' : ''}>2. Fill Details</span>
             </div>
          </div>
        )}
      </div>

      <div className="referral-split-view">
        {/* Left: Job Selector */}
        <div className="job-selector-column card">
          <div className="search-mini-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search for jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="jobs-mini-list">
            {loading ? (
              <div className="loader-center"><Loader2 className="animate-spin" size={24} /></div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div 
                  key={job._id} 
                  className={`mini-job-item ${selectedJob?._id === job._id ? 'active' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="mji-icon"><Building2 size={16} /></div>
                  <div className="mji-content">
                    <h4>{job.title}</h4>
                    <p>{job.company} • {job.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No active jobs found.</p>
            )}
          </div>
        </div>

        {/* Right: Referral Form */}
        <div className="referral-form-column">
          {submitted ? (
            <div className="card success-state-full animate-in">
              <div className="success-icon-wrap">
                <CheckCircle2 size={64} className="text-green" />
              </div>
              <h2>Referral Submitted!</h2>
              <p>Great job! The candidate has been added to your referrals list. Our team will verify and begin the screening process shortly.</p>
              <button className="btn btn-outline" onClick={() => setSubmitted(false)}>Refer Another Candidate</button>
            </div>
          ) : selectedJob ? (
            <div className="card referral-main-card animate-in">
              <div className="target-job-summary bg-blue-lite">
                <div className="tjs-header">
                  <span className="badge badge-blue">Targeting Role</span>
                  <h3>{selectedJob.title}</h3>
                </div>
                <div className="tjs-grid">
                  <div className="tjs-item"><Building2 size={14} /> {selectedJob.company}</div>
                  <div className="tjs-item"><MapPin size={14} /> {selectedJob.location}</div>
                  <div className="tjs-item"><Briefcase size={14} /> {selectedJob.experience}</div>
                  <div className="tjs-item"><Clock size={14} /> {selectedJob.type || 'Full Time'}</div>
                </div>
              </div>

              <form className="referral-direct-form" onSubmit={handleSubmit}>
                <div className="rd-grid">
                   <div className="form-group col-span-2">
                     <h4 className="form-section-title">Candidate Details</h4>
                   </div>
                   <div className="form-group">
                     <label>Full Name</label>
                     <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Enter candidate's full name" required />
                   </div>
                   <div className="form-group">
                     <label>Mobile Number</label>
                     <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="+91 XXXXX XXXXX" required />
                   </div>
                   <div className="form-group">
                     <label>Email Address</label>
                     <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="example@email.com" required />
                   </div>
                   <div className="form-group">
                     <label>Current Location</label>
                     <input name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="City" required />
                   </div>
                   <div className="form-group">
                     <label>Qualification</label>
                     <input name="qualification" value={formData.qualification} onChange={handleInputChange} type="text" placeholder="e.g. B.Tech, MBA" required />
                   </div>
                   <div className="form-group">
                     <label>Years of Experience</label>
                     <input name="experience" value={formData.experience} onChange={handleInputChange} type="number" placeholder="Years" required />
                   </div>
                   <div className="form-group col-span-2">
                     <label>Upload Resume (PDF/DOC)</label>
                     <div className="file-upload-box-lite">
                        <Plus size={24} />
                        <p>Click to browse or drag & drop</p>
                        <span>Max size: 5MB</span>
                     </div>
                   </div>
                   <div className="form-group col-span-2">
                     <label>Referral Note (Optional)</label>
                     <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Tell us why you are recommending this candidate..." rows={4}></textarea>
                   </div>
                </div>
                <div className="form-footer-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setSelectedJob(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-cta-wide" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Submit Referral'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card empty-select-state">
              <div className="empty-icon-circle bg-blue-lite">
                <Target size={48} className="text-blue" />
              </div>
              <h2>Select a Vacancy</h2>
              <p>Please select a job opening from the left panel to begin referring a candidate. A referral must always be linked to a specific job opening.</p>
              <div className="tip-box">
                <div className="tip-dot"></div>
                <p>Pro Tip: Use the search bar to find specific roles or companies quickly.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .refer-desk { height: calc(100vh - var(--topbar-height)); display: flex; flex-direction: column; overflow: hidden; padding-bottom: 20px; }
        .referral-split-view { display: flex; gap: 24px; flex: 1; min-height: 0; margin-top: 24px; }
        
        /* Left: Job Selector */
        .job-selector-column { width: 320px; display: flex; flex-direction: column; padding: 0; overflow: hidden; flex-shrink: 0; }
        .search-mini-box { padding: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; background: white; }
        .search-mini-box input { border: none; background: none; outline: none; font-size: 14px; width: 100%; }
        .search-mini-box svg { color: var(--text-secondary); }
        
        .jobs-mini-list { flex: 1; overflow-y: auto; padding: 0; }
        .mini-job-item { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 14px; align-items: start; cursor: pointer; transition: 0.2s; }
        .mini-job-item:hover { background: #F8FAFC; }
        .mini-job-item.active { background: #EFF6FF; border-left: 4px solid var(--accent-blue); padding-left: 16px; }
        .mji-icon { width: 36px; height: 36px; border-radius: 8px; background: #E2E8F0; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); flex-shrink: 0; }
        .mini-job-item.active .mji-icon { background: #DBEAFE; color: var(--accent-blue); }
        .mji-content h4 { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
        .mji-content p { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
        
        .loader-center { display: flex; justify-content: center; padding: 40px; color: var(--accent-blue); }
        .no-results { padding: 20px; text-align: center; font-size: 13px; color: var(--text-secondary); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .referral-form-column { flex: 1; min-width: 0; overflow-y: auto; }
        .referral-main-card { padding: 0; overflow: hidden; }
        .animate-in { animation: fadeInScale 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        
        .target-job-summary { padding: 24px; border-bottom: 1px solid var(--border); }
        .bg-blue-lite { background: #F0F9FF; }
        .tjs-header { margin-bottom: 16px; }
        .tjs-header h3 { font-size: 22px; font-weight: 800; color: #1E293B; margin-top: 8px; }
        .tjs-grid { display: flex; flex-wrap: wrap; gap: 20px; }
        .tjs-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #64748B; }
        .tjs-item svg { color: #2563EB; }
        
        .referral-direct-form { padding: 32px; }
        .rd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .col-span-2 { grid-column: span 2; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 14px; font-weight: 600; color: #1E293B; }
        .form-group input, .form-group textarea { padding: 12px 14px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; transition: all 0.2s; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .form-section-title { font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px; }
        
        .file-upload-box-lite { border: 2px dashed #CBD5E1; border-radius: 12px; padding: 40px; text-align: center; color: var(--text-secondary); cursor: pointer; transition: 0.2s; background: #F8FAFC; }
        .file-upload-box-lite:hover { border-color: #2563EB; background: #F0F9FF; color: #2563EB; }
        .file-upload-box-lite p { font-size: 14px; font-weight: 700; margin: 12px 0 4px; }
        .file-upload-box-lite span { font-size: 11px; opacity: 0.7; }
        
        .form-footer-actions { margin-top: 40px; display: flex; justify-content: flex-end; gap: 16px; padding-top: 32px; border-top: 1px solid #E2E8F0; }
        .btn-cta-wide { padding-left: 40px; padding-right: 40px; display: flex; align-items: center; gap: 8px; font-weight: 700; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
        
        /* Empty State */
        .empty-select-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px; }
        .empty-icon-circle { width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; border: 2px dashed #BFDBFE; }
        .empty-select-state h2 { font-size: 24px; font-weight: 800; color: #1E293B; margin-bottom: 12px; }
        .empty-select-state p { font-size: 15px; color: #64748B; line-height: 1.6; max-width: 420px; margin-bottom: 32px; }
        .tip-box { padding: 12px 20px; background: #F8FAFC; border-radius: 40px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 12px; }
        .tip-dot { width: 8px; height: 8px; background: var(--accent-orange); border-radius: 50%; }
        .tip-box p { font-size: 13px; font-weight: 600; color: #475569; margin: 0; }
        
        /* Indicators */
        .step-indicator { display: flex; align-items: center; gap: 12px; background: white; padding: 10px 20px; border-radius: 40px; border: 1px solid #E2E8F0; font-size: 13px; font-weight: 700; color: #94A3B8; }
        .step-indicator span.active { color: var(--accent-blue); }
        
        /* Success State */
        .success-state-full { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px; }
        .success-icon-wrap { width: 120px; height: 120px; border-radius: 50%; background: #F0FDF4; display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
        .success-state-full h2 { font-size: 28px; font-weight: 800; color: #064E3B; margin-bottom: 16px; }
        .success-state-full p { font-size: 16px; color: #065F46; line-height: 1.6; max-width: 480px; margin-bottom: 32px; }
        
        @media (max-width: 1024px) {
          .referral-split-view { flex-direction: column; height: auto; }
          .job-selector-column { width: 100%; }
          .refer-desk { height: auto; overflow: visible; }
          .rd-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AgentRefer;
