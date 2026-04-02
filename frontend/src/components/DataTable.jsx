import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';

const DataTable = ({ columns, data, actions, filters, onEdit, onDelete }) => {
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const currentPage = 1; // Placeholder for future state-based pagination

  return (
    <div className="card table-card">
      <div className="table-header">
        <div className="table-search">
          <div className="search-box-inner">
            <Search size={18} />
            <input type="text" placeholder="Search records..." />
          </div>
          <button className="btn btn-outline btn-sm">
            <Filter size={16} /> Filters
          </button>
        </div>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ width: col.width || 'auto' }}>{col.header}</th>
              ))}
              {actions && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j} data-label={col.header}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className="text-right" data-label="Actions">
                    <div className="action-btns">
                      {onEdit && (
                        <button className="icon-btn-sm edit-btn" onClick={() => onEdit(row)}>
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button className="icon-btn-sm delete-btn" onClick={() => onDelete(row)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                      {!onEdit && !onDelete && (
                        <button className="icon-btn-sm">
                          <MoreVertical size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center" style={{ padding: '40px', color: '#94A3B8' }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p className="footer-text">
          Showing {data.length > 0 ? 1 : 0} to {data.length} of {data.length} entries
        </p>
        <div className="pagination">
          <button className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}>
            <ChevronLeft size={16} />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i + 1} 
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}

          <button className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .table-card { padding: 0; overflow: hidden; box-shadow: var(--shadow-md); background: #FFFFFF; border: 1px solid var(--border); border-radius: var(--radius-lg); }
        .table-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: #FFFFFF; }
        .table-search { display: flex; gap: 20px; align-items: center; }
        .search-box-inner { display: flex; align-items: center; gap: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 18px; width: 360px; transition: all 0.2s ease; }
        .search-box-inner:focus-within { border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); background: white; }
        .search-box-inner input { border: none; background: none; outline: none; font-size: 14px; width: 100%; color: var(--text-primary); }
        .btn-sm { padding: 10px 20px; font-size: 14px; }
        
        .table-responsive { overflow-x: auto; }
        .custom-table { width: 100%; border-collapse: collapse; text-align: left; }
        .custom-table th { padding: 18px 32px; background: #F8FAFC; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
        .custom-table td { padding: 24px 32px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text-primary); vertical-align: middle; }
        .custom-table tbody tr { transition: 0.2s; }
        .custom-table tbody tr:hover { background-color: #F8FAFF; cursor: pointer; }
        
        .table-footer { padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; border-top: 1px solid var(--border); }
        .footer-text { font-size: 13px; color: var(--text-secondary); }
        .pagination { display: flex; gap: 8px; }
        .page-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: var(--radius-md); background: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; color: var(--text-secondary); }
        .page-btn:hover:not(.disabled) { border-color: var(--accent-blue); color: var(--accent-blue); background: #F8FAFF; }
        .page-btn.active { background: var(--accent-blue); color: white; border-color: var(--accent-blue); }
        .page-btn.disabled { opacity: 0.4; cursor: not-allowed; }
        .icon-btn-sm { color: #94A3B8; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; }
        .icon-btn-sm:hover { background: #F1F5F9; color: var(--accent-blue); }
        .text-right { text-align: right; }
        .action-btns { display: flex; gap: 8px; justify-content: flex-end; }
        .edit-btn:hover { color: #2563EB; background: #DBEAFE; }
        .delete-btn:hover { color: #DC2626; background: #FEE2E2; }
        
        @media (max-width: 768px) {
          /* Lightweight Mobile Layout Overrides */
          .table-card { background: transparent; border: none; box-shadow: none; padding: 0; width: 100%; margin: 0; }
          .table-header { 
            background: transparent; 
            border-bottom: none; 
            padding: 0 0 20px 0; 
            flex-direction: column; 
            align-items: stretch; 
            gap: 12px; 
            width: 100%;
          }
          .table-search { 
            flex-direction: column; 
            gap: 12px; 
            width: 100%;
          }
          .search-box-inner { 
            width: 100%; 
            background: #FFFFFF; 
            border: 1px solid #E2E8F0; 
            border-radius: 10px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            box-sizing: border-box;
          }
          /* Align Filter/Export */
          .table-header .btn {
            width: 100%;
            justify-content: center;
            background: #FFFFFF;
            font-weight: 600;
          }
          .table-actions { 
            display: flex; 
            width: 100%;
          }
          
          /* Table to Card Overrides */
          .table-responsive { overflow-x: visible; }
          .custom-table, .custom-table tbody, .custom-table tr, .custom-table td { display: block; width: 100%; box-sizing: border-box; }
          .custom-table thead { display: none; }
          
          /* Row Cards */
          .custom-table tr { 
            margin-bottom: 24px; 
            border: 1px solid #E2E8F0; 
            border-radius: 12px; 
            background: #FFFFFF; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            overflow: hidden;
            transition: all 0.2s; 
          }
          .custom-table tbody tr:hover { transform: none; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #CBD5E1; }
          
          /* Cell layout (Label on top, Value on bottom) */
          .custom-table td { 
            display: flex; 
            flex-direction: column; 
            align-items: flex-start;
            padding: 16px 20px; 
            border-bottom: 1px solid #F1F5F9; 
            text-align: left !important;
            white-space: normal !important; 
            min-height: auto;
            color: #1E293B;
            font-size: 15px;
            font-weight: 500;
          }
          .custom-table td:last-child { border-bottom: none; }
          
          /* Dynamic Data Labels (Deep Slate Blue) */
          .custom-table td::before { 
            content: attr(data-label); 
            display: block;
            font-size: 10px; 
            font-weight: 700; 
            color: #475569; 
            text-transform: uppercase; 
            margin-bottom: 8px;
            letter-spacing: 0.1em;
          }
          
          /* Footer */
          .table-footer { 
            background: transparent; 
            padding: 24px 0; 
            border-top: 1px solid #E2E8F0;
            flex-direction: column; 
            gap: 16px; 
            text-align: center; 
          }
          .pagination { justify-content: center; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default DataTable;
