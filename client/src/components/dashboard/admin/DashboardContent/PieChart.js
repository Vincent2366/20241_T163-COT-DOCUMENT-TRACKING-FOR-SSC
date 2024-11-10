import React, { useEffect, useState } from 'react';
import styles from './PieChart.module.css';

export const PieChart = () => {
  const [dataState, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/documents/recipient-stats');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = dataState.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {
    if (dataState.length === 0) return;

    const canvas = document.getElementById('pieChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (dataState.length === 0) return <div>No data available</div>;

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Document Distribution by Recipient</h2>
      <div className={styles.pieChartWrapper}>
        <canvas 
          id="pieChart" 
          width="170" 
          height="170"
          role="img"
          aria-label="Pie chart showing document distribution"
        />
      </div>
      <div className={styles.legend}>
        {dataState.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div 
              className={styles.legendDot}
              style={{ backgroundColor: item.color }}
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
