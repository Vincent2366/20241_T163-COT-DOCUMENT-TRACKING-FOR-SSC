import React, { useState, useEffect } from 'react';
import './forpass.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const EnterCode = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from sessionStorage that was stored in ForgotPassword component
    const resetEmail = sessionStorage.getItem('resetEmail');
    if (!resetEmail) {
      navigate('/forgot-password');
    } else {
      setEmail(resetEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:2000/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the reset token for the next step
        sessionStorage.setItem('resetToken', data.resetToken);
        navigate('/change-password');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:2000/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Resending code failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
            Didn't receive a code? <Link to="/forgot-password" className="resend-link" onClick={handleResendCode}>Resend Code</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterCode;
