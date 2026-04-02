import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, ExternalLink, Calendar, Paperclip, MessageSquare } from 'lucide-react';

const SlideOver = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div className={`slideover-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`slideover-panel ${isOpen ? 'open' : ''}`}>
        <div className="slideover-header">
          <div className="title-group">
            <h2 className="slideover-title">{title}</h2>
            <p className="slideover-subtitle">ID: CAN-2024-8842</p>
          </div>
          <button className="icon-btn-sm" onClick={onClose}><X size={24} /></button>
        </div>
        <div className="slideover-body">
          {children}
        </div>
      </div>

      <style>{`
        .slideover-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0);
          pointer-events: none;
          transition: background 0.3s;
          z-index: 1001;
        }
        .slideover-overlay.open {
          background: rgba(15, 23, 42, 0.5);
          pointer-events: auto;
        }
        .slideover-panel {
          position: fixed;
          top: 0;
          right: -480px;
          width: 480px;
          height: 100%;
          background: white;
          box-shadow: -10px 0 30px -5px rgba(0,0,0,0.1);
          z-index: 1002;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .slideover-panel.open {
          right: 0;
        }
        .slideover-header {
          padding: 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .slideover-title { font-size: 20px; font-weight: 700; color: var(--text-primary); }
        .slideover-subtitle { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .slideover-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        @media (max-width: 640px) {
          .slideover-panel { width: 100%; right: -100%; }
        }
      `}</style>
    </>
  );
};

export default SlideOver;
