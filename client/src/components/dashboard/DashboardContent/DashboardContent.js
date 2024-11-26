import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DashboardContent.module.css';
import { StatisticsSection } from './StatisticsSection';
import { DocumentHistory } from './DocumentHistory';
import { TransactionHistory } from './TransactionHistory';
import { PendingTransactions } from './PendingTransactions';
import { UserProfile } from './UserProfile';
import Transactions from './Transactions';

export function DashboardContent() {
  const location = useLocation();
  const [activeView, setActiveView] = useState(location.state?.view || 'transactions');
  const filter = location.state?.filter;
  const organization = location.state?.organization;

  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    } else if (location.pathname.includes('/profile')) {
      setActiveView('profile');
    }
  }, [location.state, location.pathname]);

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <UserProfile />;
      case 'transactions':
        if (filter === 'pending') {
          return <PendingTransactions />;
        } else if (filter === 'Keeping the Document') {
          return <TransactionHistory filterStatus="Keeping the Document" />;
        } else if (filter === 'all') {
          return <Transactions organization={organization} />;
        }
        return <TransactionHistory />;
      case 'documents':
        return <DocumentHistory type={filter || null} />;
      default:
        return <TransactionHistory />;
    }
  };

  return (
    <section className={styles.dashboardContent}>
      {activeView !== 'profile' && <StatisticsSection />}
      {renderContent()}
    </section>
  );
}
