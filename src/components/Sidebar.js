import React, { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  const [crmOpen, setCrmOpen] = useState(false);
  const location = useLocation();

  // Sidebar open/close classes
  let sidebarClass = 'modern-sidebar';
  if (open) sidebarClass += ' open';

  // Submenu toggle
  const handleCrmToggle = (e) => {
    e.preventDefault();
    setCrmOpen(open => !open);
  };

  // Close sidebar on nav link click (mobile)
  const handleNavClick = () => {
    if (window.innerWidth <= 1024 && onClose) onClose();
  };

  return (
    <aside className={sidebarClass}>
      <nav className="modern-sidebar-nav">
        <ul className="modern-nav-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
              end
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </NavLink>
          </li>
          <li className={`has-submenu${crmOpen ? ' open' : ''}`}>
            <a
              href="#"
              className="modern-nav-link submenu-toggle"
              onClick={handleCrmToggle}
            >
              <i className="fas fa-users"></i>
              <span>CRM</span>
              <i className="fas fa-chevron-down submenu-arrow"></i>
            </a>
            <ul className="modern-submenu" style={{ display: crmOpen ? 'flex' : 'none' }}>
              <li>
                <NavLink
                  to="/farmers"
                  className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
                  onClick={handleNavClick}
                >
                  Farmers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/milk"
                  className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
                  onClick={handleNavClick}
                >
                  Milk Tracking
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/payments"
                  className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
                  onClick={handleNavClick}
                >
                  Payments
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/sales"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Sales</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logistics"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-truck"></i>
              <span>Supply</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/production"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-industry"></i>
              <span>Production</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/quality"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>Quality</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/inventory"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-boxes"></i>
              <span>Inventory</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/investment"
              className={({ isActive }) => `modern-nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <i className="fas fa-chart-line"></i>
              <span>Investment</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
