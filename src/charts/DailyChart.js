import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DailyChart = ({ records }) => {
  const chartRef = useRef();

  useEffect(() => {
    const milkData = Array(7).fill(0); // Sunday to Saturday

    records.forEach(record => {
      if (!record.date || !record.quantity) return;

      const date = new Date(record.date);
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      const quantity = parseFloat(record.quantity);
      milkData[day] += isNaN(quantity) ? 0 : quantity;
    });

    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: 'Milk (L)',
            data: milkData,
            backgroundColor: '#38bdf8',
            borderColor: '#0ea5e9',
            borderWidth: 1,
            barPercentage: 0.6,
          }
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
            title: { display: true, text: 'Day of Week' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [records]);

  return <canvas ref={chartRef}></canvas>;
};

export default DailyChart;
