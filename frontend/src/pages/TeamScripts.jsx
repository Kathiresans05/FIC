import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  FileText, 
  Copy, 
  Check, 
  Globe, 
  UserSquare2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import API_BASE_URL from '../api/config';

const TeamScripts = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Initial Calling', 'Follow-up', 'Interview Scheduling', 'WhatsApp Template', 'Objection Handling'];

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          script.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || script.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="content-wrapper">
      <div className="section-header">
        <div>
          <h1>Call Scripts & Templates</h1>
          <p className="text-secondary">Standardized scripts and WhatsApp templates for consistent communication.</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search scripts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filter-scroll-container">
        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Loading call scripts...</p>
        </div>
      ) : filteredScripts.length > 0 ? (
        <div className="team-scripts-grid">
          {filteredScripts.map((script) => (
            <div key={script._id} className="card team-script-card">
              <div className="ts-header">
                <div className="ts-icon-box">
                  {script.category === 'WhatsApp Template' ? <MessageSquare size={20} /> : <FileText size={20} />}
                </div>
                <div className="ts-meta">
                  <span className="badge badge-indigo">{script.category}</span>
                  <div className="ts-tags">
                    <span className="tag"><Globe size={12} /> {script.language}</span>
                    <span className="tag"><UserSquare2 size={12} /> {script.assignedJobs}</span>
                  </div>
                </div>
              </div>

              <div className="ts-content-area">
                <h3 className="ts-title">{script.name}</h3>
                <div className="ts-body-scroll">
                  <pre className="ts-raw-content">
                    {script.content}
                  </pre>
                </div>
              </div>

              <div className="ts-footer">
                <button 
                  className={`btn-copy ${copiedId === script._id ? 'copied' : ''}`}
                  onClick={() => handleCopy(script._id, script.content)}
                >
                  {copiedId === script._id ? <Check size={16} /> : <Copy size={16} />}
                  {copiedId === script._id ? 'Copied' : 'Copy Content'}
                </button>
                <span className="ts-ver">Version {script.version || '1.0'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle size={48} className="text-secondary opacity-20" />
          <p>{searchTerm || activeCategory !== 'All' ? 'No scripts match your filters.' : 'No scripts have been published by Admin yet.'}</p>
        </div>
      )}

      <style>{`
        .search-bar { display: flex; align-items: center; gap: 12px; background: white; padding: 10px 18px; border-radius: 12px; border: 1px solid var(--border); width: 320px; transition: 0.2s; }
        .search-bar:focus-within { border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .search-bar input { border: none; outline: none; font-size: 14px; width: 100%; color: var(--text-primary); }
        
        .filter-scroll-container { margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px; }
        .category-filters { display: flex; gap: 10px; }
        .filter-chip { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; background: white; color: var(--text-secondary); border: 1px solid var(--border); cursor: pointer; transition: 0.2s; white-space: nowrap; }
        .filter-chip:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
        .filter-chip.active { background: var(--accent-blue); color: white; border-color: var(--accent-blue); }
        
        .team-scripts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
        .team-script-card { display: flex; flex-direction: column; gap: 20px; padding: 24px; height: 480px; }
        
        .ts-header { display: flex; gap: 16px; align-items: flex-start; }
        .ts-icon-box { width: 44px; height: 44px; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: var(--accent-blue); flex-shrink: 0; }
        .ts-meta { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .ts-tags { display: flex; gap: 12px; flex-wrap: wrap; }
        .tag { font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; font-weight: 500; }
        
        .ts-content-area { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px; }
        .ts-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .ts-body-scroll { flex: 1; background: #F8FAFC; border: 1px solid var(--border); border-radius: 12px; padding: 16px; overflow-y: auto; }
        .ts-raw-content { font-family: inherit; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-break: break-word; }
        
        .ts-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border); }
        .btn-copy { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); background: white; font-size: 13px; font-weight: 600; color: var(--text-primary); cursor: pointer; transition: 0.2s; }
        .btn-copy:hover { border-color: var(--accent-blue); color: var(--accent-blue); background: #F0F7FF; }
        .btn-copy.copied { background: #10B981; color: white; border-color: #10B981; }
        .ts-ver { font-size: 11px; font-weight: 700; color: #CBD5E1; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px; gap: 16px; color: var(--text-secondary); background: white; border: 2px dashed var(--border); border-radius: var(--radius-lg); width: 100%; box-sizing: border-box; }
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px; gap: 16px; color: var(--text-secondary); width: 100%; }
        
        @media (max-width: 640px) {
          .team-scripts-grid { grid-template-columns: 1fr; }
          .search-bar { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TeamScripts;
