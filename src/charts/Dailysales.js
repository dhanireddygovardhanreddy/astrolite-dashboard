import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getDayLabel = (dateStr) => {
  const dayNum = new Date(dateStr).getDay(); // 0 (Sun) to 6 (Sat)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayNum];
};

const DailySalesChart = ({ payments }) => {
  const chartRef = useRef();

  useEffect(() => {
    // --- Initialize blank arrays ---
    const sales2024 = Array(7).fill(0);
    const sales2025 = Array(7).fill(0);

    // --- Process each payment ---
    payments.forEach((p) => {
      if (!p.date || !p.amount) return;
      const year = new Date(p.date).getFullYear();
      const day = getDayLabel(p.date); // e.g., 'Mon'
      const index = days.indexOf(day);
      if (index === -1) return;

      const amt = parseFloat(p.amount) || 0;
      if (year === 2024) sales2024[index] += amt;
      else if (year === 2025) sales2025[index] += amt;
    });

    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: '2024',
            data: sales2024,
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
            data: sales2025,
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
  }, [payments]);

  return (
    <div style={{ width: '100%', height: '320px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DailySalesChart;
