import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styles from '../DashboardLayout.module.css';
import { Header } from '../Header/Header';
import AdminSideNavigation from './AdminSideNavigation';
import ManageOrganizations from './ManageOrganizations';
import ManageUsers from './ManageUsers';
import PendingUsersPage from './PendingUsersPage';
import { UserProfile } from '../DashboardContent/UserProfile';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ManageUsers />} />
      <Route path="/manage-organizations" element={<ManageOrganizations />} />
      <Route path="/manage-users" element={<ManageUsers />} />
      <Route path="/pending-users" element={<PendingUsersPage />} />
      <Route path="/profile" element={
        <div className={styles.dashboardContainer}>
          <Header />
          <div className={styles.mainContainer}>
            <AdminSideNavigation />
            <main className={styles.mainContent}>
              <UserProfile />
            </main>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AdminRoutes; 