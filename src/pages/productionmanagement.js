import React, { useState } from "react";
import {
  Typography, Box, Chip, TextField, Button, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Edit, Delete, Visibility } from "@mui/icons-material";



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Example statuses for production batches
const statusOptions = ["Completed", "In Progress", "Halted"];

const initialBatches = [
  { id: "BATCH001", product: "Milk 1L", planned: 1000, actual: 950, defects: 10, oee: 92, status: "Completed", start: "2025-06-01", end: "2025-06-01" },
  { id: "BATCH002", product: "Cheese 500g", planned: 800, actual: 780, defects: 5, oee: 88, status: "Completed", start: "2025-06-02", end: "2025-06-02" },
  { id: "BATCH003", product: "Butter 200g", planned: 600, actual: 580, defects: 15, oee: 85, status: "In Progress", start: "2025-06-03", end: "" },
  { id: "BATCH004", product: "Yogurt 150g", planned: 700, actual: 700, defects: 2, oee: 97, status: "Completed", start: "2025-06-04", end: "2025-06-04" },
];

const statusColor = {
  "Completed": "success",
  "In Progress": "info",
  "Halted": "error",
};

export default function ProductionDashboard() {
  const [batches, setBatches] = useState(initialBatches);
  const [form, setForm] = useState({
    id: "",
    product: "",
    planned: "",
    actual: "",
    defects: "",
    oee: "",
    status: "Completed",
    start: "",
    end: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [viewBatch, setViewBatch] = useState(null);

  // --- KPI Calculations ---
  const totalBatches = batches.length;
  const totalOutput = batches.reduce((acc, b) => acc + Number(b.actual), 0);
  const totalPlanned = batches.reduce((acc, b) => acc + Number(b.planned), 0);
  const totalDefects = batches.reduce((acc, b) => acc + Number(b.defects), 0);
  const avgOEE = batches.length ? (batches.reduce((acc, b) => acc + Number(b.oee), 0) / batches.length).toFixed(1) : 0;
  const defectRate = totalOutput ? ((totalDefects / totalOutput) * 100).toFixed(2) : 0;
  const throughput = batches.length ? (totalOutput / batches.length).toFixed(1) : 0;
  const capacityUtilization = totalPlanned ? ((totalOutput / totalPlanned) * 100).toFixed(1) : 0;

  const productionSummary = [
    { label: "Total Output", value: totalOutput, color: "primary" },
    { label: "Planned Output", value: totalPlanned, color: "info" },
    { label: "Defect Rate (%)", value: defectRate, color: "error" },
    { label: "Avg. OEE (%)", value: avgOEE, color: "success" },
    { label: "Throughput", value: throughput, color: "secondary" },
    { label: "Capacity Utilization (%)", value: capacityUtilization, color: "info" },
  ];

  // Chart data for production output over time
  const outputData = {
    labels: batches.map(b => b.start),
    datasets: [
      {
        label: "Actual Output",
        data: batches.map(b => b.actual),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Planned Output",
        data: batches.map(b => b.planned),
        backgroundColor: "#a5b4fc",
      },
    ],
  };

  const outputOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Production Output Over Time" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // --- Add Batch ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddBatch = (e) => {
    e.preventDefault();
    if (!form.id || !form.product || !form.planned || !form.actual || !form.defects || !form.oee || !form.status || !form.start) {
      alert("Please fill in all required fields.");
      return;
    }
    setBatches((prev) => [...prev, { ...form, planned: Number(form.planned), actual: Number(form.actual), defects: Number(form.defects), oee: Number(form.oee) }]);
    setForm({ id: "", product: "", planned: "", actual: "", defects: "", oee: "", status: "Completed", start: "", end: "" });
  };

  // --- Edit Batch ---
  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...batches[idx] });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    setBatches((prev) =>
      prev.map((b, idx) =>
        idx === editIdx ? { ...editForm, planned: Number(editForm.planned), actual: Number(editForm.actual), defects: Number(editForm.defects), oee: Number(editForm.oee) } : b
      )
    );
    setEditIdx(null);
    setEditForm({});
  };

  // --- Delete Batch ---
  const handleDeleteClick = (idx) => setDeleteIdx(idx);
  const handleDeleteConfirm = () => {
    setBatches((prev) => prev.filter((_, idx) => idx !== deleteIdx));
    setDeleteIdx(null);
  };

  // --- View Batch ---
  const handleViewClick = (batch) => setViewBatch(batch);

  return (
    <Box className="dashboard-container" sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
      <Typography className="dashboard-header" variant="h4" fontWeight="bold" mb={3}>
        Production Management Dashboard
      </Typography>

      {/* --- Summary Cards --- */}
      <div className="summary-cards">
        {productionSummary.map((item) => (
          <div className="summary-card" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>

      {/* --- Add Production Batch Form --- */}
      <div className="add-vehicle-form">
        <h3 style={{ marginBottom: 16, color: "#222", fontWeight: 600 }}>Add Production Batch</h3>
        <form className="logistics-form" onSubmit={handleAddBatch}>
          <input
            type="text"
            name="id"
            placeholder="Batch ID *"
            value={form.id}
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
          <input
            type="number"
            name="planned"
            placeholder="Planned Output *"
            value={form.planned}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="actual"
            placeholder="Actual Output *"
            value={form.actual}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="defects"
            placeholder="Defects *"
            value={form.defects}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="oee"
            placeholder="OEE (%) *"
            value={form.oee}
            onChange={handleFormChange}
            required
            min={0}
            max={100}
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
            type="date"
            name="start"
            placeholder="Start Date *"
            value={form.start}
            onChange={handleFormChange}
            required
          />
          <input
            type="date"
            name="end"
            placeholder="End Date"
            value={form.end}
            onChange={handleFormChange}
          />
          <button type="submit">
            ADD BATCH
          </button>
        </form>
      </div>

      {/* --- Production Output Chart --- */}
      <div className="chart-container">
        <Bar data={outputData} options={outputOptions} />
      </div>

      {/* --- Production Table --- */}
      <div className="vehicle-table-container">
        <Typography variant="h6" mb={2}>
          Production Batches
        </Typography>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Product</th>
              <th>Planned Output</th>
              <th>Actual Output</th>
              <th>Defects</th>
              <th>OEE (%)</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b, idx) => (
              <tr key={b.id + idx}>
                <td>{b.id}</td>
                <td>{b.product}</td>
                <td>{b.planned}</td>
                <td>{b.actual}</td>
                <td>{b.defects}</td>
                <td>{b.oee}</td>
                <td>
                  <Chip label={b.status} color={statusColor[b.status]} size="small" />
                </td>
                <td>{b.start}</td>
                <td>{b.end}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleViewClick(b)}>
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
        <DialogTitle>Edit Production Batch</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Batch ID"
            name="id"
            value={editForm.id || ""}
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
            label="Planned Output"
            name="planned"
            type="number"
            value={editForm.planned || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Actual Output"
            name="actual"
            type="number"
            value={editForm.actual || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Defects"
            name="defects"
            type="number"
            value={editForm.defects || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="OEE (%)"
            name="oee"
            type="number"
            value={editForm.oee || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            select
            label="Status"
            name="status"
            value={editForm.status || "Completed"}
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
            label="Start Date"
            name="start"
            type="date"
            value={editForm.start || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ my: 1 }}
          />
          <TextField
            label="End Date"
            name="end"
            type="date"
            value={editForm.end || ""}
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
        <DialogTitle>Delete Production Batch</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this batch?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIdx(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* --- View Dialog --- */}
      <Dialog open={!!viewBatch} onClose={() => setViewBatch(null)}
       fullWidth 
       maxWidth={false}
        PaperProps={{
    sx: {
      maxWidth: "600px",
      width: "100%",
    },
  }}
       >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', pb: 0 }}>
  Production Batch Details
</DialogTitle>
<DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
  {/* Batch Info Section */}
  <Typography sx={{
    fontWeight: 600,
    color: "#2563eb",
    mt: 1,
    mb: 1,
    fontSize: "1.08rem",
    borderBottom: "1.5px solid #e0e7ef",
    pb: 0.5,
    letterSpacing: 0.2,
  }}>
    Batch Information
  </Typography>
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      rowGap: 1,
      columnGap: 2,
      mb: 2,
      fontSize: "1rem"
    }}
  >
    <Box sx={{ color: "#666" }}>Batch ID:</Box>
    <Box>{viewBatch?.id}</Box>
    <Box sx={{ color: "#666" }}>Product:</Box>
    <Box>{viewBatch?.product}</Box>
    <Box sx={{ color: "#666" }}>Start Date:</Box>
    <Box>{viewBatch?.start}</Box>
    <Box sx={{ color: "#666" }}>End Date:</Box>
    <Box>{viewBatch?.end || "-"}</Box>
    <Box sx={{ color: "#666" }}>Status:</Box>
    <Box>
      <Chip
        label={viewBatch?.status}
        color={
          viewBatch?.status === "Completed"
            ? "success"
            : viewBatch?.status === "In Progress"
            ? "info"
            : "error"
        }
        size="small"
        sx={{ fontWeight: 600, fontSize: "0.95rem" }}
      />
    </Box>
  </Box>

  {/* Production Metrics Section */}
  <Typography sx={{
    fontWeight: 600,
    color: "#2563eb",
    mt: 2,
    mb: 1,
    fontSize: "1.08rem",
    borderBottom: "1.5px solid #e0e7ef",
    pb: 0.5,
    letterSpacing: 0.2,
  }}>
    Production Metrics
  </Typography>
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      rowGap: 1,
      columnGap: 2,
      mb: 2,
      fontSize: "1rem"
    }}
  >
    <Box sx={{ color: "#666" }}>Planned Output:</Box>
    <Box>{viewBatch?.planned}</Box>
    <Box sx={{ color: "#666" }}>Actual Output:</Box>
    <Box>{viewBatch?.actual}</Box>
    <Box sx={{ color: "#666" }}>Defects:</Box>
    <Box>{viewBatch?.defects}</Box>
    <Box sx={{ color: "#666" }}>OEE (%):</Box>
    <Box>{viewBatch?.oee}</Box>
  </Box>
</DialogContent>
<DialogActions>
  <Button onClick={() => setViewBatch(null)} variant="contained">
    Close
  </Button>
</DialogActions>

      </Dialog>
    </Box>
  );
}
