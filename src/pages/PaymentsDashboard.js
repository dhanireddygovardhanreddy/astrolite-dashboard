import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const initialForm = {
  paymentId: "",
  date: "",
  payerName: "",
  amount: "",
  method: "",
  status: "",
};

const PaymentsDashboard = ({
  form,
  setForm,
  payments,
  setPayments
}) => {
  const [editingId, setEditingId] = useState(null);
  const [viewingPayment, setViewingPayment] = useState(null);

  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    const dateMap = {};
    payments.forEach((p) => {
      if (!p.date) return;
      if (!dateMap[p.date]) dateMap[p.date] = 0;
      const amt = parseFloat(p.amount) || 0;
      dateMap[p.date] += amt;
    });
    const labels = Object.keys(dateMap).sort();
    const data = labels.map((date) => dateMap[date]);
    return {
      labels,
      datasets: [
        {
          label: "Total Payments (₹)",
          data,
          backgroundColor: "#3b82f6",
        },
      ],
    };
  }, [payments]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Payments Analytics (Sum per Day)" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  // --- Form Handlers ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.payerName.trim() || !form.amount.trim()) return;
    if (editingId !== null) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...form, id: editingId } : p
        )
      );
      setEditingId(null);
    } else {
      setPayments((prev) => [
        ...prev,
        { ...form, id: Date.now() }
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (payment) => {
    setForm(payment);
    setEditingId(payment.id);
    setViewingPayment(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this payment record?")) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleView = (payment) => {
    setViewingPayment(payment);
    setEditingId(null);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setViewingPayment(null);
  };

  return (
    <div className="payments-dashboard-content dashboard-content">
      <h2>Payments Dashboard</h2>
      {/* --- Payment Form --- */}
      {!viewingPayment && (
        <form className="payments-form farmers-form" onSubmit={handleSubmit}>
          <input
            name="paymentId"
            placeholder="Payment ID*"
            value={form.paymentId}
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
            name="payerName"
            placeholder="Payer Name*"
            value={form.payerName}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]+"
          />
          <input
            name="amount"
            placeholder="Amount (₹)*"
            value={form.amount}
            onChange={handleChange}
            required
            inputMode="decimal"
            pattern="^\d+(\.\d{1,2})?$"
          />
          <select
            className="custom-select"
            name="method"
            value={form.method}
            onChange={handleChange}
            required
          >
            <option value="">Payment Method*</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </select>
          <select
            className="custom-select"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Status*</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <button type="submit" className="btn-primary">
            {editingId ? "Update Payment" : "Add Payment"}
          </button>
          {(editingId || viewingPayment) && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      )}

      {/* --- Payment View --- */}
      {viewingPayment && (
        <div className="payment-view farmer-view">
          <h3>Payment Details</h3>
          <p><b>Payment ID:</b> {viewingPayment.paymentId}</p>
          <p><b>Date:</b> {viewingPayment.date}</p>
          <p><b>Payer Name:</b> {viewingPayment.payerName}</p>
          <p><b>Amount (₹):</b> {viewingPayment.amount}</p>
          <p><b>Method:</b> {viewingPayment.method}</p>
          <p><b>Status:</b> {viewingPayment.status}</p>
          <button className="btn-secondary" onClick={handleCancel} style={{ marginRight: 8 }}>
            Close
          </button>
          <button className="btn-primary" onClick={() => handleEdit(viewingPayment)}>
            Edit
          </button>
        </div>
      )}

      {/* --- Payments Table --- */}
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Payer Name</th>
              <th>Amount (₹)</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.paymentId}</td>
                  <td>{payment.date}</td>
                  <td>{payment.payerName}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.method}</td>
                  <td>{payment.status}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleView(payment)}
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(payment)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(payment.id)}
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
      <br/>

     {/* --- Payments Analytics Chart --- */}
      <div style={{ 
        maxWidth: 600,
        margin: "0 auto 32px auto", 
        background: "#fff", 
        borderRadius: 12, 
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", 
        padding: 16, 
        }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PaymentsDashboard;
