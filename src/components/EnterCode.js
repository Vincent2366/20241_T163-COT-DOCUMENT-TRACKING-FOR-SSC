import React, { useState } from 'react';
import './forpass.css'; // Reuse the same CSS for styling consistency
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const EnterCode = () => {
  const [verificationCode, setVerificationCode] = useState(''); // Store the verification code
  const [error, setError] = useState(''); // Handle errors
  const navigate = useNavigate(); // For navigating to the Change Password page

  const handleSubmit = (e) => {
    e.preventDefault();

    // For simplicity, let's assume the correct code is '123456'
    const correctCode = '123456';

    if (verificationCode === correctCode) {
      // If the code is correct, navigate to the Change Password page
      navigate('/change-password');
    } else {
      // If the code is wrong, display an error message
      setError('Invalid verification code. Please try again.');
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
          <h1>Forgot Password</h1>
          <p style={{ marginBottom: '100px' }}>Confirm Your Account</p>
          
          {/* Display error message if the code is wrong */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Enter code</label>
            <input 
              type="text" 
              placeholder="Verification code" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required 
            />
            <label style={{ color: 'gray', marginBottom: '100px' }}>
              We sent a code to your email at *******@student.buksu.edu.ph. Enter that code to confirm your account
            </label>
            <br />
            <button type="submit" className="sign-in-btn">Verify</button>
          </form>
          
          <p>
            Didn't receive a code? <Link to="/forgot-password" className="resend-link">Resend Code</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterCode;
