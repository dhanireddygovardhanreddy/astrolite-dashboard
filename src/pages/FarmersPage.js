import React, { useState, useEffect } from "react";

// 1. Constant initial farmers data
const initialFarmers = [
  {
    id: 1,
    farmerid: "5555",
    name: "Govardhan",
    phone: "9390936834",
    village: "Proddatur",
    date: "2025-03-24",
    landSize: "5"
  },
  {
    id: 2,
    farmerid: "1234",
    name: "Lakshmi",
    phone: "9876543210",
    village: "Kadapa",
    date: "2025-03-25",
    landSize: "3"
  }
];

// 2. Initial form state
const initialForm = {
  farmerid: "",
  name: "",
  phone: "",
  village: "",
  date: "",
  landSize: "",
};

const FarmersPage = () => {
  // 3. State with localStorage persistence
  const [farmers, setFarmers] = useState(() => {
    const saved = localStorage.getItem("farmers");
    return saved ? JSON.parse(saved) : initialFarmers;
  });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [viewingFarmer, setViewingFarmer] = useState(null);

  // 4. Save to localStorage whenever farmers changes
  useEffect(() => {
    localStorage.setItem("farmers", JSON.stringify(farmers));
  }, [farmers]);

  // 5. Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
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

  const handleEdit = (farmer) => {
    setForm(farmer);
    setEditingId(farmer.id);
    setViewingFarmer(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this farmer?")) {
      setFarmers((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleView = (farmer) => {
    setViewingFarmer(farmer);
    setEditingId(null);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setViewingFarmer(null);
  };

  return (
    <div className="farmers-page">
      <h2>Farmers Dashboard</h2>

      {/* Farmer Form */}
      {!viewingFarmer && (
        <form className="farmers-form" onSubmit={handleSubmit}>
          <input
            name="farmerid"
            placeholder="ID*"
            value={form.farmerid}
            onChange={handleChange}
            required
            pattern="\d{4,5}"
            maxLength={5}
            minLength={4}
            inputMode="numeric"
          />
          <input
            name="name"
            placeholder="Name*"
            value={form.name}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]+"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone*"
            value={form.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            maxLength={10}
            minLength={10}
            inputMode="numeric"
            required
          />
          <input
            name="village"
            placeholder="Village*"
            value={form.village}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
          />
          <input
            name="landSize"
            placeholder="Land Size"
            value={form.landSize}
            onChange={handleChange}
            inputMode="numeric"
            pattern="\d+"
          />
          <button type="submit" className="btn-primary">
            {editingId ? "Update Farmer" : "Add Farmer"}
          </button>
          {(editingId || viewingFarmer) && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      )}

      {/* Farmer View */}
      {viewingFarmer && (
        <div className="farmer-view">
          <h3>Farmer Details</h3>
          <p><b>ID:</b> {viewingFarmer.farmerid}</p>
          <p><b>Name:</b> {viewingFarmer.name}</p>
          <p><b>Phone:</b> {viewingFarmer.phone}</p>
          <p><b>Village:</b> {viewingFarmer.village}</p>
          <p><b>Date:</b> {viewingFarmer.date}</p>
          <p><b>Land Size:</b> {viewingFarmer.landSize}</p>
          <button className="btn-secondary" onClick={handleCancel} style={{ marginRight: 8 }}>
            Close
          </button>
          <button className="btn-primary" onClick={() => handleEdit(viewingFarmer)}>
            Edit
          </button>
        </div>
      )}

      {/* Farmers Table */}
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Village</th>
              <th>Date</th>
              <th>Land Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                  No farmers added yet.
                </td>
              </tr>
            ) : (
              farmers.map((farmer) => (
                <tr key={farmer.id}>
                  <td>{farmer.farmerid}</td>
                  <td>{farmer.name}</td>
                  <td>{farmer.phone}</td>
                  <td>{farmer.village}</td>
                  <td>{farmer.date}</td>
                  <td>{farmer.landSize}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleView(farmer)}
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(farmer)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(farmer.id)}
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
    </div>
  );
};

export default FarmersPage;
