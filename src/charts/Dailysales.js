import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const days = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

const data2024 = [120, 150, 100, 170, 140, 180, 160];
const data2025 = [140, 130, 110, 160, 150, 170, 175];

const DailySalesChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: '2024',
            data: data2024,
            fill: true,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.12)',
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointRadius: 5,
          },
          {
            label: '2025',
            data: data2025,
            fill: true,
            borderColor: '#a3e635',
            backgroundColor: 'rgba(163,230,53,0.12)',
            tension: 0.4,
            pointBackgroundColor: '#a3e635',
            pointBorderColor: '#fff',
            pointRadius: 5,
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
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ${value}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 20 },
            grid: { color: 'rgba(59,130,246,0.07)' }
          },
          x: {
            grid: { display: false }
          }
        }
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <div style={{ width: '100%', height: '320px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DailySalesChart;
