import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SalesChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Retail', 'Wholesale', 'Exports'],
        datasets: [
          {
            data: [45, 35, 20],
            backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
            borderColor: ['#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            hoverOffset: 4,
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
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}%`;
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
