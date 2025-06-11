import React, { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  const [crmOpen, setCrmOpen] = useState(false);
  const location = useLocation();

  // Compute sidebar classes based on state
  let sidebarClass = 'sidebar';
  if (open) sidebarClass += ' open';

  // Handle submenu toggle
  const handleCrmToggle = (e) => {
    e.preventDefault();
    setCrmOpen((open) => !open);
  };

  // Optional: close sidebar when a nav link is clicked (mobile)
  const handleNavClick = () => {
    if (window.innerWidth <= 1024 && onClose) onClose();
  };

  return (
    <aside className={sidebarClass}>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
              end
            >
              <i className="fas fa-home"></i>
              <span className="nav-text">Home</span>
            </NavLink>
          </li>
          <li className={`nav-item has-submenu${crmOpen ? ' open' : ''}`}>
            <a
              href="#"
              className="nav-link submenu-toggle"
              onClick={handleCrmToggle}
            >
              <i className="fas fa-users"></i>
              <span>CRM</span>
              <i className="fas fa-chevron-down submenu-arrow"></i>
            </a>
            <ul className="submenu" style={{ display: crmOpen ? 'flex' : 'none' }}>
              <li>
                <NavLink
                  to="/farmers"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={handleNavClick}
                >
                  Farmers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/milk-tracking"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={handleNavClick}
                >
                  Milk Tracking
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/payments"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={handleNavClick}
                >
                  Payments
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink
              to="/sales"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-chart-bar"></i>
              <span className="nav-text">Sales</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/supply"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-truck"></i>
              <span className="nav-text">Supply</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/production"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-industry"></i>
              <span className="nav-text">Production Management</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/quality"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-clipboard-list"></i>
              <span className="nav-text">Quality Reports</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/inventory"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-boxes"></i>
              <span className="nav-text">Inventory</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/investment"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-chart-line"></i>
              <span className="nav-text">Investment Statistics</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
