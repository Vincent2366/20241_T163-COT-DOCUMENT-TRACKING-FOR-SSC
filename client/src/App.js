import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard/DashboardLayout';
import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import ForgotPassword from './components/ForgotPassword';
import EnterCode from './components/EnterCode';
import ChangePassword from './components/ChangePassword';
import Transactions from './components/dashboard/DashboardContent/Transactions';

import AdminRoutes from './components/dashboard/admin/AdminRoutes';
import { UserProfile } from './components/dashboard/DashboardContent/UserProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route 
            path="profile" 
            element={<Navigate to="/dashboard" state={{ view: 'profile' }} replace />} 
          />
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/enter-code" element={<EnterCode />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard/transactions" element={<Transactions />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/dashboard/profile" element={<UserProfile />} />
     
        
      </Routes>
    </Router>
  );
};

export default App;
