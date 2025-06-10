import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import MonthlyChart from "./charts/MonthlyChart";
import DailyChart from "./charts/DailyChart";
import SalesChart from "./charts/SalesChart";
import FarmersPage from "./pages/FarmersPage"; 
import "./styles.css";

// Example stat card data
const statCards1 = [
  { icon: "fa-wine-bottle", title: "TOTAL MILK", value: "45,200 L", change: "12.5%", changeType: "positive" },
  { icon: "fa-rupee-sign", title: "TOTAL SALES", value: "₹2,500,000", change: "18.2%", changeType: "positive" },
  { icon: "fa-users", title: "NUMBER OF FARMERS", value: "9,000+", change: "5.7%", changeType: "positive" },
  { icon: "fa-truck", title: "DISTRIBUTORS", value: "1,800", change: "8.3%", changeType: "positive" }
];

const statCards2 = [
  { icon: "fa-chart-line", title: "GROWTH RATE", value: "18.0%" },
  { icon: "fa-user-tie", title: "EMPLOYEE MANAGEMENT", value: "79%", change: "2.1%", changeType: "positive" },
  { icon: "fa-bullseye", title: "TARGET ACHIEVEMENT", value: "92%", subtext: "5% above target" },
  { icon: "fa-exclamation-triangle", title: "QUALITY ALERTS", value: "12" }
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Responsive sidebar: open on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar toggle for both desktop and mobile
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  // Handle navigation from sidebar
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (window.innerWidth <= 1024) setSidebarOpen(false);
  };

  return (
    <div className="app-container" style={{ display: "flex", width: "100%" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <div style={{ flex: 1, width: "100%" }}>
        <Header
          theme={theme}
          setTheme={setTheme}
          onSidebarToggle={handleSidebarToggle}
        />
        <main
          className="main-content"
          style={{
            marginLeft: sidebarOpen && window.innerWidth > 1024 ? 280 : 0,
            transition: "margin-left 0.3s",
            paddingTop: 80
          }}
        >
          {currentPage === "dashboard" && (
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
          )}
          {currentPage === "farmers" && <FarmersPage />}
          {/* Add more pages as needed */}
        </main>
      </div>
    </div>
  );
}

export default App;
