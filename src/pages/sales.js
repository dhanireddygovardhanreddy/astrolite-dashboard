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

// Example product categories and statuses
const productCategories = ["Electronics", "Clothing", "Groceries", "Books", "Furniture"];
const statusOptions = ["Completed", "Pending", "Returned"];

// Light color palette for charts
const lightColors = [
  "#A7F3D0", "#BFDBFE", "#FDE68A", "#FBCFE8", "#FECACA", "#DDD6FE", "#F9FAFB"
];

// Initial sales data
const initialSales = [
  { id: "S001", customer: "John Doe", product: "Laptop", category: "Electronics", amount: 65000, status: "Completed", region: "North", date: "2023-01-12" },
  { id: "S002", customer: "Jane Smith", product: "Jeans", category: "Clothing", amount: 2000, status: "Completed", region: "West", date: "2023-01-15" },
  { id: "S003", customer: "Amit Kumar", product: "Rice", category: "Groceries", amount: 1200, status: "Pending", region: "East", date: "2023-01-18" },
  { id: "S004", customer: "Priya Singh", product: "Bookshelf", category: "Furniture", amount: 8000, status: "Returned", region: "South", date: "2023-01-20" },
];

export default function SalesDashboard() {
  const [sales, setSales] = useState(initialSales);
  const [form, setForm] = useState({
    id: "",
    customer: "",
    product: "",
    category: productCategories[0],
    amount: "",
    status: statusOptions[0],
    region: "",
    date: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // --- KPIs ---
  const totalSales = sales.reduce((acc, s) => acc + Number(s.amount), 0);
  const completedSales = sales.filter(s => s.status === "Completed").length;
  const pendingSales = sales.filter(s => s.status === "Pending").length;
  const returnedSales = sales.filter(s => s.status === "Returned").length;
  const avgSale = sales.length ? (totalSales / sales.length).toFixed(2) : 0;

  const kpis = [
    { label: "Total Sales", value: `₹${totalSales.toLocaleString()}` },
    { label: "Completed", value: completedSales },
    { label: "Pending", value: pendingSales },
    { label: "Returned", value: returnedSales },
    { label: "Avg. Sale Value", value: `₹${avgSale}` },
    { label: "Total Orders", value: sales.length },
  ];

  // --- Charts ---
  const categoryData = {
    labels: productCategories,
    datasets: [{
      label: "Sales Amount",
      data: productCategories.map(cat =>
        sales.filter(s => s.category === cat).reduce((sum, s) => sum + Number(s.amount), 0)
      ),
      backgroundColor: lightColors,
      borderColor: "#38bdf8",
      borderWidth: 2,
    }]
  };

  const regionLabels = [...new Set(sales.map(s => s.region))];
  const regionData = {
    labels: regionLabels,
    datasets: [{
      label: "Sales by Region",
      data: regionLabels.map(region =>
        sales.filter(s => s.region === region).reduce((sum, s) => sum + Number(s.amount), 0)
      ),
      backgroundColor: "#BFDBFE",
      borderColor: "#60A5FA",
      borderWidth: 2,
    }]
  };

  const salesTrendLabels = sales.map(s => s.date);
  const salesTrendData = {
    labels: salesTrendLabels,
    datasets: [{
      label: "Sale Amount",
      data: sales.map(s => s.amount),
      borderColor: "#A7F3D0",
      backgroundColor: "rgba(167,243,208,0.3)",
      fill: true,
      tension: 0.4
    }]
  };

  const allocationPie = {
    labels: productCategories,
    datasets: [{
      data: productCategories.map(cat =>
        sales.filter(s => s.category === cat).reduce((sum, s) => sum + Number(s.amount), 0)
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
  const handleAddSale = (e) => {
    e.preventDefault();
    if (!form.id || !form.customer || !form.product || !form.category || !form.amount || !form.status || !form.region || !form.date) {
      alert("Please fill in all fields.");
      return;
    }
    setSales((prev) => [...prev, { ...form, amount: Number(form.amount) }]);
    setForm({ id: "", customer: "", product: "", category: productCategories[0], amount: "", status: statusOptions[0], region: "", date: "" });
  };

  // --- Edit Sale ---
  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...sales[idx] });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    setSales((prev) =>
      prev.map((s, idx) =>
        idx === editIdx ? { ...editForm, amount: Number(editForm.amount) } : s
      )
    );
    setEditIdx(null);
    setEditForm({});
  };

  // --- Delete Sale ---
  const handleDeleteClick = (idx) => setDeleteIdx(idx);
  const handleDeleteConfirm = () => {
    setSales((prev) => prev.filter((_, idx) => idx !== deleteIdx));
    setDeleteIdx(null);
  };

  // --- View Sale ---
  const handleViewClick = (s) => setViewItem(s);

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
            minWidth: 140,
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
            marginLeft: 8,
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
        Sales Dashboard
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

      {/* --- Add Sale Form --- */}
      <div className="add-vehicle-form">
        <h3 style={{ marginBottom: 16, color: "#222", fontWeight: 600 }}>Add Sale</h3>
        <form className="logistics-form" onSubmit={handleAddSale}>
          <input
            type="text"
            name="id"
            placeholder="Sale ID *"
            value={form.id}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="customer"
            placeholder="Customer Name *"
            value={form.customer}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="product"
            placeholder="Product Name *"
            value={form.product}
            onChange={handleFormChange}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleFormChange}
            required
          >
            {productCategories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Sale Amount *"
            value={form.amount}
            onChange={handleFormChange}
            required
            min={0}
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
            placeholder="Sale Date *"
            value={form.date}
            onChange={handleFormChange}
            required
          />
          <button type="submit">
            ADD SALE
          </button>
        </form>
      </div>

      {/* --- Sales Charts --- */}
      <div className="quality-charts-grid">
        <div className="quality-chart-container">
          <Bar data={categoryData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Sales by Product Category" },
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="quality-chart-container">
          <Pie data={allocationPie} options={{
            plugins: {
              title: { display: true, text: "Sales Allocation by Category" }
            }
          }} />
        </div>
        <div className="quality-chart-container">
          <Bar data={regionData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Sales by Region" },
            },
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="quality-chart-container">
          <Line data={salesTrendData} options={{
            plugins: {
              title: { display: true, text: "Sales Trend" }
            }
          }} />
        </div>
      </div>

      {/* --- Sales Table --- */}
      <div className="vehicle-table-container">
        <Typography variant="h6" mb={2}>
          Sales Records
        </Typography>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Region</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, idx) => (
              <tr key={s.id + idx}>
                <td>{s.id}</td>
                <td>{s.customer}</td>
                <td>{s.product}</td>
                <td>{s.category}</td>
                <td>₹{s.amount.toLocaleString()}</td>
                <td>{s.status}</td>
                <td>{s.region}</td>
                <td>{s.date}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleViewClick(s)}>
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
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Sale ID"
            name="id"
            value={editForm.id || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Customer"
            name="customer"
            value={editForm.customer || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Product"
            name="product"
            value={editForm.product || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            select
            label="Category"
            name="category"
            value={editForm.category || productCategories[0]}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          >
            {productCategories.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={editForm.amount || ""}
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
            label="Sale Date"
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
        <DialogTitle>Delete Sale</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this sale?</Typography>
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
            fontSize: '1.4rem',
            pb: 0,
            color: "#0ea5e9",
            letterSpacing: 1,
            textAlign: "center",
            textShadow: "0 2px 16px #38bdf8",
            mb: 2
          }}
        >
          Sale Details
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
          {/* Card: Sale Information */}
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
              Sale Information
            </Box>
            <Box>
              <Field label="Sale ID" value={viewItem?.id} />
              <Field label="Customer" value={viewItem?.customer} />
              <Field label="Product" value={viewItem?.product} />
              <Field label="Category" value={viewItem?.category} />
              <Field label="Region" value={viewItem?.region} />
              <Field label="Date" value={viewItem?.date} />
            </Box>
          </Box>
          {/* Card: Financial Information */}
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
            <Box sx={{ fontWeight: 700, color: "#d946ef", fontSize: "1.08rem", mb: 1 }}>
              Financial Information
            </Box>
            <Box>
              <Field label="Amount" value={`₹${viewItem?.amount?.toLocaleString()}`} />
              <Field label="Status" value={
                <Chip
                  label={viewItem?.status}
                  color={
                    viewItem?.status === "Completed"
                      ? "success"
                      : viewItem?.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    px: 1.5,
                    background: viewItem?.status === "Completed"
                      ? "linear-gradient(90deg,#bbf7d0,#4ade80)"
                      : viewItem?.status === "Pending"
                      ? "linear-gradient(90deg,#fef9c3,#fde047)"
                      : "#fecaca",
                    color: viewItem?.status === "Completed"
                      ? "#065f46"
                      : viewItem?.status === "Pending"
                      ? "#92400e"
                      : "#991b1b"
                  }}
                />
              } />
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
