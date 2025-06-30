import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import MonthlyChart from "./charts/MonthlyChart";
import DailyChart from "./charts/DailyChart";
import SalesChart from "./charts/SalesChart";
import FarmersPage from "./pages/FarmersPage";
import MilkTrackingPage from "./pages/MilkTrackingPage";
import PaymentsDashboard from "./pages/PaymentsDashboard";
import Login from "./components/Login";
import { UserProvider,useUser } from "./components/UserContext";
import RecentTable from "./components/RecentTable";
import "./styles.css";
import 'leaflet/dist/leaflet.css';
import LogisticsDashboard from "./pages/logistics"; 
import QualityDashboard from './pages/QualityDashboard';
import InventoryDashboard from "./pages/inventory";
import InvestmentsDashboard from "./pages/investments"
import ProductionDashboard from "./pages/productionmanagement"
import SalesDashboard from "./pages/sales";
import DailySalesChart from "./charts/Dailysales";


// Example stat card data
const statCards1 = [
  { icon: "fa-wine-bottle", title: "TOTAL MILK", value: "45,200 L", change: "12.5%", changeType: "positive" },
  { icon: "fa-rupee-sign", title: "TOTAL SALES", value: "₹2,500,000", change: "18.2%", changeType: "positive" },
  { icon: "fa-users", title: "NUMBER OF FARMERS", value: "9,000+", change: "5.7%", changeType: "positive" },
  { icon: "fa-truck", title: "DISTRIBUTORS", value: "1,800", change: "8.3%", changeType: "positive" }
];

// const statCards2 = [
//   { icon: "fa-chart-line", title: "GROWTH RATE", value: "18.0%" },
//   { icon: "fa-user-tie", title: "EMPLOYEE MANAGEMENT", value: "79%", change: "2.1%", changeType: "positive" },
//   { icon: "fa-bullseye", title: "TARGET ACHIEVEMENT", value: "92%", subtext: "5% above target" },
//   { icon: "fa-exclamation-triangle", title: "QUALITY ALERTS", value: "12" }
// ];




// Dashboard page as a component
function Dashboard({ farmers, records, payments }) {

  const [productionType, setProductionType] = useState("monthly");
  const [selectedTable, setSelectedTable] = useState("farmers");
  const [productionsType, setProductionsType] = useState("monthly");
  // Get recent 5 entries for each
  const recentFarmers = [...farmers].slice(-5).reverse();
  const recentMilk = [...records].slice(-5).reverse();
  const recentPayments = [...payments].slice(-5).reverse();

  let columns, data;
  if (selectedTable === "farmers") {
    columns = farmerColumns;
    data = recentFarmers;
  } else if (selectedTable === "milk") {
    columns = milkColumns;
    data = recentMilk;
  } else {
    columns = paymentColumns;
    data = recentPayments;
  }

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        {statCards1.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>
      {/* <div className="stats-grid">
        {statCards2.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div> */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-indicator"></div>
            <h3>Milk Production (L)</h3>
             <select
                 className="custom-select"
                 value={productionType}
                 onChange={(e) => setProductionType(e.target.value)}
              >
                 <option value="monthly">Monthly</option>
                 <option value="daily">Daily</option>
             </select> 
          </div>
          <div className="chart-container">
            {productionType === "monthly" ? <MonthlyChart /> : <DailyChart />}
          </div>
        </div>
        {/* <div className="chart-card">
          <div className="chart-header">
            <div className="chart-indicator"></div>
            <h3>Daily Milk Production (L)</h3>
          </div>
          <div className="chart-container">
            <DailyChart />
          </div>
        </div> */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-indicator"></div>
            <h3>Sales Breakdown</h3>
            <select
                 className="custom-select"
                 value={productionsType}
                 onChange={(e) => setProductionsType(e.target.value)}
              >
                 <option value="monthly">Monthly</option>
                 <option value="daily">Daily</option>
             </select>
          </div>
          <div className="chart-container">
            {productionsType === "monthly" ? <SalesChart /> : <DailySalesChart />}
          </div>
        </div>
      </div>

       {/* Recent Data Table Card */}
      <div className="recent-table-card" style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <select
            className="custom-select"
            value={selectedTable}
            onChange={e => setSelectedTable(e.target.value)}
            style={{ fontWeight: "bold", fontSize: 16 }}
          >
            <option value="farmers">Recent Farmers</option>
            <option value="milk">Recent Milk Records</option>
            <option value="payments">Recent Payments</option>
          </select>
        </div>
        <RecentTable columns={columns} data={data} />
      </div>
    </div>
  );
}

// Initial state for the farmers form
const initialForm = {
  ID:"",
  name: "",
  phone: "",
  village: "",
  date: "",
  landSize: "",
  // crops: ""
};
const initialMilkForm = {
  recordid: "",
  date: "",
  farmerName: "",
  quantity: "",
  fatContent: "",
  snf: "",
  // remarks: "",
};
const initialPaymentForm = {
  paymentId: "",
  date: "",
  payerName: "",
  amount: "",
  method: "",
  status: "",
};

const farmerColumns = [
  { header: "ID", accessor: "farmerid" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone" },
  { header: "Village", accessor: "village" },
  { header: "Date", accessor: "date" },
];

const milkColumns = [
  { header: "Record ID", accessor: "recordid" },
  { header: "Date", accessor: "date" },
  { header: "Farmer Name", accessor: "farmerName" },
  { header: "Quantity", accessor: "quantity" },
];

const paymentColumns = [
  { header: "Payment ID", accessor: "paymentId" },
  { header: "Date", accessor: "date" },
  { header: "Payer Name", accessor: "payerName" },
  { header: "Amount", accessor: "amount" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Persisted farmers and form state
  const [farmers, setFarmers] = useState([]);
  const [form, setForm] = useState(initialForm);

  // State for milk tracking
  const [milkForm, setMilkForm] = useState(initialMilkForm);
  const [records, setRecords] = useState([]);

  // payments Dashboard
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [payments, setPayments] = useState([]);
  
  const { user } = useUser();

  React.useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Responsive sidebar: open on desktop, closed on mobile
  React.useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar toggle for both desktop and mobile
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);


  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container" style={{ display: "flex", width: "100%" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route
              path="/farmers"
              element={
                <FarmersPage
                  farmers={farmers}
                  setFarmers={setFarmers}
                  form={form}
                  setForm={setForm}
                />
              }
            />
             <Route
               path="/milk"
               element={
                 <MilkTrackingPage
                   form={milkForm}
                   setForm={setMilkForm}
                   records={records}
                   setRecords={setRecords}
                 />
               }
             />
              <Route
                  path="/payments"
                  element={
                 <PaymentsDashboard
                 form={paymentForm}
                 setForm={setPaymentForm}
                 payments={payments}
                 setPayments={setPayments}
                  />
                }
              />
              <Route
                  path="/"
                  element={
                 <Dashboard
                 farmers={farmers}
                 records={records}
                 payments={payments}
                  />
                 }
                />
                <Route 
                path="/logistics" 
                element={<LogisticsDashboard />} />
                <Route 
                path="/quality" 
                element={<QualityDashboard />} />
                <Route
                path="/inventory"
                element={<InventoryDashboard/>} />
                <Route
                path="/investment"
                element={<InvestmentsDashboard/>}
                />
                <Route
                path="/production"
                element={<ProductionDashboard/>}
                />
                <Route
                path="/sales"
                element={<SalesDashboard/>}
                />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function Apps() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
