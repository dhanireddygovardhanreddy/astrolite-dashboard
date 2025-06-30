import React, { useState } from "react";
import {
  Typography, Box, Chip, TextField, Button, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Edit, Delete, Visibility } from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const statusOptions = ["Active", "Maintenance", "Idle"];

const initialVehicles = [
  { id: "TRK001", registration: "KA01AB1234", type: "Truck", driver: "John Doe", status: "Active", lastService: "2025-05-15", fuel: 8.2, age: 22 },
  { id: "VAN002", registration: "KA02CD5678", type: "Van", driver: "Jane Smith", status: "Maintenance", lastService: "2025-05-10", fuel: 10.1, age: 24 },
  { id: "TRK003", registration: "KA03EF9012", type: "Truck", driver: "Mike Lee", status: "Idle", lastService: "2025-04-28", fuel: 7.8, age: 23 },
  { id: "VAN004", registration: "KA04GH3456", type: "Van", driver: "Sara Kim", status: "Active", lastService: "2025-05-12", fuel: 10.5, age: 25 },
];

const statusColor = {
  Active: "success",
  Maintenance: "warning",
  Idle: "default",
};

export default function LogisticsDashboard() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [form, setForm] = useState({
    id: "",
    registration: "",
    type: "",
    driver: "",
    status: "Active",
    lastService: "",
    fuel: "",
    age: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [viewVehicle, setViewVehicle] = useState(null);

  // --- Summary ---
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === "Active").length;
  const maintenanceVehicles = vehicles.filter(v => v.status === "Maintenance").length;
  const idleVehicles = vehicles.filter(v => v.status === "Idle").length;
  const avgAge = totalVehicles ? (vehicles.reduce((acc, v) => acc + Number(v.age), 0) / totalVehicles).toFixed(1) : 0;
  const avgFuel = totalVehicles ? (vehicles.reduce((acc, v) => acc + Number(v.fuel), 0) / totalVehicles).toFixed(1) : 0;
  const utilization = totalVehicles ? ((activeVehicles / totalVehicles) * 100).toFixed(0) : 0;

  // Chart data
  const utilizationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Utilization (%)",
        data: [70, 73, 75, 74, 76, utilization],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const utilizationOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Fleet Utilization Trend" },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  const vehicleSummary = [
    { label: "Total Vehicles", value: totalVehicles, color: "primary" },
    { label: "Active", value: activeVehicles, color: "success" },
    { label: "In Maintenance", value: maintenanceVehicles, color: "warning" },
    { label: "Idle", value: idleVehicles, color: "default" },
    { label: "Avg. Age (yrs)", value: avgAge, color: "info" },
    { label: "Fleet Utilization (%)", value: utilization, color: "secondary" },
    { label: "Avg. Fuel (km/l)", value: avgFuel, color: "info" },
  ];

  // --- Add Vehicle ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!form.id || !form.registration || !form.type || !form.driver || !form.status || !form.lastService || !form.fuel || !form.age) {
      alert("Please fill in all fields.");
      return;
    }
    if (Number(form.age) <= 18) {
      alert("Vehicle age must be above 18 years.");
      return;
    }
    setVehicles((prev) => [...prev, { ...form, fuel: Number(form.fuel), age: Number(form.age) }]);
    setForm({ id: "", registration: "", type: "", driver: "", status: "Active", lastService: "", fuel: "", age: "" });
  };

  // --- Edit Vehicle ---
  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...vehicles[idx] });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = () => {
    setVehicles((prev) =>
      prev.map((v, idx) =>
        idx === editIdx ? { ...editForm, fuel: Number(editForm.fuel), age: Number(editForm.age) } : v
      )
    );
    setEditIdx(null);
    setEditForm({});
  };

  // --- Delete Vehicle ---
  const handleDeleteClick = (idx) => setDeleteIdx(idx);
  const handleDeleteConfirm = () => {
    setVehicles((prev) => prev.filter((_, idx) => idx !== deleteIdx));
    setDeleteIdx(null);
  };

  // --- View Vehicle ---
  const handleViewClick = (v) => setViewVehicle(v);

  return (
    <Box className="dashboard-container" sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
      <Typography className="dashboard-header" variant="h4" fontWeight="bold" mb={3}>
        Logistics Management Dashboard
      </Typography>

      {/* --- Summary Cards --- */}
      <div className="summary-cards">
        {vehicleSummary.map((item) => (
          <div className="summary-card" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>



      {/* --- Add Vehicle Form --- */}
      <div className="add-vehicle-form">
  <h3 style={{ marginBottom: 16, color: "#222", fontWeight: 600 }}>Add Vehicle</h3>
  <form className="logistics-form" onSubmit={handleAddVehicle}>
    <input
      type="text"
      name="id"
      placeholder="Vehicle ID *"
      value={form.id}
      onChange={handleFormChange}
      required
    />
    <input
      type="text"
      name="registration"
      placeholder="Registration No. *"
      value={form.registration}
      onChange={handleFormChange}
      required
    />
    <input
      type="text"
      name="type"
      placeholder="Type *"
      value={form.type}
      onChange={handleFormChange}
      required
    />
    <input
      type="text"
      name="driver"
      placeholder="Driver *"
      value={form.driver}
      onChange={handleFormChange}
      required
    />
    <select
      name="status"
      value={form.status}
      onChange={handleFormChange}
      required
    >
      <option value="Active">Active</option>
      <option value="Maintenance">Maintenance</option>
      <option value="Idle">Idle</option>
    </select>
    <input
      type="date"
      name="lastService"
      placeholder="Last Service *"
      value={form.lastService}
      onChange={handleFormChange}
      required
    />
    <input
      type="number"
      name="fuel"
      placeholder="Fuel (km/l) *"
      value={form.fuel}
      onChange={handleFormChange}
      required
    />
    <input
      type="number"
      name="age"
      placeholder="Age (yrs) *"
      value={form.age}
      onChange={handleFormChange}
      required
      min={19}
    />
    <button type="submit">
      ADD VEHICLE
    </button>
  </form>
</div>

      {/* --- Utilization Chart --- */}
      <div className="chart-container">
        <Bar data={utilizationData} options={utilizationOptions} />
      </div>

      {/* --- Vehicle Table --- */}
      <div className="vehicle-table-container">
        <Typography variant="h6" mb={2}>
          Vehicle Fleet Summary
        </Typography>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Registration No.</th>
              <th>Type</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Last Service</th>
              <th>Fuel Efficiency (km/l)</th>
              <th>Age (yrs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, idx) => (
              <tr key={v.id + idx}>
                <td>{v.id}</td>
                <td>{v.registration}</td>
                <td>{v.type}</td>
                <td>{v.driver}</td>
                <td>
                  <Chip label={v.status} color={statusColor[v.status]} size="small" />
                </td>
                <td>{v.lastService}</td>
                <td>{v.fuel}</td>
                <td>{v.age}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleViewClick(v)}>
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
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Vehicle ID"
            name="id"
            value={editForm.id || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Registration No."
            name="registration"
            value={editForm.registration || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Type"
            name="type"
            value={editForm.type || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Driver"
            name="driver"
            value={editForm.driver || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            select
            label="Status"
            name="status"
            value={editForm.status || "Active"}
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
            label="Last Service"
            name="lastService"
            type="date"
            value={editForm.lastService || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ my: 1 }}
          />
          <TextField
            label="Fuel (km/l)"
            name="fuel"
            type="number"
            value={editForm.fuel || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            label="Age (yrs)"
            name="age"
            type="number"
            value={editForm.age || ""}
            onChange={handleEditFormChange}
            size="small"
            fullWidth
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
        <DialogTitle>Delete Vehicle</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this vehicle?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIdx(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* --- View Dialog --- */}
      <Dialog
        open={!!viewVehicle}
        onClose={() => setViewVehicle(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.75)",
            boxShadow: 4,
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            borderBottom: "1px solid #e2e8f0",
            px: 3,
            py: 2
          }}
        >
          Vehicle Details
        </DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            px: 3,
            py: 2,
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(10px)"
          }}
        >
          {["id", "registration", "type", "driver", "status", "lastService", "fuel", "age"].map((key) => (
            <Box
              key={key}
              sx={{
                background: "linear-gradient(to right, #e0f2fe, #ffffff)",
                p: 2,
                borderRadius: 2,
                mb: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
              <Typography variant="body1">{viewVehicle?.[key]}</Typography>
            </Box>
          ))}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setViewVehicle(null)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
