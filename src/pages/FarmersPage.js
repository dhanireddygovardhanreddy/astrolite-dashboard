import React, { useState } from "react";

// Farmer form initial state
const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  landSize: "",
  crops: ""
};

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [viewingFarmer, setViewingFarmer] = useState(null);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update farmer
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    if (editingId !== null) {
      setFarmers((prev) =>
        prev.map((f) =>
          f.id === editingId ? { ...form, id: editingId } : f
        )
      );
      setEditingId(null);
    } else {
      setFarmers((prev) => [
        ...prev,
        { ...form, id: Date.now() }
      ]);
    }
    setForm(initialForm);
  };

  // Edit farmer
  const handleEdit = (farmer) => {
    setForm(farmer);
    setEditingId(farmer.id);
    setViewingFarmer(null);
  };

  // Delete farmer
  const handleDelete = (id) => {
    if (window.confirm("Delete this farmer?")) {
      setFarmers((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // View farmer
  const handleView = (farmer) => {
    setViewingFarmer(farmer);
    setEditingId(null);
  };

  // Cancel editing/viewing
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setViewingFarmer(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2>Farmers Dashboard</h2>

      {/* Farmer Form */}
      {!viewingFarmer && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
            background: "#f8fafc",
            padding: 16,
            borderRadius: 8
          }}
        >
          <input
            name="name"
            placeholder="Name*"
            value={form.name}
            onChange={handleChange}
            required
            style={{ flex: "1 1 200px", padding: 8 }}
          />
          <input
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
            style={{ flex: "1 1 200px", padding: 8 }}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            style={{ flex: "1 1 120px", padding: 8 }}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            style={{ flex: "2 1 220px", padding: 8 }}
          />
          <input
            name="landSize"
            placeholder="Land Size"
            value={form.landSize}
            onChange={handleChange}
            style={{ flex: "1 1 100px", padding: 8 }}
          />
          <input
            name="crops"
            placeholder="Crops"
            value={form.crops}
            onChange={handleChange}
            style={{ flex: "2 1 180px", padding: 8 }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 24px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            {editingId ? "Update Farmer" : "Add Farmer"}
          </button>
          {(editingId || viewingFarmer) && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "8px 16px",
                background: "#e5e7eb",
                color: "#111",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {/* Farmer View */}
      {viewingFarmer && (
        <div
          style={{
            background: "#f1f5f9",
            padding: 24,
            borderRadius: 8,
            marginBottom: 32
          }}
        >
          <h3>Farmer Details</h3>
          <p>
            <b>Name:</b> {viewingFarmer.name}
          </p>
          <p>
            <b>Email:</b> {viewingFarmer.email}
          </p>
          <p>
            <b>Phone:</b> {viewingFarmer.phone}
          </p>
          <p>
            <b>Address:</b> {viewingFarmer.address}
          </p>
          <p>
            <b>Land Size:</b> {viewingFarmer.landSize}
          </p>
          <p>
            <b>Crops:</b> {viewingFarmer.crops}
          </p>
          <button
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              background: "#e5e7eb",
              color: "#111",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginRight: 8
            }}
          >
            Close
          </button>
          <button
            onClick={() => handleEdit(viewingFarmer)}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Edit
          </button>
        </div>
      )}

      {/* Farmers Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden"
        }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Land Size</th>
            <th style={thStyle}>Crops</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmers.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                No farmers added yet.
              </td>
            </tr>
          ) : (
            farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td style={tdStyle}>{farmer.name}</td>
                <td style={tdStyle}>{farmer.email}</td>
                <td style={tdStyle}>{farmer.phone}</td>
                <td style={tdStyle}>{farmer.address}</td>
                <td style={tdStyle}>{farmer.landSize}</td>
                <td style={tdStyle}>{farmer.crops}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleView(farmer)}
                    style={iconBtnStyle}
                    title="View"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => handleEdit(farmer)}
                    style={iconBtnStyle}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(farmer.id)}
                    style={iconBtnStyle}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Table cell and header styles
const thStyle = {
  padding: "10px 8px",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: "bold",
  background: "#f1f5f9"
};
const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb"
};
const iconBtnStyle = {
  background: "none",
  border: "none",
  color: "#3b82f6",
  cursor: "pointer",
  fontSize: 16,
  marginRight: 8
};

export default FarmersPage;
