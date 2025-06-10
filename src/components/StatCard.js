import React from 'react';

const StatCard = ({ icon, title, value, change, changeType, subtext }) => (
  <div className="stat-card">
    <div className="stat-content">
      <div className="stat-info">
        <div className="stat-icon">
          <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtext && <p className="stat-subtext">{subtext}</p>}
        {change && (
          <div className={`stat-change ${changeType}`}>
            <i className={`fas fa-arrow-${changeType === 'positive' ? 'up' : 'down'}`}></i>
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StatCard;
