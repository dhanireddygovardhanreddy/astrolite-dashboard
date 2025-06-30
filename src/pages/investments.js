import React, { useState } from "react";
import {
  Typography, Box, TextField, Button, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Chip from '@mui/material/Chip';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Example asset classes and statuses
const assetClasses = ["Equity", "Debt", "Real Estate", "Commodity", "Cash"];
const statusOptions = ["Active", "Exited"];

// Light color palette for charts
const lightColors = [
  "#A7F3D0", // light green
  "#BFDBFE", // light blue
  "#FDE68A", // light yellow
  "#FBCFE8", // light pink
  "#FECACA", // light red
  "#DDD6FE", // light purple
  "#F9FAFB"  // very light gray
];

const initialInvestments = [
  { id: "INV001", name: "ABC Corp", assetClass: "Equity", amount: 50000, currentValue: 68000, roi: 36, status: "Active", region: "India", date: "2023-01-12" },
  { id: "INV002", name: "XYZ Realty", assetClass: "Real Estate", amount: 100000, currentValue: 112000, roi: 12, status: "Active", region: "USA", date: "2022-06-30" },
  { id: "INV003", name: "Govt Bonds", assetClass: "Debt", amount: 40000, currentValue: 42500, roi: 6.25, status: "Active", region: "India", date: "2024-01-01" },
  { id: "INV004", name: "Gold ETF", assetClass: "Commodity", amount: 20000, currentValue: 22000, roi: 10, status: "Exited", region: "Global", date: "2021-03-15" },
];

export default function InvestmentsDashboard() {
  const [investments, setInvestments] = useState(initialInvestments);
  const [form, setForm] = useState({
    id: "",
    name: "",
    assetClass: assetClasses[0],
    amount: "",
    currentValue: "",
    roi: "",
    status: statusOptions[0],
    region: "",
    date: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // --- KPIs ---
  const totalInvested = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalCurrent = investments.reduce((acc, inv) => acc + Number(inv.currentValue), 0);
  const totalProfit = totalCurrent - totalInvested;
  const avgROI = investments.length ? (investments.reduce((acc, inv) => acc + Number(inv.roi), 0) / investments.length).toFixed(2) : 0;
  const activeCount = investments.filter(inv => inv.status === "Active").length;
  const exitedCount = investments.filter(inv => inv.status === "Exited").length;

  const kpis = [
    { label: "Total Invested", value: `₹${totalInvested.toLocaleString()}` },
    { label: "Current Value", value: `₹${totalCurrent.toLocaleString()}` },
    { label: "Profit/Loss", value: `₹${totalProfit.toLocaleString()}` },
    { label: "Avg. ROI (%)", value: avgROI },
    { label: "Active Investments", value: activeCount },
    { label: "Exited Investments", value: exitedCount },
  ];

  // --- Charts ---
  const assetClassData = {
    labels: assetClasses,
    datasets: [{
      label: "Total Invested",
      data: assetClasses.map(cls =>
        investments.filter(inv => inv.assetClass === cls).reduce((sum, inv) => sum + Number(inv.amount), 0)
      ),
      backgroundColor: lightColors,
      borderColor: "#38bdf8",
      borderWidth: 2,
    }]
  };

  const regionLabels = [...new Set(investments.map(inv => inv.region))];
  const regionData = {
    labels: regionLabels,
    datasets: [{
      label: "Investment by Region",
      data: regionLabels.map(region =>
        investments.filter(inv => inv.region === region).reduce((sum, inv) => sum + Number(inv.amount), 0)
      ),
      backgroundColor: "#BFDBFE", // light blue
      borderColor: "#60A5FA",     // pastel blue
      borderWidth: 2,
    }]
  };

  const valueTrendLabels = investments.map(inv => inv.date);
  const valueTrendData = {
    labels: valueTrendLabels,
    datasets: [{
      label: "Current Value",
      data: investments.map(inv => inv.currentValue),
      borderColor: "#A7F3D0", // pastel green
      backgroundColor: "rgba(167,243,208,0.3)", // semi-transparent light green
      fill: true,
      tension: 0.4
    }]
  };

  const allocationPie = {
    labels: assetClasses,
    datasets: [{
      data: assetClasses.map(cls =>
        investments.filter(inv => inv.assetClass === cls).reduce((sum, inv) => sum + Number(inv.currentValue), 0)
      ),
      backgroundColor: lightColors,
      borderColor: "#fff",
      borderWidth: 2,
    }]
  };

  // --- Form Handlers ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddInvestment = (e) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.assetClass || !form.amount || !form.currentValue || !form.roi || !form.status || !form.region || !form.date) {
      alert("Please fill in all fields.");
      return;
    }
    setInvestments((prev) => [...prev, { ...form, amount: Number(form.amount), currentValue: Number(form.currentValue), roi: Number(form.roi) }]);
    setForm({ id: "", name: "", assetClass: assetClasses[0], amount: "", currentValue: "", roi: "", status: statusOptions[0], region: "", date: "" });
  };

  // --- Edit Investment ---
  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...investments[idx] });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    setInvestments((prev) =>
      prev.map((inv, idx) =>
        idx === editIdx ? { ...editForm, amount: Number(editForm.amount), currentValue: Number(editForm.currentValue), roi: Number(editForm.roi) } : inv
      )
    );
    setEditIdx(null);
    setEditForm({});
  };

  // --- Delete Investment ---
  const handleDeleteClick = (idx) => setDeleteIdx(idx);
  const handleDeleteConfirm = () => {
    setInvestments((prev) => prev.filter((_, idx) => idx !== deleteIdx));
    setDeleteIdx(null);
  };

  // --- View Investment ---
  const handleViewClick = (inv) => setViewItem(inv);

  function Field({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontWeight: 600,
          minWidth: 140,        // Ensures all labels are the same width
          textAlign: "left",
          display: "inline-block",
        }}
      >
        {label}:
      </span>
      <span
        style={{
          color: "#1e293b",
          fontWeight: 500,
          textAlign: "left",
          marginLeft: 8,        // Small gap between label and value
        }}
      >
        {value}
      </span>
    </Box>
  );
}


  return (
    <Box className="dashboard-container" sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
      <Typography className="dashboard-header" variant="h4" fontWeight="bold" mb={3}>
        Investment Statistics Dashboard
      </Typography>

      {/* --- KPI Cards --- */}
      <div className="summary-cards">
        {kpis.map((item) => (
          <div className="summary-card" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>

      {/* --- Add Investment Form --- */}
      <div className="add-vehicle-form">
        <h3 style={{ marginBottom: 16, color: "#222", fontWeight: 600 }}>Add Investment</h3>
        <form className="logistics-form" onSubmit={handleAddInvestment}>
          <input
            type="text"
            name="id"
            placeholder="Investment ID *"
            value={form.id}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Investment Name *"
            value={form.name}
            onChange={handleFormChange}
            required
          />
          <select
            name="assetClass"
            value={form.assetClass}
            onChange={handleFormChange}
            required
          >
            {assetClasses.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Invested Amount *"
            value={form.amount}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="currentValue"
            placeholder="Current Value *"
            value={form.currentValue}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="roi"
            placeholder="ROI (%) *"
            value={form.roi}
            onChange={handleFormChange}
            required
            min={-100}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleFormChange}
            required
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="text"
            name="region"
            placeholder="Region *"
            value={form.region}
            onChange={handleFormChange}
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Investment Date *"
            value={form.date}
            onChange={handleFormChange}
            required
          />
          <button type="submit">
            ADD INVESTMENT
          </button>
        </form>
      </div>

      {/* --- Investment Charts --- */}
      <div className="quality-charts-grid">
        <div className="quality-chart-container">
          <Bar data={assetClassData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Investments by Asset Class" },
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="quality-chart-container">
          <Pie data={allocationPie} options={{
            plugins: {
              title: { display: true, text: "Portfolio Allocation by Asset Class" }
            }
          }} />
        </div>
        <div className="quality-chart-container">
          <Bar data={regionData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Investments by Region" },
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="quality-chart-container">
          <Line data={valueTrendData} options={{
            plugins: {
              title: { display: true, text: "Current Value Trend" }
            }
          }} />
        </div>
      </div>

      {/* --- Investment Table --- */}
      <div className="vehicle-table-container">
        <Typography variant="h6" mb={2}>
          Investment Portfolio
        </Typography>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Asset Class</th>
              <th>Invested</th>
              <th>Current Value</th>
              <th>ROI (%)</th>
              <th>Status</th>
              <th>Region</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv, idx) => (
              <tr key={inv.id + idx}>
                <td>{inv.id}</td>
                <td>{inv.name}</td>
                <td>{inv.assetClass}</td>
                <td>₹{inv.amount.toLocaleString()}</td>
                <td>₹{inv.currentValue.toLocaleString()}</td>
                <td>{inv.roi}</td>
                <td>{inv.status}</td>
                <td>{inv.region}</td>
                <td>{inv.date}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleViewClick(inv)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="info" onClick={() => handleEditClick(idx)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(idx)}>
                    <Delete />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Edit Dialog --- */}
      <Dialog open={editIdx !== null} onClose={() => setEditIdx(null)}>
        <DialogTitle>Edit Investment</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Investment ID"
            name="id"
            value={editForm.id || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Name"
            name="name"
            value={editForm.name || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            select
            label="Asset Class"
            name="assetClass"
            value={editForm.assetClass || assetClasses[0]}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          >
            {assetClasses.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Invested Amount"
            name="amount"
            type="number"
            value={editForm.amount || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Current Value"
            name="currentValue"
            type="number"
            value={editForm.currentValue || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="ROI (%)"
            name="roi"
            type="number"
            value={editForm.roi || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            select
            label="Status"
            name="status"
            value={editForm.status || statusOptions[0]}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Region"
            name="region"
            value={editForm.region || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Investment Date"
            name="date"
            type="date"
            value={editForm.date || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIdx(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog open={deleteIdx !== null} onClose={() => setDeleteIdx(null)}>
        <DialogTitle>Delete Investment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this investment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIdx(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* --- View Dialog --- */}
      <Dialog
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(37,99,235,0.16)",
            border: "1.5px solid #c7d2fe",
            overflow: "visible"
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: '2rem',
            pb: 0,
            color: "#0ea5e9",
            letterSpacing: 1,
            textAlign: "center",
            textShadow: "0 2px 16px #38bdf8",
            mb: 2,
          }}
        >
          Investment Details
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
          {/* Category Card: Investment Info */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(14,165,233,0.13)",
              p: 2,
              mb: 2,
              border: "1px solid #bae6fd",
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Box sx={{ fontWeight: 700, color: "#2563eb", fontSize: "1.08rem", mb: 1 }}>
              Investment Information
            </Box>
            <Box>
              <Field label="Investment ID" value={viewItem?.id} />
              <Field label="Name" value={viewItem?.name} />
              <Field label="Asset Class" value={viewItem?.assetClass} />
              <Field label="Region" value={viewItem?.region} />
              <Field label="Date" value={viewItem?.date} />
            </Box>
          </Box>
          {/* Category Card: Financial Info */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(236,72,153,0.10)",
              p: 2,
              mb: 1,
              border: "1px solid #fbcfe8",
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Box sx={{ fontWeight: 700, color: "#d946ef", fontSize: "1.08rem", mb: 1, textAlign:"left" }}>
              Financial Information
            </Box>
            <Box>
              <Field label="Invested Amount" value={`₹${viewItem?.amount?.toLocaleString()}`} />
              <Field label="Current Value" value={`₹${viewItem?.currentValue?.toLocaleString()}`} />
              <Field label="ROI (%)" value={viewItem?.roi} />
              <Field
                label="Status"
                value={
                  <Chip
                    label={viewItem?.status}
                    color={viewItem?.status === "Active" ? "success" : "default"}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      px: 1.5,
                      background: viewItem?.status === "Active"
                        ? "linear-gradient(90deg,#bbf7d0,#4ade80)"
                        : "#d1d5db",
                      color: viewItem?.status === "Active" ? "#065f46" : "#374151"
                    }}
                  />
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setViewItem(null)}
            variant="contained"
            sx={{
              px: 4,
              fontWeight: 700,
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              boxShadow: "0 2px 8px rgba(124,58,237,0.10)",
              borderRadius: 3,
              letterSpacing: 1.2
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
