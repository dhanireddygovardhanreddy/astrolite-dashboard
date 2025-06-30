import React, { useState, useRef, useEffect } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Header = ({
  theme,
  setTheme,
  onSidebarToggle,
}) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'EN');
  const { user, setUser } = useUser(); // Added setUser
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout logic
  const handleLogout = () => {
    setUser(null); // clear user context
    localStorage.clear(); // clear any persisted data if needed
    navigate("/"); // redirect to login page (adjust route as needed)
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
        <div className="user-profile" ref={menuRef} style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="User"
            className="user-avatar"
          />
          <span
            className="user-name"
            style={{ cursor: "pointer" }}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {user ? user.name : "Guest"}
          </span>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: 6,
                zIndex: 10,
                minWidth: 120,
                padding: 8,
              }}
            >
              <button
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "8px 0",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "#333"
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
