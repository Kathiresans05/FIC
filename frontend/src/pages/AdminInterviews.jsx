import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  Phone, 
  MoreVertical, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const AdminInterviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    candidate: '',
    job: '',
    date: '',
    time: '',
    type: 'Video Call',
    mode: '',
    interviewer: 'Rahul Sharma (Recruitment Manager)'
  });

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews`);
      const data = await response.json();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!formData.candidate || !formData.date || !formData.time || !formData.mode) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          candidate: '',
          job: '',
          date: '',
          time: '',
          type: 'Video Call',
          mode: '',
          interviewer: 'Rahul Sharma (Recruitment Manager)'
        });
        fetchInterviews();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.message}`);
      }
    } catch (error) {
      alert('Network error while scheduling interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CalendarView = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const changeMonth = (offset) => {
      setCurrentDate(new Date(year, month + offset, 1));
    };

    const isToday = (day) => {
      const today = new Date();
      return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const getInterviewsForDate = (day) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return interviews.filter(i => i.date === dateStr);
    };

    return (
      <div className="card calendar-card shadow-lg">
        <div className="calendar-header-elite">
          <div className="nav-controls-elite">
            <button className="nav-circle-btn" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={20} />
            </button>
            <h2 className="current-month-display">{monthName} <span className="year-text">{year}</span></h2>
            <button className="nav-circle-btn" onClick={() => changeMonth(1)}>
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="btn btn-outline btn-today" onClick={() => setCurrentDate(new Date())}>Today</button>
        </div>
        
        <div className="calendar-grid-elite">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="weekday-header-elite">{d}</div>
          ))}
          
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day-elite empty"></div>
          ))}
          
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dayInterviews = getInterviewsForDate(day);
            return (
              <div key={day} className={`calendar-day-elite ${isToday(day) ? 'is-today' : ''}`}>
                <div className="day-info-row">
                  <span className="day-num-display">{day}</span>
                  {dayInterviews.length > 0 && <span className="event-dot"></span>}
                </div>
                <div className="day-events-stack">
                  {dayInterviews.slice(0, 3).map((int, idx) => (
                    <div key={idx} className={`mini-event pill-${getStatusColor(int.status)}`}>
                      <span className="mini-event-name">{int.candidate}</span>
                    </div>
                  ))}
                  {dayInterviews.length > 3 && (
                    <span className="plus-more">+{dayInterviews.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const columns = [
    { 
      header: 'Candidate', 
      accessor: 'candidate',
      render: (row) => (
        <div className="candidate-cell">
          <div className="avatar-sm">{row.candidate.charAt(0)}</div>
          <div>
            <p className="font-semibold">{row.candidate}</p>
            <p className="text-xs text-secondary">{row.job}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Date & Time', 
      accessor: 'date',
      render: (row) => (
        <div className="datetime-cell">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon size={14} className="text-secondary" /> {row.date}
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary mt-1">
            <Clock size={14} /> {row.time}
          </div>
        </div>
      )
    },
    { 
      header: 'Type / Mode', 
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.type === 'Video Call' ? <Video size={16} className="text-blue" /> : row.type === 'Face to Face (F2F)' ? <MapPin size={16} className="text-orange" /> : <Phone size={16} className="text-green" />}
          <span className="text-sm">{row.type} - {row.mode}</span>
        </div>
      )
    },
    { header: 'Interviewer', accessor: 'interviewer' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`badge badge-${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: () => (
        <button className="icon-btn-sm">
          <MoreVertical size={16} />
        </button>
      )
    }
  ];

  const getStatusColor = (status) => {
    const map = {
      'Scheduled': 'blue',
      'Completed': 'green',
      'Rescheduled': 'orange',
      'Cancelled': 'red',
      'No Show': 'gray'
    };
    return map[status] || 'gray';
  };

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Interview Management</h1>
          <p className="text-secondary">Track, schedule and manage all candidate interviews.</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Schedule Interview
          </button>
        </div>
      </div>

      <div className="interview-stats-grid">
        <div className="card stat-item">
          <div className="stat-icon bg-blue-lite"><CalendarIcon size={20} /></div>
          <div className="stat-data">
            <p className="val">{interviews.length}</p>
            <p className="lbl">Total</p>
          </div>
        </div>
        <div className="card stat-item">
          <div className="stat-icon bg-green-lite"><CheckCircle2 size={20} /></div>
          <div className="stat-data">
            <p className="val">{interviews.filter(i => i.status === 'Completed').length}</p>
            <p className="lbl">Completed</p>
          </div>
        </div>
        <div className="card stat-item">
          <div className="stat-icon bg-orange-lite"><AlertCircle size={20} /></div>
          <div className="stat-data">
            <p className="val">{interviews.filter(i => i.status === 'Scheduled').length}</p>
            <p className="lbl">Upcoming</p>
          </div>
        </div>
        <div className="card stat-item">
          <div className="stat-icon bg-red-lite"><XCircle size={20} /></div>
          <div className="stat-data">
            <p className="val">{interviews.filter(i => i.status === 'Cancelled').length}</p>
            <p className="lbl">Cancelled</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin text-accent-blue" size={40} />
          <p>Loading interviews...</p>
        </div>
      ) : viewMode === 'list' ? (
        <DataTable columns={columns} data={interviews} actions={false} />
      ) : (
        <CalendarView />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Interview"
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSchedule} disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Now'}
            </button>
          </>
        )}
      >
        <form className="modal-form" onSubmit={handleSchedule}>
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>Candidate Name</label>
              <input 
                type="text" 
                required
                placeholder="Select candidate..." 
                value={formData.candidate}
                onChange={(e) => setFormData({...formData, candidate: e.target.value})}
              />
            </div>
            <div className="form-group col-span-2">
              <label>Job Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Java Developer" 
                value={formData.job}
                onChange={(e) => setFormData({...formData, job: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Interview Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <input 
                type="time" 
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Interview Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Video Call">Video Call</option>
                <option value="Face to Face (F2F)">Face to Face (F2F)</option>
                <option value="Telephonic">Telephonic</option>
              </select>
            </div>
            <div className="form-group">
              <label>Meeting Platform / Venue</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Google Meet, Zoom or Office Location" 
                value={formData.mode}
                onChange={(e) => setFormData({...formData, mode: e.target.value})}
              />
            </div>
            <div className="form-group col-span-2">
              <label>Assigned Interviewer</label>
              <select 
                value={formData.interviewer}
                onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
              >
                <option value="Rahul Sharma (Recruitment Manager)">Rahul Sharma (Recruitment Manager)</option>
                <option value="Anjali Sharma (Team Lead)">Anjali Sharma (Team Lead)</option>
                <option value="Karan Mehra (Consultancy Executive)">Karan Mehra (Consultancy Executive)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <style>{`
        .candidate-cell { display: flex; align-items: center; gap: 12px; }
        .avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-secondary); font-size: 14px; }
        
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px; gap: 16px; color: var(--text-secondary); }
        .view-toggle { display: flex; background: #F1F5F9; border-radius: 8px; padding: 4px; gap: 4px; }
        .toggle-btn { padding: 8px 16px; font-size: 13px; font-weight: 600; border-radius: 6px; transition: 0.2s; color: #64748B; background: none; border: none; cursor: pointer; }
        .toggle-btn.active { background: white; color: var(--accent-blue); box-shadow: var(--shadow-sm); }
        
        .interview-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-item { display: flex; align-items: center; gap: 16px; padding: 24px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .bg-blue-lite { background: #EFF6FF; color: #3B82F6; }
        .bg-green-lite { background: #F0FDF4; color: #10B981; }
        .bg-orange-lite { background: #FFF7ED; color: #F59E0B; }
        .bg-red-lite { background: #FEF2F2; color: #EF4444; }
        .stat-data .val { font-size: 24px; font-weight: 700; color: var(--text-primary); }
        .stat-data .lbl { font-size: 13px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
        
        .datetime-cell { display: flex; flex-direction: column; }
        .items-center { display: flex; align-items: center; }
        .gap-2 { gap: 8px; }

        /* Calendar Elite Styles */
        .calendar-card { border-radius: 20px; overflow: hidden; border: none; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); }
        .calendar-header-elite { padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; background: white; border-bottom: 1px solid #F1F5F9; }
        .nav-controls-elite { display: flex; align-items: center; gap: 32px; }
        .nav-circle-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #E2E8F0; background: white; color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; }
        .nav-circle-btn:hover { background: #F8FAFC; border-color: var(--accent-blue); color: var(--accent-blue); transform: scale(1.05); }
        .current-month-display { font-size: 22px; font-weight: 800; color: #0F172A; min-width: 220px; text-align: center; }
        .year-text { color: #94A3B8; font-weight: 500; font-size: 20px; margin-left: 4px; }
        .btn-today { border-radius: 10px; font-weight: 600; padding: 8px 18px; }

        .calendar-grid-elite { display: grid; grid-template-columns: repeat(7, 1fr); background: #F1F5F9; gap: 1px; }
        .weekday-header-elite { background: #F8FAFC; padding: 16px; text-align: center; font-size: 11px; font-weight: 700; color: #94A3B8; letter-spacing: 0.1em; }

        .calendar-day-elite { background: white; min-height: 150px; padding: 12px; transition: all 0.2s ease; position: relative; display: flex; flex-direction: column; gap: 12px; }
        .calendar-day-elite:not(.empty):hover { background: #F8FAFF; z-index: 10; box-shadow: inset 0 0 0 1px var(--accent-blue); }
        .calendar-day-elite.empty { background: #FCFDFF; }
        
        .day-info-row { display: flex; justify-content: space-between; align-items: center; }
        .day-num-display { font-size: 14px; font-weight: 700; color: #64748B; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; }
        .is-today .day-num-display { background: var(--accent-blue); color: white; box-shadow: 0 4px 10px rgba(37,99,235,0.3); }
        .event-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-blue); }

        .day-events-stack { display: flex; flex-direction: column; gap: 4px; }
        .mini-event { padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; text-align: left; transition: all 0.2s; border-left: 3px solid transparent; }
        .mini-event:hover { transform: translateX(2px); }
        .mini-event-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

        .pill-blue { background: #EFF6FF; color: #1E40AF; border-left-color: #3B82F6; }
        .pill-green { background: #F0FDF4; color: #166534; border-left-color: #22C55E; }
        .pill-orange { background: #FFF7ED; color: #9A3412; border-left-color: #F59E0B; }
        .pill-red { background: #FEF2F2; color: #991B1B; border-left-color: #EF4444; }
        .pill-gray { background: #F8FAFC; color: #475569; border-left-color: #94A3B8; }

        .plus-more { font-size: 11px; font-weight: 700; color: var(--accent-blue); text-align: center; margin-top: 4px; }

        @media (max-width: 1024px) {
          .calendar-day-elite { min-height: 110px; padding: 8px; }
          .current-month-display { font-size: 18px; min-width: 150px; }
          .nav-circle-btn { width: 32px; height: 32px; }
        }

        @media (max-width: 768px) {
          .calendar-header-elite { flex-direction: column; gap: 20px; padding: 20px; }
          .nav-controls-elite { width: 100%; justify-content: space-between; gap: 10px; }
          .current-month-display { font-size: 16px; min-width: auto; }
          .calendar-day-elite { min-height: 80px; }
          .mini-event-name { display: none; }
          .mini-event { height: 8px; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminInterviews;
