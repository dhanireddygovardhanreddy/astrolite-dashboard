import React, { useState } from 'react';

const Sidebar = ({ collapsed, open, onClose }) => {
  const [crmOpen, setCrmOpen] = useState(false);

  // Compute sidebar classes based on state
  let sidebarClass = 'sidebar';
  if (collapsed) sidebarClass += ' collapsed';
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
          <li className="nav-item active">
            <a href="/" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-home"></i>
              <span className="nav-text">Home</span>
            </a>
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
                <a href="#" className="nav-link" onClick={handleNavClick}>
                  Farmers
                </a>
              </li>
              <li>
                <a href="#" className="nav-link" onClick={handleNavClick}>
                  Milk Tracking
                </a>
              </li>
              <li>
                <a href="#" className="nav-link" onClick={handleNavClick}>
                  Payments
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-chart-bar"></i>
              <span className="nav-text">Sales</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-truck"></i>
              <span className="nav-text">Supply</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-industry"></i>
              <span className="nav-text">Production Management</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-clipboard-list"></i>
              <span className="nav-text">Quality Reports</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-boxes"></i>
              <span className="nav-text">Inventory</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleNavClick}>
              <i className="fas fa-chart-line"></i>
              <span className="nav-text">Investment Statistics</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
