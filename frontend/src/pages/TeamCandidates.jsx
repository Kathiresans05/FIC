import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  User, 
  PhoneCall,
  Search, 
  Filter, 
  Clock, 
  Copy,
  Info,
  Headset,
  AlertCircle
} from 'lucide-react';
import SlideOver from '../components/SlideOver';
import API_BASE_URL from '../api/config';

const TeamCandidates = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeScript, setActiveScript] = useState('Introduction');
  const [candidates, setCandidates] = useState([]);
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');
  const [nextActionTime, setNextActionTime] = useState('');

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
    }
  };

  useEffect(() => {
    if (selectedCandidate) {
      setSelectedStatus(selectedCandidate.status || '');
      setCallNotes('');
      setNextActionDate('');
      setNextActionTime('');
    }
  }, [selectedCandidate]);

  const handleSubmitResult = async () => {
    if (!selectedCandidate || !selectedStatus) return;

    try {
      const payload = {
        status: selectedStatus,
        notes: callNotes
      };
      
      if (nextActionDate) {
        payload.followupDate = `${nextActionDate}T${nextActionTime || '00:00'}`;
      }

      await fetch(`${API_BASE_URL}/api/candidates/${selectedCandidate._id || selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Auto-advance to next candidate
      const currentIndex = candidates.findIndex(c => (c._id || c.id) === (selectedCandidate._id || selectedCandidate.id));
      if (currentIndex !== -1 && currentIndex < candidates.length - 1) {
        setSelectedCandidate(candidates[currentIndex + 1]);
      } else {
        setSelectedCandidate(null);
      }

      fetchCandidates();
    } catch (err) {
      console.error("Error logging call:", err);
    }
  };

  // Calculate live progress for today's calls
  const goalCalls = 50;
  const todayCalls = candidates.filter(c => {
    if (!c.lastContacted) return false;
    const date = new Date(c.lastContacted);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }).length;
  const progressPercent = Math.min(100, goalCalls > 0 ? (todayCalls / goalCalls) * 100 : 0);

  const scriptSections = [
    { name: 'Introduction', content: "Hello {name}, I'm Rahul from Forge India. I'm calling regarding a [Job Title] opening at [Company Name]. Is this a good time to talk?" },
    { name: 'Job Pitch', content: "This is a full-time role based in [Location]. They are looking for someone with [Experience] in [Primary Skill]. The salary range is competitive, up to [Salary]. Are you currently looking for a change?" },
    { name: 'Objection Handling', content: "I understand. Many candidates we speak to have similar concerns. However, [Benefit A] and [Benefit B] make this a unique opportunity. Would you be open to a quick screening call with their technical head?" },
    { name: 'Closing', content: "Great! I'll schedule your first round for [Date/Time]. Please share your updated resume and Aadhar copy on my WhatsApp. I'm sending you the details now." },
  ];

  return (
    <div className="content-wrapper team-candidates">
      <div className="section-header">
        <div>
          <h1>Candidate Calling Panel</h1>
          <p className="text-secondary">Manage your daily calling queue and record candidate responses.</p>
        </div>
        <div className="header-actions">
          <div className="calling-stats-badge">
            <div className="csb-info">
              <span className="csb-label">Today's Progress:</span>
              <span className="csb-val"><strong>{todayCalls}</strong> / {goalCalls} Calls Done</span>
            </div>
            <div className="csb-bar-wrap">
              <div className="mini-progress-wide"><div className="fill" style={{ width: `${progressPercent}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="calling-layout">
        <div className="candidates-column card">
          <div className="column-header">
            <h3>Calling Queue</h3>
            <div className="search-mini">
              <Search size={16} />
              <input type="text" placeholder="Search name..." />
            </div>
          </div>
          <div className="candidates-list">
            {candidates.map((c) => (
              <div key={c._id || c.id} className={`candidate-item ${(selectedCandidate && (selectedCandidate._id || selectedCandidate.id) === (c._id || c.id)) ? 'active' : ''}`} onClick={() => setSelectedCandidate(c)}>
                <div className="c-info">
                  <p className="c-name">{c.name}</p>
                  <p className="c-meta">{c.jobId?.title || c.job || 'Role'} • {c.jobId?.company || c.company || 'Company'}</p>
                </div>
                <div className={`status-dot dot-${(c.status || '').replace(/[\s-]/g, '').toLowerCase()}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="calling-view">
          {selectedCandidate ? (
            <div className="active-call-card card">
              <div className="call-info-bar">
                <div className="user-profile-sm">
                  <div className="avatar-lg">{selectedCandidate.name.charAt(0)}</div>
                  <div>
                    <h2>{selectedCandidate.name}</h2>
                    <p className="phone-num"><Phone size={14} /> {selectedCandidate.phone}</p>
                  </div>
                </div>
                <div className="call-actions-top">
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.open(`tel:${selectedCandidate.phone.replace(/\s/g, '')}`)}
                  >
                    <PhoneCall size={18} /> Call
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => window.open(`https://wa.me/91${selectedCandidate.phone.replace(/\s/g, '')}`, '_blank')}
                  >
                    <MessageSquare size={18} /> WhatsApp
                  </button>
                </div>
              </div>

              <div className="call-main-grid">
                <div className="script-section">
                  <div className="script-tabs">
                    {scriptSections.map((s) => (
                      <button key={s.name} className={`script-tab-btn ${activeScript === s.name ? 'active' : ''}`} onClick={() => setActiveScript(s.name)}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="script-content-box">
                    <div className="content-text">
                      {scriptSections.find(s => s.name === activeScript).content.replace('{name}', selectedCandidate.name)}
                    </div>
                    <button className="copy-btn"><Copy size={16} /> Copy to Clipboard</button>
                  </div>
                  
                  <div className="notes-history">
                    <h4 className="sub-title">Last Activity</h4>
                    <div className="history-pill">
                      <Clock size={14} /> <span>Attempted on {selectedCandidate.lastCall} - No response.</span>
                    </div>
                  </div>
                </div>

                <div className="log-section">
                  <h4 className="sub-title">Log Call Result</h4>
                  <div className="status-grid-log">
                    <button className={`log-btn stat-interested ${selectedStatus === 'Interested' ? 'ring-2 ring-green-500 bg-green-50' : ''}`} onClick={() => setSelectedStatus('Interested')}><CheckCircle2 size={16} /> Interested</button>
                    <button className={`log-btn stat-not-interested ${selectedStatus === 'Not Interested' ? 'ring-2 ring-red-500 bg-red-50' : ''}`} onClick={() => setSelectedStatus('Not Interested')}><XCircle size={16} /> Not Interested</button>
                    <button className={`log-btn stat-follow-up ${selectedStatus === 'Follow-up' ? 'ring-2 ring-orange-500 bg-orange-50' : ''}`} onClick={() => setSelectedStatus('Follow-up')}><Calendar size={16} /> Follow-up</button>
                    <button className={`log-btn stat-wrong ${selectedStatus === 'Wrong Number' ? 'ring-2 ring-gray-400 bg-gray-50' : ''}`} onClick={() => setSelectedStatus('Wrong Number')}><AlertCircle size={16} /> Wrong Number</button>
                    <button className={`log-btn stat-no-answer ${selectedStatus === 'No Answer' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} onClick={() => setSelectedStatus('No Answer')}><PhoneCall size={16} /> No Answer</button>
                    <button className={`log-btn stat-hold ${selectedStatus === 'Hold' || selectedStatus === 'On Hold' ? 'ring-2 ring-purple-500 bg-purple-50' : ''}`} onClick={() => setSelectedStatus('Hold')}><ArrowRight size={16} /> On Hold</button>
                  </div>
                  
                  <div className="form-group-log">
                    <label>Call Notes</label>
                    <textarea 
                      rows={4} 
                      placeholder="Type conversation summary here..."
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                    ></textarea>
                  </div>

                  {selectedStatus === 'Follow-up' && (
                  <div className="form-group-log">
                    <label>Next Action Date & Time</label>
                    <div className="datetime-row">
                      <input 
                        type="date" 
                        value={nextActionDate}
                        onChange={(e) => setNextActionDate(e.target.value)}
                      />
                      <input 
                        type="time" 
                        value={nextActionTime}
                        onChange={(e) => setNextActionTime(e.target.value)}
                      />
                    </div>
                  </div>
                  )}

                  <button 
                    className="btn btn-primary btn-block"
                    onClick={handleSubmitResult}
                    disabled={!selectedStatus}
                  >
                    Submit Result & Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-call-state card">
              <div className="empty-content">
                <div className="empty-icon-wrap">
                  <Headset size={48} strokeWidth={1.5} />
                </div>
                <h3>Select a Candidate</h3>
                <p>Pick a candidate from your daily queue on the left to open the intelligent script panel and log results.</p>
                <button 
                  className="btn btn-primary btn-call-cta"
                  onClick={() => {
                    if (candidates && candidates.length > 0) {
                      setSelectedCandidate(candidates[0]);
                    }
                  }}
                >
                  <Phone size={18} /> Start Calling Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .team-candidates { height: calc(100vh - var(--topbar-height)); display: flex; flex-direction: column; overflow: hidden; }
        .calling-layout { display: flex; gap: 24px; flex: 1; min-height: 0; margin-top: 24px; }
        
        .candidates-column { width: 320px; display: flex; flex-direction: column; padding: 0; overflow: hidden; flex-shrink: 0; }
        .column-header { padding: 20px; border-bottom: 1px solid var(--border); }
        .search-mini { display: flex; align-items: center; gap: 8px; margin-top: 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 4px 10px; }
        .search-mini input { border: none; background: none; outline: none; font-size: 13px; width: 100%; }
        
        .candidates-list { flex: 1; overflow-y: auto; }
        .candidate-item { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; }
        .candidate-item:hover { background: #F8FAFC; }
        .candidate-item.active { background: #EFF6FF; border-left: 4px solid var(--accent-blue); padding-left: 16px; }
        .c-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .c-meta { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-pending { background: #CBD5E1; }
        .dot-followup { background: var(--accent-orange); }
        .dot-interested { background: var(--accent-green); }
        .dot-noresponse { background: var(--accent-red); }
        
        .calling-view { flex: 1; min-width: 0; overflow-y: auto; padding-right: 8px; }
        .active-call-card { display: flex; flex-direction: column; padding: 0; }
        .call-info-bar { padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .user-profile-sm { display: flex; align-items: center; gap: 16px; }
        .avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: #DBEAFE; color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; }
        .phone-num { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
        .call-actions-top { display: flex; gap: 12px; }
        
        .call-main-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 0; }
        .script-section { padding: 24px; border-right: 1px solid var(--border); background: #FDFDFF; }
        .log-section { padding: 24px; }
        
        .script-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .script-tab-btn { padding: 6px 14px; font-size: 12px; font-weight: 600; border-radius: 20px; background: #F1F5F9; color: var(--text-secondary); }
        .script-tab-btn.active { background: var(--primary); color: white; }
        .script-content-box { background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px; position: relative; }
        .content-text { font-size: 16px; color: var(--text-primary); line-height: 1.6; font-style: italic; }
        .copy-btn { margin-top: 16px; font-size: 12px; font-weight: 600; color: var(--accent-blue); display: flex; align-items: center; gap: 6px; }
        
        .sub-title { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
        .history-pill { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #FFF7ED; border: 1px solid #FFEDD5; color: #9A3412; border-radius: var(--radius-md); font-size: 13px; }
        
        .status-grid-log { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        .log-btn { display: flex; align-items: center; gap: 8px; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 13px; font-weight: 600; color: var(--text-primary); transition: 0.2s; }
        .log-btn:hover { background: var(--bg-main); }
        .stat-interested:hover { border-color: var(--accent-green); color: var(--accent-green); }
        .stat-not-interested:hover { border-color: var(--accent-red); color: var(--accent-red); }
        
        .form-group-log { margin-bottom: 20px; }
        .form-group-log label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .form-group-log textarea, .form-group-log input { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 13px; }
        .datetime-row { display: flex; gap: 10px; }
        .btn-block { width: 100%; padding: 12px; font-weight: 700; }
        
        .empty-call-state { height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; }
        .empty-content { max-width: 360px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        .empty-icon-wrap { width: 96px; height: 96px; background: #EFF6FF; border: 2px dashed #93C5FD; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #3B82F6; margin-bottom: 24px; }
        .empty-content h3 { font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
        .empty-content p { font-size: 14px; color: #64748B; line-height: 1.5; margin-bottom: 24px; }
        .mt-20 { margin-top: 20px; }
        .btn-call-cta { font-size: 14px; padding: 12px 24px; display: flex; align-items: center; gap: 8px; }
        
        /* Minimalist Calling Stats Badge */
        .calling-stats-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 8px 18px;
          border-radius: 40px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .csb-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        .csb-label {
          color: var(--text-secondary);
          font-weight: 500;
        }
        .csb-val {
          color: var(--text-primary);
          font-weight: 600;
        }
        .csb-val strong {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .csb-bar-wrap {
          display: flex;
          align-items: center;
        }
        .mini-progress-wide { width: 120px; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden; }
        .mini-progress-wide .fill { height: 100%; background: var(--accent-green); }
      `}</style>
    </div>
  );
};

export default TeamCandidates;
