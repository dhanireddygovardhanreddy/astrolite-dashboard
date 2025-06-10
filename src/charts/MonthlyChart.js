import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MonthlyChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Cow Milk (L)',
            data: [3200, 3800, 4200, 4600, 5100, 5800, 6200, 5900, 5400, 5000, 4500, 4200],
            backgroundColor: '#4ade80',
            borderColor: '#4ade80',
            borderWidth: 1,
            barPercentage: 0.6,
          },
          {
            label: 'Buffalo Milk (L)',
            data: [2800, 3200, 3600, 4000, 4400, 4800, 5200, 4900, 4600, 4300, 4000, 3700],
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
          x: { title: { display: true, text: 'Month' } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={chartRef}></canvas>;
};

export default MonthlyChart;
