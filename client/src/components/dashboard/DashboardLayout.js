import React, { useState, useEffect } from 'react';
import styles from './DashboardLayout.module.css';
import SideNavigation from './SideNavigation/SideNavigation';
import { Header } from './Header/Header';
import { DashboardContent } from './DashboardContent/DashboardContent';

const DashboardLayout = () => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/documents/documents/all');
        const data = await response.json();
        console.log(data);
        
        setDocumentData(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.mainContainer}>
        <SideNavigation />
        <main className={styles.mainContent}>
          <DashboardContent documentData={documentData} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
