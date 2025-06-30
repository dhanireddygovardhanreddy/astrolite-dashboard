import React, { useState } from "react";
import {
  Typography, Box, Chip, TextField, Button, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Edit, Delete, Visibility } from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Inventory status options
const statusOptions = ["In Stock", "Low Stock", "Out of Stock"];

// Example initial inventory data
const initialInventory = [
  { id: "ITEM001", name: "Milk 1L", category: "Dairy", location: "Warehouse A", status: "In Stock", stock: 120, reorderLevel: 30, lastUpdated: "2025-06-01" },
  { id: "ITEM002", name: "Cheese 500g", category: "Dairy", location: "Warehouse B", status: "Low Stock", stock: 25, reorderLevel: 20, lastUpdated: "2025-06-02" },
  { id: "ITEM003", name: "Butter 200g", category: "Dairy", location: "Warehouse A", status: "Out of Stock", stock: 0, reorderLevel: 15, lastUpdated: "2025-06-03" },
  { id: "ITEM004", name: "Yogurt 150g", category: "Dairy", location: "Warehouse C", status: "In Stock", stock: 80, reorderLevel: 25, lastUpdated: "2025-06-04" },
];

const statusColor = {
  "In Stock": "success",
  "Low Stock": "warning",
  "Out of Stock": "error",
};

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState(initialInventory);
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    location: "",
    status: "In Stock",
    stock: "",
    reorderLevel: "",
    lastUpdated: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // --- Summary ---
  const totalItems = inventory.length;
  const totalStock = inventory.reduce((acc, item) => acc + Number(item.stock), 0);
  const lowStockItems = inventory.filter(item => item.status === "Low Stock").length;
  const outOfStockItems = inventory.filter(item => item.status === "Out of Stock").length;
  const inStockItems = inventory.filter(item => item.status === "In Stock").length;

  const inventorySummary = [
    { label: "Total Items", value: totalItems, color: "primary" },
    { label: "Total Stock", value: totalStock, color: "info" },
    { label: "In Stock", value: inStockItems, color: "success" },
    { label: "Low Stock", value: lowStockItems, color: "warning" },
    { label: "Out of Stock", value: outOfStockItems, color: "error" },
  ];

  // Chart data for stock levels by item
  const stockData = {
    labels: inventory.map(item => item.name),
    datasets: [
      {
        label: "Stock Level",
        data: inventory.map(item => item.stock),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const stockOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Stock Levels by Item" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // --- Add Item ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.category || !form.location || !form.status || !form.stock || !form.reorderLevel || !form.lastUpdated) {
      alert("Please fill in all fields.");
      return;
    }
    setInventory((prev) => [...prev, { ...form, stock: Number(form.stock), reorderLevel: Number(form.reorderLevel) }]);
    setForm({ id: "", name: "", category: "", location: "", status: "In Stock", stock: "", reorderLevel: "", lastUpdated: "" });
  };

  // --- Edit Item ---
  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...inventory[idx] });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    setInventory((prev) =>
      prev.map((item, idx) =>
        idx === editIdx ? { ...editForm, stock: Number(editForm.stock), reorderLevel: Number(editForm.reorderLevel) } : item
      )
    );
    setEditIdx(null);
    setEditForm({});
  };

  // --- Delete Item ---
  const handleDeleteClick = (idx) => setDeleteIdx(idx);
  const handleDeleteConfirm = () => {
    setInventory((prev) => prev.filter((_, idx) => idx !== deleteIdx));
    setDeleteIdx(null);
  };

  // --- View Item ---
  const handleViewClick = (item) => setViewItem(item);

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
        Inventory Management Dashboard
      </Typography>

      {/* --- Summary Cards --- */}
      <div className="summary-cards">
        {inventorySummary.map((item) => (
          <div className="summary-card" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>

      {/* --- Add Inventory Item Form --- */}
      <div className="add-vehicle-form">
        <h3 style={{ marginBottom: 16, color: "#222", fontWeight: 600 }}>Add Inventory Item</h3>
        <form className="logistics-form" onSubmit={handleAddItem}>
          <input
            type="text"
            name="id"
            placeholder="Item ID *"
            value={form.id}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Item Name *"
            value={form.name}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category *"
            value={form.category}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location *"
            value={form.location}
            onChange={handleFormChange}
            required
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
            type="number"
            name="stock"
            placeholder="Stock *"
            value={form.stock}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="reorderLevel"
            placeholder="Reorder Level *"
            value={form.reorderLevel}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="date"
            name="lastUpdated"
            placeholder="Last Updated *"
            value={form.lastUpdated}
            onChange={handleFormChange}
            required
          />
          <button type="submit">
            ADD ITEM
          </button>
        </form>
      </div>

      {/* --- Stock Chart --- */}
      <div className="chart-container">
        <Bar data={stockData} options={stockOptions} />
      </div>

      {/* --- Inventory Table --- */}
      <div className="vehicle-table-container">
        <Typography variant="h6" mb={2}>
          Inventory Summary
        </Typography>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Reorder Level</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => (
              <tr key={item.id + idx}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.location}</td>
                <td>
                  <Chip label={item.status} color={statusColor[item.status]} size="small" />
                </td>
                <td>{item.stock}</td>
                <td>{item.reorderLevel}</td>
                <td>{item.lastUpdated}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleViewClick(item)}>
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
        <DialogTitle>Edit Inventory Item</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Item ID"
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
            label="Category"
            name="category"
            value={editForm.category || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Location"
            name="location"
            value={editForm.location || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            select
            label="Status"
            name="status"
            value={editForm.status || "In Stock"}
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
            label="Stock"
            name="stock"
            type="number"
            value={editForm.stock || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Reorder Level"
            name="reorderLevel"
            type="number"
            value={editForm.reorderLevel || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Last Updated"
            name="lastUpdated"
            type="date"
            value={editForm.lastUpdated || ""}
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
        <DialogTitle>Delete Inventory Item</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
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
    Inventory Item Details
  </DialogTitle>
  <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
    {/* Card: Item Information */}
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
        Item Information
      </Box>
      <Box>
        <Field label="Item ID" value={viewItem?.id} />
        <Field label="Name" value={viewItem?.name} />
        <Field label="Category" value={viewItem?.category} />
        <Field label="Location" value={viewItem?.location} />
      </Box>
    </Box>
    {/* Card: Stock Information */}
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
        Stock Information
      </Box>
      <Box>
        <Field label="Stock" value={viewItem?.stock} />
        <Field label="Reorder Level" value={viewItem?.reorderLevel} />
        
        <Field label="Last Updated" value={viewItem?.lastUpdated} />
        <Field label="Status" value={
          <Chip
            label={viewItem?.status}
            color={
              viewItem?.status === "In Stock"
                ? "success"
                : viewItem?.status === "Low Stock"
                ? "warning"
                : "error"
            }
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              px: 1.5,
              background: viewItem?.status === "In Stock"
                ? "linear-gradient(90deg,#bbf7d0,#4ade80)"
                : viewItem?.status === "Low Stock"
                ? "linear-gradient(90deg,#fef9c3,#fde047)"
                : "#fecaca",
              color: viewItem?.status === "In Stock"
                ? "#065f46"
                : viewItem?.status === "Low Stock"
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
