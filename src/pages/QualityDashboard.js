import React, { useState } from "react";
import {
  Box, Typography, Button, MenuItem, Select, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const initialFormState = {
  product: "",
  batch: "",
  date: "",
  qualityScore: "",
  defects: "",
  inspected: "",
  failed: "",
  passed: "",
  complaints: ""
};

const initialData = [
  { id: 1, product: "Milk", batch: "B101", date: "2025-06-01", qualityScore: 97, defects: 1, inspected: 100, failed: 2, passed: 98, complaints: 0 },
  { id: 2, product: "Cheese", batch: "B102", date: "2025-06-02", qualityScore: 95, defects: 3, inspected: 120, failed: 4, passed: 116, complaints: 1 },
  { id: 3, product: "Yogurt", batch: "B103", date: "2025-06-03", qualityScore: 92, defects: 5, inspected: 90, failed: 5, passed: 85, complaints: 2 },
  { id: 4, product: "Milk", batch: "B104", date: "2025-06-04", qualityScore: 98, defects: 0, inspected: 110, failed: 1, passed: 109, complaints: 0 },
  { id: 5, product: "Cheese", batch: "B105", date: "2025-06-05", qualityScore: 96, defects: 2, inspected: 130, failed: 3, passed: 127, complaints: 0 },
];

export default function QualityDashboard() {
  // State
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [alertOpen, setAlertOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // Unique products for filter
  const products = [...new Set(data.map(d => d.product))];

  // Filtered data
  const filteredData = selectedProduct === "All"
    ? data
    : data.filter(d => d.product === selectedProduct);

  // KPI calculations
  const totalInspected = filteredData.reduce((sum, d) => sum + Number(d.inspected), 0);
  const totalFailed = filteredData.reduce((sum, d) => sum + Number(d.failed), 0);
  const totalPassed = filteredData.reduce((sum, d) => sum + Number(d.passed), 0);
  const totalDefects = filteredData.reduce((sum, d) => sum + Number(d.defects), 0);
  const totalComplaints = filteredData.reduce((sum, d) => sum + Number(d.complaints), 0);

  const defectRate = totalInspected ? ((totalDefects / totalInspected) * 100).toFixed(2) : 0;
  const passRate = totalInspected ? ((totalPassed / totalInspected) * 100).toFixed(2) : 0;
  const failRate = totalInspected ? ((totalFailed / totalInspected) * 100).toFixed(2) : 0;
  const avgQualityScore = filteredData.length
    ? (filteredData.reduce((sum, d) => sum + Number(d.qualityScore), 0) / filteredData.length).toFixed(1)
    : 0;

  // KPI cards
  const kpis = [
    { label: "Avg. Quality Score", value: `${avgQualityScore}%` },
    { label: "Defect Rate", value: `${defectRate}%` },
    { label: "Pass Rate", value: `${passRate}%` },
    { label: "Fail Rate", value: `${failRate}%` },
    { label: "Complaints", value: totalComplaints },
  ];

  // Chart data
  const trendLabels = filteredData.map(d => d.date);
  const defectTrend = {
    labels: trendLabels,
    datasets: [{
      label: "Defect Rate (%)",
      data: filteredData.map(d => ((d.defects / d.inspected) * 100).toFixed(2)),
      borderColor: "#e53e3e",
      backgroundColor: "rgba(229,62,62,0.15)",
      fill: true,
      tension: 0.4
    }]
  };

  const passFailPie = {
    labels: ["Passed", "Failed"],
    datasets: [{
      data: [totalPassed, totalFailed],
      backgroundColor: ["#38a169", "#e53e3e"]
    }]
  };

  const defectsByProduct = {
    labels: products,
    datasets: [{
      label: "Defects",
      data: products.map(p => data.filter(d => d.product === p).reduce((sum, d) => sum + Number(d.defects), 0)),
      backgroundColor: "#2563eb"
    }]
  };

  // Alerts (example: show if defect rate > 5%)
  const showAlert = defectRate > 5;

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // Edit mode
      setData((prev) =>
        prev.map((row, idx) =>
          idx === editingId ? { ...form, id: row.id } : row
        )
      );
      setEditingId(null);
    } else {
      // Add mode
      setData((prev) => [
        ...prev,
        { ...form, id: Date.now() }
      ]);
    }
    setForm(initialFormState);
  };

  const handleEdit = (idx) => {
    setForm(filteredData[idx]);
    setEditingId(idx);
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleView = (row) => {
    setViewRow(row);
  };

  const handleDelete = (id) => {
    setData(prev => prev.filter(row => row.id !== id));
    // If deleting the row being edited, reset the form
    if (editingId !== null && filteredData[editingId]?.id === id) {
      setForm(initialFormState);
      setEditingId(null);
    }
  };

  // Export to CSV
  const handleExport = () => {
    let csv = "Product,Batch,Date,Quality Score,Defects,Inspected,Failed,Passed,Complaints\n";
    filteredData.forEach(d => {
      csv += `${d.product},${d.batch},${d.date},${d.qualityScore},${d.defects},${d.inspected},${d.failed},${d.passed},${d.complaints}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quality_reports.csv";
    a.click();
    URL.revokeObjectURL(url);
    setAlertOpen(true);
  };

  function Field({ label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <span style={{ color: "#64748b", fontWeight: 600, minWidth: 140 }}>{label}:</span>
      <span style={{ color: "#1e293b", fontWeight: 500, marginLeft: 8 }}>{value}</span>
    </Box>
  );
}


  return (
    <Box className="quality-dashboard-container" sx={{ p: 3, minHeight: "100vh" }}>
      <Typography className="quality-dashboard-header" variant="h4" mb={3}>
        Quality Reports Dashboard
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="subtitle1">Filter by Product:</Typography>
        <Select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          size="small"
        >
          <MenuItem value="All">All</MenuItem>
          {products.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </Select>
        <Button variant="outlined" onClick={handleExport}>Export CSV</Button>
      </Box>

      {/* KPI Cards */}
      <div className="quality-summary-cards">
        {kpis.map((kpi) => (
          <div className="quality-summary-card" key={kpi.label}>
            <div className="quality-label">{kpi.label}</div>
            <div className="quality-value">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {showAlert && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Defect rate is above 5%! Please investigate recent batches.
        </Alert>
      )}

      {/* User Input Form */}
      <div className="quality-input-form">
        <h3>{editingId !== null ? "Edit Quality Report Entry" : "Add Quality Report Entry"}</h3>
        <form className="quality-form" onSubmit={handleAddEntry}>
          <input
            name="product"
            placeholder="Product*"
            value={form.product}
            onChange={handleFormChange}
            required
          />
          <input
            name="batch"
            placeholder="Batch*"
            value={form.batch}
            onChange={handleFormChange}
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date*"
            value={form.date}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="qualityScore"
            placeholder="Quality Score (%)"
            value={form.qualityScore}
            onChange={handleFormChange}
            required
            min={0}
            max={100}
          />
          <input
            type="number"
            name="defects"
            placeholder="Defects"
            value={form.defects}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="inspected"
            placeholder="Inspected"
            value={form.inspected}
            onChange={handleFormChange}
            required
            min={1}
          />
          <input
            type="number"
            name="failed"
            placeholder="Failed"
            value={form.failed}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="passed"
            placeholder="Passed"
            value={form.passed}
            onChange={handleFormChange}
            required
            min={0}
          />
          <input
            type="number"
            name="complaints"
            placeholder="Complaints"
            value={form.complaints}
            onChange={handleFormChange}
            required
            min={0}
          />
          <button type="submit" className="btn-primary">
            {editingId !== null ? "Update Entry" : "Add Entry"}
          </button>
          {editingId !== null && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Charts */}
      <div className="quality-charts-grid">
        <div className="quality-chart-container">
          <Line data={defectTrend} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="quality-chart-container">
          <Pie data={passFailPie} />
        </div>
        <div className="quality-chart-container">
          <Bar data={defectsByProduct} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Drill-down Table */}
      <div className="quality-table-container">
        <Typography variant="h6" mb={2}>Detailed Quality Reports</Typography>
        <table className="quality-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Batch</th>
              <th>Date</th>
              <th>Quality Score</th>
              <th>Defects</th>
              <th>Inspected</th>
              <th>Failed</th>
              <th>Passed</th>
              <th>Complaints</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={row.id}>
                <td>{row.product}</td>
                <td>{row.batch}</td>
                <td>{row.date}</td>
                <td>{row.qualityScore}</td>
                <td>{row.defects}</td>
                <td>{row.inspected}</td>
                <td>{row.failed}</td>
                <td>{row.passed}</td>
                <td>{row.complaints}</td>
                <td>
                  <button
                    className="icon-btn"
                    onClick={() => handleView(row)}
                    title="View"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleEdit(idx)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDelete(row.id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      <Dialog
  open={!!viewRow}
  onClose={() => setViewRow(null)}
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
  Quality Report Details
</DialogTitle>

<DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
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
      Basic Information
    </Box>
    <Field label="Product" value={viewRow?.product} />
    <Field label="Batch" value={viewRow?.batch} />
    <Field label="Date" value={viewRow?.date} />
  </Box>

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
      Quality Metrics
    </Box>
    <Field label="Quality Score" value={`${viewRow?.qualityScore}%`} />
    <Field label="Defects" value={viewRow?.defects} />
    <Field label="Inspected" value={viewRow?.inspected} />
    <Field label="Passed" value={viewRow?.passed} />
    <Field label="Failed" value={viewRow?.failed} />
    <Field label="Complaints" value={viewRow?.complaints} />
  </Box>
</DialogContent>
<DialogActions sx={{ justifyContent: "center", pb: 2 }}>
  <Button
    onClick={() => setViewRow(null)}
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

      {/* Export Notification */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={2500}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Exported to CSV!
        </Alert>
      </Snackbar>
    </Box>
  );
}
