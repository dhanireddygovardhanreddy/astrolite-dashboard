import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DailyChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Cow Milk (L)',
            data: [950, 1050, 980, 1100, 1020, 980, 900],
            backgroundColor: '#4ade80',
            borderColor: '#4ade80',
            borderWidth: 1,
            barPercentage: 0.6,
          },
          {
            label: 'Buffalo Milk (L)',
            data: [850, 920, 880, 950, 900, 870, 820],
            backgroundColor: '#a3e635',
            borderColor: '#a3e635',
            borderWidth: 1,
            barPercentage: 0.6,
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
          x: { title: { display: true, text: 'Day' } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={chartRef}></canvas>;
};

export default DailyChart;
