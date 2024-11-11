import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../DashboardLayout.module.css';
import { Header } from '../Header/Header';
import AdminSideNavigation from './AdminSideNavigation';
import ManageOrg from './ManageOrganizations/ManageOrg';

const ManageOrganizations = () => {
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/organizations');
        const data = await response.json();
        console.log('Fetched organizations:', data);
        setOrganizationData(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
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
          <ManageOrg organizationData={organizationData} />
        </main>
      </div>
    </div>
  );
};

export default ManageOrganizations; 