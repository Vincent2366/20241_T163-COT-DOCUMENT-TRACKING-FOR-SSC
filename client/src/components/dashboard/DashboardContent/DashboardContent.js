import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DashboardContent.module.css';
import { StatisticsSection } from './StatisticsSection';
import { DocumentHistory } from './DocumentHistory';
import { TransactionHistory } from './TransactionHistory';
import { PendingTransactions } from './PendingTransactions';

export function DashboardContent() {
  const location = useLocation();
  const activeView = location.state?.view || 'transactions';
  const filter = location.state?.filter;

  return (
    <section className={styles.dashboardContent}>
      <StatisticsSection />
      {activeView === 'transactions' ? (
        filter === 'pending' ? (
          <PendingTransactions />
        ) : filter === 'Keeping the Document' ? (
          <TransactionHistory filterStatus="Keeping the Document" />
        ) : (
          <TransactionHistory />
        )
      ) : (
        <DocumentHistory type={filter || null} />
      )}
    </section>
  );
}
