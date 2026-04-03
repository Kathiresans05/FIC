import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Plus, 
  Search, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Globe, 
  UserSquare2,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const AdminScripts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingScript, setViewingScript] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Initial Calling',
    language: 'English',
    assignedJobs: 'All',
    content: ''
  });

  const fetchScripts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/scripts`);
      const data = await response.json();
      setScripts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleSaveScript = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', category: 'Initial Calling', language: 'English', assignedJobs: 'All', content: '' });
        fetchScripts();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.message}`);
      }
    } catch (error) {
      alert('Network error while saving script');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this script?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/scripts/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchScripts();
      }
    } catch (error) {
      alert('Error deleting script');
    }
  };

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Script Management</h1>
          <p className="text-secondary">Create and manage calling scripts, WhatsApp templates, and objection handlers.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create New Script
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin text-accent-blue" size={40} />
          <p>Fetching your scripts...</p>
        </div>
      ) : (
        <div className="scripts-grid">
          {scripts.map((script) => (
            <div key={script._id} className="card script-card">
              <div className="script-header">
                <div className="script-icon">
                  {script.category === 'WhatsApp Template' ? <MessageSquare size={20} /> : <FileText size={20} />}
                </div>
                <div className="script-meta">
                  <span className="badge badge-blue">{script.category}</span>
                  <span className="version-tag">{script.version || 'v1.0'}</span>
                </div>
              </div>
              
              <div className="script-body">
                <h3 className="script-name">{script.name}</h3>
                <div className="script-info">
                  <div className="info-item"><Globe size={14} /> <span>{script.language}</span></div>
                  <div className="info-item"><UserSquare2 size={14} /> <span>{script.assignedJobs}</span></div>
                </div>
              </div>

              <div className="script-footer">
                <span className="text-xs text-secondary">
                  Updated: {new Date(script.updatedAt).toLocaleDateString()}
                </span>
                <div className="card-actions">
                  <button className="icon-btn-sm text-red" onClick={() => handleDelete(script._id)}>
                    <Trash2 size={16} />
                  </button>
                  <button className="icon-btn-sm text-blue" onClick={() => setViewingScript(script)}>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {scripts.length === 0 && (
            <div className="empty-state col-span-3">
              <FileText size={48} className="text-secondary opacity-20" />
              <p>No scripts created yet. Use the button above to create one.</p>
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Calling Script"
        footer={(
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveScript} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Script'}
            </button>
          </>
        )}
      >
        <form className="modal-form" onSubmit={handleSaveScript}>
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>Script Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. BPO Inbound Sales Script" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Initial Calling">Initial Calling</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Interview Scheduling">Interview Scheduling</option>
                <option value="WhatsApp Template">WhatsApp Template</option>
                <option value="Objection Handling">Objection Handling</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select 
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual (Hindi + English)">Bilingual (Hindi + English)</option>
              </select>
            </div>
            <div className="form-group col-span-2">
              <label>Assigned Job Roles</label>
              <input 
                type="text" 
                placeholder="Select jobs or 'All'..." 
                value={formData.assignedJobs}
                onChange={(e) => setFormData({...formData, assignedJobs: e.target.value})}
              />
            </div>
            <div className="form-group col-span-2">
              <label>Script Content</label>
              <div className="editor-placeholder">
                <div className="editor-toolbar">
                  <span>B</span> <span>I</span> <span>U</span> | <span>Link</span> | <span>Tags: {'{name}, {company}, {salary}'}</span>
                </div>
                <textarea 
                  rows={10} 
                  required
                  placeholder="Type your script here... use {curly_braces} for dynamic variables."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={!!viewingScript} 
        onClose={() => setViewingScript(null)}
        title={viewingScript?.name || "View Script"}
        footer={(
          <button className="btn btn-primary" onClick={() => setViewingScript(null)}>Close</button>
        )}
      >
        {viewingScript && (
          <div className="script-view-container" style={{ padding: '0 8px 16px' }}>
            <div className="script-meta-header" style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{viewingScript.category}</span>
              <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}><Globe size={14} /> {viewingScript.language}</span>
              <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}><UserSquare2 size={14} /> {viewingScript.assignedJobs}</span>
            </div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px', display: 'block' }}>Script Content</label>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
              <pre style={{ fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                {viewingScript.content}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .scripts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .empty-state { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px; gap: 16px; background: #F8FAFC; border: 2px dashed #E2E8F0; border-radius: var(--radius-lg); color: var(--text-secondary); }
        .script-card { display: flex; flex-direction: column; gap: 16px; transition: 0.2s; }
        .script-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        
        .script-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .script-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: var(--accent-blue); }
        .script-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .version-tag { font-size: 11px; font-weight: 600; color: var(--text-secondary); background: #F1F5F9; padding: 2px 6px; border-radius: 4px; }
        
        .script-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
        .script-info { display: flex; gap: 16px; margin-top: 8px; }
        .info-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
        
        .script-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 16px; border-top: 1px solid var(--border); }
        .card-actions { display: flex; gap: 8px; }
        .icon-btn-sm { cursor: pointer; border: none; background: none; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: 0.2s; }
        .icon-btn-sm:hover { background: #f1f5f9; }
        .text-red { color: var(--accent-red); }
        .text-blue { color: var(--accent-blue); }

        .editor-placeholder { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; margin-top: 8px; }
        .editor-toolbar { padding: 8px 12px; background: #F8FAFC; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text-secondary); display: flex; gap: 12px; }
        .editor-toolbar span { cursor: pointer; font-weight: 600; }
        .editor-placeholder textarea { border: none; width: 100%; padding: 12px; font-size: 14px; background: white; resize: none; outline: none; box-sizing: border-box; }
        
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px; gap: 16px; color: var(--text-secondary); }
        .modal-form { display: flex; flex-direction: column; gap: 24px; margin-top: 8px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .col-span-2 { grid-column: span 2; }
        .form-group label { font-size: 14px; font-weight: 600; color: #1E293B; }
        .form-group input, .form-group select { padding: 10px 14px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; color: #0F172A; width: 100%; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; background-color: #FFFFFF; }
        .form-group input:focus, .form-group select:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(0, 83, 175, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminScripts;
