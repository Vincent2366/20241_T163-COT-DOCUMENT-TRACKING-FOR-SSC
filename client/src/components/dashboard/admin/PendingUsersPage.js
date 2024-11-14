import React from 'react';
import styles from '../DashboardLayout.module.css';
import { Header } from '../Header/Header';
import AdminSideNavigation from './AdminSideNavigation';
import PendingUsers from './ManageUsers/PendingUsers';

const PendingUsersPage = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.mainContainer}>
        <AdminSideNavigation />
        <main className={styles.mainContent}>
          <PendingUsers />
        </main>
      </div>
    </div>
  );
};

export default PendingUsersPage; 