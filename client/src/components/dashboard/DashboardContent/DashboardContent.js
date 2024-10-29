import React from 'react';
import styles from './DashboardContent.module.css';
import { StatisticsSection } from './StatisticsSection';
import { TransactionHistory } from './TransactionHistory';

export function DashboardContent() {
  return (
    <section className={styles.dashboardContent}>
      <StatisticsSection />
      <TransactionHistory />
    </section>
  );
}
