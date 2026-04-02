import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KpiCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  return (
    <div className={`card kpi-card kpi-card-${color}`}>
      <div className="kpi-header">
        <div className={`kpi-icon-container bg-${color}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="kpi-trend">
          {trend === 'up' ? (
            <span className="trend-up"><TrendingUp size={12} /> +{trendValue}%</span>
          ) : (
            <span className="trend-down"><TrendingDown size={12} /> -{trendValue}%</span>
          )}
        </div>
      </div>
      <div className="kpi-body">
        <h3 className="kpi-value">{value}</h3>
        <p className="kpi-title">{title}</p>
      </div>

      <style>{`
        .kpi-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          min-height: 140px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        
        .kpi-card-blue { background: #F0F7FF; }
        .kpi-card-green { background: #F0FDF4; }
        .kpi-card-orange { background: #FFF7ED; }
        .kpi-card-red { background: #FEF2F2; }
        .kpi-card-purple { background: #F5F3FF; }
        .kpi-card-yellow { background: #FEFCE8; }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07) !important;
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kpi-icon-container {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .bg-blue { background: #0053af; }
        .bg-green { background: #10B981; }
        .bg-orange { background: #F59E0B; }
        .bg-red { background: #EF4444; }
        .bg-purple { background: #8B5CF6; }
        .bg-yellow { background: #EAB308; }
        
        .trend-up { color: #10B981; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .trend-down { color: #EF4444; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        
        .kpi-value {
          font-size: 28px;
          font-weight: 800;
          color: #1E293B;
          margin: 0;
          line-height: 1;
        }
        .kpi-title {
          font-size: 14px;
          color: #64748B;
          font-weight: 600;
          margin: 4px 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default KpiCard;
