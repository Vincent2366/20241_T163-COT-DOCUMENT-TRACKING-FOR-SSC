import React, { useEffect, useState, useRef } from 'react';
import styles from './PieChart.module.css';

export const PieChart = () => {
  const [dataState, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/documents/recipient-stats');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // Process data to combine counts for each unique organization
        const orgCounts = new Map();
        
        data.forEach(item => {
          // Split combined recipients and process each one
          const recipients = item.name.split(', ');
          const countPerOrg = item.value / recipients.length; // Distribute count evenly
          
          recipients.forEach(org => {
            const trimmedOrg = org.trim();
            orgCounts.set(
              trimmedOrg, 
              (orgCounts.get(trimmedOrg) || 0) + countPerOrg
            );
          });
        });

        // Convert back to array format
        const processedData = Array.from(orgCounts.entries()).map(([name, value]) => ({
          name,
          value: Math.round(value), // Round to whole number
          color: getColorForOrg(name) // You'll need to implement this function
        }));

        setData(processedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add this function to maintain consistent colors for organizations
  const getColorForOrg = (orgName) => {
    // You can define a color mapping or use a hash function
    const colors = [
      '#1890ff', // blue
      '#52c41a', // green
      '#722ed1', // purple
      '#fa8c16', // orange
      '#eb2f96', // pink
      '#faad14', // yellow
      '#13c2c2', // cyan
      '#f5222d', // red
    ];
    
    // Use a simple hash function to consistently map organizations to colors
    const hash = orgName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const total = dataState.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {
    if (dataState.length === 0) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
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
          ref={canvasRef}
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
            />
            <span className={styles.legendLabel}>{item.name}</span>
            <span className={styles.legendValue}>({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
