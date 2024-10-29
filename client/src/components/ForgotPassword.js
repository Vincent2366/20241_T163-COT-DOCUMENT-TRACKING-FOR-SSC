import React from 'react';
import './forpass.css'; // Import the CSS file for styling
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom'; // Use the navigate hook for redirecting

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any validation or API call here, then navigate to enter-code
    navigate('/enter-code');
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
          <h1>Forgot Password</h1>
          <p style={{ marginBottom: '100px' }}>Find Your Account</p>
          <form onSubmit={handleSubmit}>
            <label>Enter institutional email address</label>
            <input type="text" placeholder="Username or email address" required />
            <label style={{ color: 'gray', marginBottom: '100px' }}>You may receive a code to your institutional account for security and login purposes</label>
            <br />
            <button type="submit" className="sign-in-btn">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;