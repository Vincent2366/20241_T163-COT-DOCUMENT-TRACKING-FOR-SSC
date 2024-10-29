import React from 'react';
import styles from './StatisticsSection.module.css';
import { TransferChart } from './TransferChart.js';
import { PieChart } from './PieChart';

export function StatisticsSection() {
  return (
    <section className={styles.statisticsContainer}>
      <div className={styles.chartGrid}>
        <TransferChart />
        <PieChart />
      </div>
    </section>
  );
}