import React, { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  landSize: "",
  crops: ""
};

const FarmersPage = ({
  form,
  setForm,
  farmers,
  setFarmers
}) => {
  const [editingId, setEditingId] = useState(null);
  const [viewingFarmer, setViewingFarmer] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
            name="name"
            placeholder="Name*"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
          <input
            name="landSize"
            placeholder="Land Size"
            value={form.landSize}
            onChange={handleChange}
          />
          <input
            name="crops"
            placeholder="Crops"
            value={form.crops}
            onChange={handleChange}
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
          <p><b>Name:</b> {viewingFarmer.name}</p>
          <p><b>Email:</b> {viewingFarmer.email}</p>
          <p><b>Phone:</b> {viewingFarmer.phone}</p>
          <p><b>Address:</b> {viewingFarmer.address}</p>
          <p><b>Land Size:</b> {viewingFarmer.landSize}</p>
          <p><b>Crops:</b> {viewingFarmer.crops}</p>
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Land Size</th>
              <th>Crops</th>
              <th>Actions</th>
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
                  <td>{farmer.name}</td>
                  <td>{farmer.email}</td>
                  <td>{farmer.phone}</td>
                  <td>{farmer.address}</td>
                  <td>{farmer.landSize}</td>
                  <td>{farmer.crops}</td>
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
