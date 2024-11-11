import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import AdminLayout from './AdminLayout';
import ManageOrganizations from './ManageOrganizations'; // Ensure this import is correct
import ManageUsers from './ManageUsers';

const AdminRoutes = () => {
  return (
    //<AdminLayout>
      <Routes>
        <Route path="manage-organizations" element={<ManageOrganizations />} />
        <Route path="manage-users" element={<ManageUsers/>}/> 
      </Routes>
    
  );
};

export default AdminRoutes; 