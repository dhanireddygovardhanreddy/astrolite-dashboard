import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesChartFromPayments({ payments }) {
  // Group payments by month (e.g., "2025-07")
  const monthlyTotals = useMemo(() => {
    const monthMap = {};
    payments.forEach(p => {
      if (!p.date) return;
      const month = p.date.slice(0, 7); // Extract "YYYY-MM"
      const amt = parseFloat(p.amount) || 0;
      monthMap[month] = (monthMap[month] || 0) + amt;
    });
    return monthMap;
  }, [payments]);

  // Prepare chart data
  const months = Object.keys(monthlyTotals).sort();
  const amounts = months.map(m => monthlyTotals[m]);

  const barData = {
    labels: months,
    datasets: [{
      label: "Monthly Payments (₹)",
      data: amounts,
      // backgroundColor: "#60a5fa",
      borderRadius: 6,
    }],
  };

  const options = {
    responsive: true,
    // plugins: {
    //   legend: { display: true },
    //   title: {
    //     display: true,
    //     // text: "Monthly Payments",
    //     font: { size: 18 }
    //   },
    // },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: value => `₹${value}` }
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, borderRadius: 12 }}>
      <Bar data={barData} options={options} />
    </div>
  );
}
