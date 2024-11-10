import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard/DashboardLayout';
import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import ForgotPassword from './components/ForgotPassword';
import EnterCode from './components/EnterCode';
import ChangePassword from './components/ChangePassword';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/enter-code" element={<EnterCode />} />
        <Route path="/change-password" element={<ChangePassword />} /> {/* Add Change Password route */}
      </Routes>
    </Router>
  );
};

export default App;
