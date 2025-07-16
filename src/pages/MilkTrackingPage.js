import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialForm = {
  recordid: "",
  date: "",
  farmerName: "",
  quantity: "",
  fatContent: "",
  snf: "",
};

const MilkTrackingPage = ({ form, setForm, records, setRecords }) => {
  const [editingId, setEditingId] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  // ✅ Load records from localStorage when component mounts
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("milkRecords")) || [];
    setRecords(storedRecords);
  }, []);

  // ✅ Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("milkRecords", JSON.stringify(records));
  }, [records]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (!form.farmerName.trim()) return;

  if (editingId !== null) {
    setRecords((prev) =>
      prev.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
    );
    setEditingId(null);
    toast.success("Record updated!");
  } else {
    setRecords((prev) => [...prev, { ...form, id: Date.now() }]);
    toast.success("Record added!");
  }

  setForm(initialForm);
};

  const handleEdit = (record) => {
    setForm(record);
    setEditingId(record.id);
    setViewingRecord(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleView = (record) => {
    setViewingRecord(record);
    setEditingId(null);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setViewingRecord(null);
  };

  return (
    <div className="milk-dashboard-content dashboard-content">
      <h2>Milk Tracking Dashboard</h2>

      {/* Milk Record Form */}
      {!viewingRecord && (
        <form className="milk-form farmers-form" onSubmit={handleSubmit}>
          <input
            name="recordid"
            placeholder="Record ID*"
            value={form.recordid}
            onChange={handleChange}
            required
            pattern="\d{5}"
            maxLength={5}
            minLength={5}
            inputMode="numeric"
          />
          <input
            type="date"
            name="date"
            placeholder="Date*"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            name="farmerName"
            placeholder="Farmer Name*"
            value={form.farmerName}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]+"
          />
          <input
            name="quantity"
            placeholder="Quantity (litres)*"
            value={form.quantity}
            onChange={handleChange}
            required
            inputMode="decimal"
            pattern="^\d+(\.\d{1,2})?$"
          />
          <input
            name="fatContent"
            placeholder="Fat Content (%)"
            value={form.fatContent}
            onChange={handleChange}
            inputMode="decimal"
            pattern="^\d+(\.\d{1,2})?$"
          />
          <input
            name="snf"
            placeholder="SNF (%)"
            value={form.snf}
            onChange={handleChange}
            inputMode="decimal"
            pattern="^\d+(\.\d{1,2})?$"
          />
          <div className="button-row">
            <button type="submit" className="btn-primary">
            {editingId ? "Update Record" : "Add Record"}
          </button>
          <button
      type="button"
      onClick={() => {
        if (window.confirm("Clear all Records?")) {
          localStorage.removeItem("records");
          setRecords([]);
        }
      }}
      className="btn-primary"
    >
      Reset All
    </button>
          {(editingId || viewingRecord) && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          </div>
          
        </form>
      )}

      {/* Milk Record View */}
      {viewingRecord && (
        <div className="milk-view farmer-view">
          <h3>Milk Record Details</h3>
          <p>
            <b>Record ID:</b> {viewingRecord.recordid}
          </p>
          <p>
            <b>Date:</b> {viewingRecord.date}
          </p>
          <p>
            <b>Farmer Name:</b> {viewingRecord.farmerName}
          </p>
          <p>
            <b>Quantity (litres):</b> {viewingRecord.quantity}
          </p>
          <p>
            <b>Fat Content (%):</b> {viewingRecord.fatContent}
          </p>
          <p>
            <b>SNF (%):</b> {viewingRecord.snf}
          </p>
          <button
            className="btn-secondary"
            onClick={handleCancel}
            style={{ marginRight: 8 }}
          >
            Close
          </button>
          <button
            className="btn-primary"
            onClick={() => handleEdit(viewingRecord)}
          >
            Edit
          </button>
        </div>
      )}

      {/* Milk Records Table */}
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Date</th>
              <th>Farmer Name</th>
              <th>Quantity (litres)</th>
              <th>Fat Content (%)</th>
              <th>SNF (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                  No milk records added yet.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.recordid}</td>
                  <td>{record.date}</td>
                  <td>{record.farmerName}</td>
                  <td>{record.quantity}</td>
                  <td>{record.fatContent}</td>
                  <td>{record.snf}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleView(record)}
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(record)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(record.id)}
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

export default MilkTrackingPage;
