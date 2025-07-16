import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MonthlyChart = ({ records }) => {
  const chartRef = useRef();

  useEffect(() => {
    const monthMap = Array(12).fill(0); // Jan to Dec

    // Sum up quantities by month
    records.forEach(record => {
      if (!record.date || !record.quantity) return;

      const month = new Date(record.date).getMonth(); // 0 = Jan
      const quantity = parseFloat(record.quantity);
      if (!isNaN(quantity)) {
        monthMap[month] += quantity;
      }
    });

    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Total Milk (L)',
            data: monthMap,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 3,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { usePointStyle: true, padding: 20 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Liters' },
            ticks: { callback: value => value + ' L' },
          },
          x: {
            title: { display: true, text: 'Month' },
            grid: { display: false }
          },
        },
      },
    });

    return () => chart.destroy();
  }, [records]);

  return <canvas ref={chartRef}></canvas>;
};

export default MonthlyChart;
