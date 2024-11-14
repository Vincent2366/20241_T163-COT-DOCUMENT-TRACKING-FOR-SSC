import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManageOrganizations from './ManageOrganizations';
import ManageUsers from './ManageUsers';
import PendingUsersPage from './PendingUsersPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ManageUsers />} />
      <Route path="/manage-organizations" element={<ManageOrganizations />} />
      <Route path="/manage-users" element={<ManageUsers />} />
      <Route path="/pending-users" element={<PendingUsersPage />} />
    </Routes>
  );
};

export default AdminRoutes; 