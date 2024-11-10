import React, { useState } from 'react';
import styles from './TransferChart.module.css';

export const TransferChart = () => {
  const [dailyData] = useState([
    { day: 'M', value: 44 },
    { day: 'T', value: 127 },
    { day: 'W', value: 76 },
    { day: 'T', value: 98 },
    { day: 'F', value: 172 },
    { day: 'S', value: 16 },
    { day: 'Today', value: 16 }
  ]);

  const maxHeight = 172;

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
                height: `${(item.value / maxHeight) * 200}px`
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