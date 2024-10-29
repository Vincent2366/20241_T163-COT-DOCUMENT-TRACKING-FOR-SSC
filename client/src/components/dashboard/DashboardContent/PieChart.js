import React, { useEffect, useState } from 'react';
import styles from './PieChart.module.css';

const data = [
  { name: 'ComSoc', value: 300, color: '#344bfd' },
  { name: 'SBO', value: 120, color: '#f4a79d' },
  { name: 'Matigda', value: 80, color: '#f68d2b' }
];

export const PieChart = () => { // Removed TypeScript type annotation
  const [dataState, setData] = useState(data);

  const total = dataState.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {
    const canvas = document.getElementById('pieChart'); // Removed TypeScript type assertion
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let startAngle = 0;
        dataState.forEach(item => {
          const sliceAngle = (2 * Math.PI * item.value) / total;
          ctx.beginPath();
          ctx.fillStyle = item.color;
          ctx.moveTo(85, 85);
          ctx.arc(85, 85, 85, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          ctx.fill();
          startAngle += sliceAngle;
        });
      }
    }
  }, [dataState, total]);

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Transfer Ratio</h2>
      <div className={styles.pieChartWrapper}>
        <canvas 
          id="pieChart" 
          width="170" 
          height="170"
          role="img"
          aria-label="Pie chart showing transfer ratios"
        />
      </div>
      <div className={styles.legend}>
        {dataState.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div 
              className={`${styles.legendDot} ${styles[item.name.toLowerCase()]}`}
              role="presentation"
            />
            <span className={styles.legendLabel}>{item.name}</span>
            <span className={styles.legendValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
