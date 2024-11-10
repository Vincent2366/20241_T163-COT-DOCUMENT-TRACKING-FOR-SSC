import React, { useState } from 'react';
import './forpass.css'; // Use the same CSS for styling
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
    } else {
      // Handle the password reset logic here, such as sending the new password to the backend
      setError('');
      // After successfully resetting the password, navigate to login page
      navigate('/');
    }
  };

  return (
    <div className="login-container2">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
        <h1><span style={{ color: 'blue' }}>DOCU TRACK</span></h1>
      </div>
      <div className="form-section">
        <div className="form-content2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'skyblue' }}>Welcome to <span style={{ color: '#448EE4', fontWeight: 'bold' }}>DocuTrack</span></h2>
          </div>
          <h1>Change Password</h1>
          <p>Please enter your new password below.</p>
          <br/>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>Enter New Password</label>
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <label>Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <br />
            <button type="submit" className="sign-in-btn">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
