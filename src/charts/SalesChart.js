import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SalesChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'doughnut', // Use doughnut for concentric rings
      data: {
        labels: ['Retail', 'Wholesale', 'Exports'],
        datasets: [
          {
            label: '2024',
            data: [45, 35, 20],
            backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 2,
          },
          {
            label: '2025',
            data: [40, 30, 30],
            backgroundColor: ['#a3e635', '#f472b6', '#38bdf8'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 20 },
          },
          tooltip: {
            callbacks: {
              label: context => {
                const label = context.label || '';
                const value = context.raw;
                const datasetLabel = context.dataset.label || '';
                return `${datasetLabel} - ${label}: ${value}`;
              },
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={chartRef}></canvas>;
};

export default SalesChart;
