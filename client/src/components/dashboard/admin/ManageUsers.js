import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../DashboardLayout.module.css';
import { Header } from '../Header/Header';
import AdminSideNavigation from './AdminSideNavigation';
import ManageUserUI from './ManageUsers/ManageUserUI';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/users/all');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.mainContainer}>
        <AdminSideNavigation />
        <main className={styles.mainContent}>
          <ManageUserUI users={users} />
        </main>
      </div>
    </div>
  );
};

export default ManageUsers; 