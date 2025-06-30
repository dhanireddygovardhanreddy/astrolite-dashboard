import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MonthlyChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Cow Milk (L)',
            data: [3200, 3800, 4200, 4600, 5100, 5800, 6200, 5900, 5400, 5000, 4500, 4200],
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.2)',
            borderWidth: 3,
            tension: 0.4,
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Buffalo Milk (L)',
            data: [2800, 3200, 3600, 4000, 4400, 4800, 5200, 4900, 4600, 4300, 4000, 3700],
            borderColor: '#a3e635',
            backgroundColor: 'rgba(163, 230, 53, 0.2)',
            borderWidth: 3,
            tension: 0.4,
            cubicInterpolationMode: 'monotone'
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
            // grid: { display: false } // Remove y-axis grid lines
          },
          x: {
            title: { display: true, text: 'Month' },
            grid: { display: false } // Remove x-axis grid lines
          },
        },
        elements: {
          line: {
            tension: 0.4,
          }
        }
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={chartRef}></canvas>;
};

export default MonthlyChart;
