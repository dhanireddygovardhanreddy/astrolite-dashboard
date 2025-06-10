import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import MonthlyChart from './charts/MonthlyChart';
import DailyChart from './charts/DailyChart';
import SalesChart from './charts/SalesChart';

const statCards1 = [
  {
    icon: 'fa-wine-bottle',
    title: 'TOTAL MILK',
    value: '45,200 L',
    change: '12.5%',
    changeType: 'positive',
  },
  {
    icon: 'fa-rupee-sign',
    title: 'TOTAL SALES',
    value: '₹2,500,000',
    change: '18.2%',
    changeType: 'positive',
  },
  {
    icon: 'fa-users',
    title: 'NUMBER OF FARMERS',
    value: '9,000+',
    change: '5.7%',
    changeType: 'positive',
  },
  {
    icon: 'fa-truck',
    title: 'DISTRIBUTORS',
    value: '1,800',
    change: '8.3%',
    changeType: 'positive',
  },
];

const statCards2 = [
  {
    icon: 'fa-chart-line',
    title: 'GROWTH RATE',
    value: '18.0%',
  },
  {
    icon: 'fa-user-tie',
    title: 'EMPLOYEE MANAGEMENT',
    value: '79%',
    change: '2.1%',
    changeType: 'positive',
  },
  {
    icon: 'fa-bullseye',
    title: 'TARGET ACHIEVEMENT',
    value: '92%',
    subtext: '5% above target',
  },
  {
    icon: 'fa-exclamation-triangle',
    title: 'QUALITY ALERTS',
    value: '12',
  },
];

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div>
      <Header theme={theme} setTheme={setTheme} />
      <Sidebar />
      <main className="main-content">
        <div className="dashboard-content">
          <div className="stats-grid">
            {statCards1.map((card, idx) => (
              <StatCard key={idx} {...card} />
            ))}
          </div>
          <div className="stats-grid">
            {statCards2.map((card, idx) => (
              <StatCard key={idx} {...card} />
            ))}
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-indicator"></div>
                <h3>Monthly Milk Production (L)</h3>
              </div>
              <div className="chart-container">
                <MonthlyChart />
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-indicator"></div>
                <h3>Daily Milk Production (L)</h3>
              </div>
              <div className="chart-container">
                <DailyChart />
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-indicator"></div>
                <h3>Sales Breakdown</h3>
              </div>
              <div className="chart-container">
                <SalesChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
