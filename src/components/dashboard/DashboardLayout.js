import React from 'react';
import styles from './DashboardLayout.module.css'; // Assuming this CSS file is in the same folder
import SideNavigation from './SideNavigation/SideNavigation'; // Changed to default import
import { Header } from './Header/Header'; // Use curly braces for named import
import { DashboardContent } from './DashboardContent/DashboardContent'; // Use curly braces for named import

export function DashboardLayout() {
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.mainContainer}>
        <SideNavigation />
        <main className={styles.mainContent}>
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
