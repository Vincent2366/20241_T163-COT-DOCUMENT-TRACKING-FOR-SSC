import React, { useState, useEffect } from 'react';
import styles from './TransferChart.module.css';

export const TransferChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyStats = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/documents/daily-stats');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setDailyData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDailyStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dailyData.length) return <div>No data available</div>;

  const maxHeight = Math.max(...dailyData.map(item => item.value));

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>
        Average document
        <br />
        transferred per day
      </h2>
      <div className={styles.barChart}>
        {dailyData.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              className={styles.bar}
              style={{
                height: `${(item.value / (maxHeight || 1)) * 200}px`
              }}
              role="img"
              aria-label={`${item.day}: ${item.value} transfers`}
            />
            <span className={styles.labels}>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};