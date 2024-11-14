import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../DashboardLayout.module.css';
import { Header } from '../Header/Header';
import AdminSideNavigation from './AdminSideNavigation';
import { DashboardContent } from './DashboardContent/DashboardContent';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDocument = async () => {
      try {
        const response = await fetch('http://localhost:2000/documents/all');
        const data = await response.json();
        setDocumentData(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.mainContainer}>
        <AdminSideNavigation />
        <main className={styles.mainContent}>
          <DashboardContent documentData={documentData} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 