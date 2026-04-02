import React, { useState, useEffect, useRef } from 'react';
import DataTable from '../components/DataTable';
import SlideOver from '../components/SlideOver';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';
import { 
  Plus, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Paperclip, 
  MessageSquare,
  History,
  ExternalLink 
} from 'lucide-react';

const AdminCandidates = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    qualification: '',
    experience: '',
    jobId: '',
    notes: '',
    resumeUrl: ''
  });

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates`);
      const data = await response.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data.filter(j => j.status === 'Open') : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  React.useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '', location: '', qualification: '', experience: '', jobId: '', notes: '', resumeUrl: '' });
        fetchCandidates();
      } else {
        const error = await response.json();
        alert(`Failed to add candidate: ${error.message}`);
      }
    } catch (error) {
      alert('Network error while adding candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const candidatesToImport = [];

      // Assume CSV Format: Name, Email, Phone, Location, Qualification, Experience, JobTitle
      // Skip header (i=0)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        if (parts.length < 7) continue;

        const [name, email, phone, location, qualification, experience, jobTitle] = parts.map(p => p.trim());
        
        // Find jobId by title
        const job = jobs.find(j => j.title.toLowerCase() === jobTitle.toLowerCase());
        
        candidatesToImport.push({
          name,
          email,
          phone,
          location,
          qualification,
          experience: parseInt(experience) || 0,
          jobId: job ? job._id : null,
          status: 'Applied',
          referredBy: 'Bulk Import'
        });
      }

      if (candidatesToImport.length === 0) {
        alert('No valid candidate data found in the CSV file.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/candidates/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidatesToImport)
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Success! Imported ${result.count} candidates.`);
          fetchCandidates();
        } else {
          alert('Failed to import candidates.');
        }
      } catch (error) {
        alert('Error during bulk import.');
      } finally {
        setLoading(false);
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsText(file);
  };

  const columns = [
    { 
      header: 'Candidate Name', 
      accessor: 'name',
      render: (row) => (
        <div className="candidate-cell" onClick={() => setSelectedCandidate(row)}>
          <div className="avatar-sm">{row.name.charAt(0)}</div>
          <div className="c-info-col">
            <p className="c-name">{row.name}</p>
            <p className="c-email">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Mobile', accessor: 'mobile' },
    { 
      header: 'Applied Job', 
      accessor: 'job',
      render: (row) => <span>{row.jobId?.title || 'N/A'}</span>
    },
    { 
      header: 'Source', 
      render: (row) => (
        <span className="source-text">{row.referredBy || 'Direct Admin'}</span>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`status-pill pill-${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];

  const getStatusColor = (status) => {
    const map = {
      'Applied': 'gray',
      'Screening': 'blue',
      'Interviewing': 'orange',
      'Selected': 'green',
      'Joined': 'green',
      'Rejected': 'red'
    };
    return map[status] || 'gray';
  };

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Candidate Management</h1>
          <p className="text-secondary">Master master table for all applicants across all jobs and sources.</p>
        </div>
        <div className="header-actions">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".csv" 
            onChange={handleFileUpload} 
          />
          <button className="btn btn-success" onClick={() => fileInputRef.current.click()}>
            Bulk Import (Excel)
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Candidate
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Fetching candidate database...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={candidates} />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Candidate Profile"
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateCandidate} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Register Candidate'}
            </button>
          </>
        )}
      >
        <form className="modal-form" onSubmit={handleCreateCandidate}>
          <div className="modal-body-scroll">
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Enter name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" required placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" required placeholder="City/State" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input type="text" required placeholder="e.g. B.Tech, MBA" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" required placeholder="0" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
              </div>
              <div className="form-group col-span-2">
                <label>Target Job Opportunity</label>
                <select required value={formData.jobId} onChange={(e) => setFormData({...formData, jobId: e.target.value})}>
                  <option value="">Select a Job</option>
                  {jobs.map(job => (
                    <option key={job._id} value={job._id}>{job.title} at {job.company}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-span-2">
                <label>Resume URL (Google Drive/Public Link)</label>
                <input type="text" placeholder="https://link-to-resume.com" value={formData.resumeUrl} onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})} />
              </div>
              <div className="form-group col-span-2">
                <label>Internal Notes</label>
                <textarea placeholder="Background check or referral details..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <SlideOver 
        isOpen={!!selectedCandidate} 
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate?.name || 'Candidate Profile'}
      >
        <div className="profile-drawer-content">
          {/* Quick Stats */}
          <div className="profile-header-stats">
            <div className={`status-pill badge-${getStatusColor(selectedCandidate?.status)}`}>
              {selectedCandidate?.status}
            </div>
            <p className="applied-for">Applying for: <strong>{selectedCandidate?.job}</strong></p>
          </div>

          {/* Contact Details */}
          <div className="drawer-section">
            <h4 className="section-title">Personal Details</h4>
            <div className="details-grid">
              <div className="detail-item">
                <Mail size={16} /> <span>{selectedCandidate?.email}</span>
              </div>
              <div className="detail-item">
                <Phone size={16} /> <span>{selectedCandidate?.mobile}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} /> <span>Pune, Maharashtra</span>
              </div>
              <div className="detail-item">
                <Briefcase size={16} /> <span>Qualification: B.Tech (CSE)</span>
              </div>
              <div className="detail-item">
                <Clock size={16} /> <span>Experience: 4.5 Years</span>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <h4 className="section-title">Recruitment Pipeline</h4>
            <div className="timeline">
              {[
                { stage: 'Lead Created', date: '21 Mar 2024', done: true },
                { stage: 'Contacted', date: '22 Mar 2024', done: true },
                { stage: 'Interested', date: '22 Mar 2024', done: true },
                { stage: 'Screening Done', date: '23 Mar 2024', done: true },
                { stage: 'Interview Scheduled', date: '24 Mar 2024', active: true },
                { stage: 'Selected', date: '-', pending: true },
                { stage: 'Joined', date: '-', pending: true },
              ].map((step, i) => (
                <div key={i} className={`timeline-item ${step.active ? 'active' : ''} ${step.done ? 'done' : ''}`}>
                  <div className="timeline-marker">
                    {step.done ? <CheckCircle2 size={16} /> : step.active ? <Clock size={16} /> : <div className="dot"></div>}
                  </div>
                  <div className="timeline-content">
                    <p className="stage-name">{step.stage}</p>
                    <p className="stage-date">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="drawer-section">
            <h4 className="section-title">Documents</h4>
            <div className="docs-list">
              <div className="doc-item">
                <FileText size={18} />
                <div className="doc-info">
                  <p>Resume_Amit_Kumar.pdf</p>
                  <span>Uploaded 2 days ago</span>
                </div>
                <button className="icon-btn-sm"><ExternalLink size={14} /></button>
              </div>
              <div className="doc-item">
                <Paperclip size={18} />
                <div className="doc-info">
                  <p>Aadhar_Card_Copy.pdf</p>
                  <span>Uploaded 1 day ago</span>
                </div>
                <button className="icon-btn-sm"><ExternalLink size={14} /></button>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <h4 className="section-title">Activity & Notes</h4>
            <div className="notes-box">
              <textarea placeholder="Add a private note..."></textarea>
              <button className="btn btn-primary btn-sm">Post Note</button>
            </div>
            <div className="history-list">
              <div className="history-item">
                <MessageSquare size={14} />
                <div className="history-text">
                  <p><strong>Rahul Sharma</strong>: candidate is very strong in Core Java and Spring Boot. Expecting 15-20% hike.</p>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlideOver>

      <style>{`
        .candidate-cell { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .candidate-cell:hover .c-name { color: var(--accent-blue); }
        .avatar-sm { width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; background-color: #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #475569; font-size: 14px; }
        .c-info-col { display: flex; flex-direction: column; gap: 2px; }
        .c-name { font-size: 14px; font-weight: 600; color: #0F172A; transition: color 0.2s; }
        .c-email { font-size: 13px; color: #64748B; }
        .source-text { font-size: 14px; font-weight: 500; display: block; }
        
        .profile-header-stats { margin-bottom: 24px; padding: 16px; background: #F8FAFC; border-radius: var(--radius-md); }
        .status-pill { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
        .applied-for { font-size: 14px; color: var(--text-secondary); }
        
        .drawer-section { margin-bottom: 32px; }
        .section-title { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        
        .details-grid { display: grid; gap: 12px; }
        .detail-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text-primary); }
        .detail-item svg { color: var(--text-secondary); flex-shrink: 0; }
        
        /* Timeline */
        .timeline { padding-left: 10px; }
        .timeline-item { position: relative; padding-left: 30px; padding-bottom: 24px; border-left: 2px solid #E2E8F0; }
        .timeline-item:last-child { border-left-color: transparent; }
        .timeline-marker { position: absolute; left: -9px; top: 0; width: 16px; height: 16px; background: white; border-radius: 50%; }
        .timeline-item.done { border-left-color: var(--accent-green); }
        .timeline-item.done .timeline-marker { color: var(--accent-green); }
        .timeline-item.active .timeline-marker { color: var(--accent-blue); background: white; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); } 70% { box-shadow: 0 0 0 10px rgba(37,99,235,0); } 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); } }
        .timeline-marker .dot { width: 8px; height: 8px; background: #CBD5E1; border-radius: 50%; margin: 4px; }
        .stage-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .stage-date { font-size: 12px; color: var(--text-secondary); }

        /* Docs */
        .docs-list { display: flex; flex-direction: column; gap: 12px; }
        .doc-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-md); }
        .doc-info { flex: 1; min-width: 0; }
        .doc-info p { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .doc-info span { font-size: 11px; color: var(--text-secondary); }

        /* Notes */
        .notes-box { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .notes-box textarea { width: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px; font-size: 13px; resize: none; min-height: 80px; }
        .history-item { display: flex; gap: 12px; padding: 12px; background: #F8FAFC; border-radius: var(--radius-md); }
        .history-item svg { margin-top: 2px; color: var(--text-secondary); }
        .history-text p { font-size: 13px; line-height: 1.5; }
        .history-text span { font-size: 11px; color: var(--text-secondary); display: block; margin-top: 4px; }
        
        @media (max-width: 768px) {
          .c-name { font-size: 16px !important; }
          .c-email { font-size: 13px !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminCandidates;
