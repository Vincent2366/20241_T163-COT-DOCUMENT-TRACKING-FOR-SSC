import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DashboardContent.module.css';
import { StatisticsSection } from './StatisticsSection';
import { DocumentHistory } from './DocumentHistory';
import { TransactionHistory } from './TransactionHistory';

export function DashboardContent() {
  const location = useLocation();
  const activeView = location.state?.view || 'transactions';
  const [activeDocumentType, setActiveDocumentType] = useState(null);

  return (
    <section className={styles.dashboardContent}>
      <StatisticsSection />
      {activeView === 'transactions' ? (
        <TransactionHistory type={activeDocumentType} />
      ) : (
        <DocumentHistory type={location.state?.filter || null} />
      )}
    </section>
  );
}
