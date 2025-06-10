import React, { useState } from 'react';

const Header = ({
  theme,
  setTheme,
  onSidebarToggle,
}) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'EN');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img
            src="https://www.astrolitetech.com/assets/uploads/logo.png"
            alt="Company logo"
            className="logo-image"
          />
          {/* SINGLE TOGGLE BUTTON */}
          <button className="sidebar-toggle" onClick={onSidebarToggle}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
      <div className="search-container">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search...." className="search-input" />
      </div>
      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
        <select
          className="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="EN">EN</option>
          <option value="FR">FR</option>
          <option value="DE">DE</option>
          <option value="ES">ES</option>
        </select>
        <div className="notification-container">
          <button
            className="notification-btn"
            onClick={() => alert('You have 3 new notifications!')}
          >
            <span className="notification-badge">3</span>
            <i className="fas fa-bell"></i>
          </button>
        </div>
        <div className="user-profile">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="User"
            className="user-avatar"
          />
          <span className="user-name">Dhanireddy Govardhan Reddy</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
