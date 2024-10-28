import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logging out (if needed)
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Dashboard</h1>
      <p>This is your dashboard page after successful login.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
//comment test


export default Dashboard;
