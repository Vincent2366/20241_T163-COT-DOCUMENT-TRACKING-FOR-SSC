import React, { useState } from 'react';
import './forpass.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:2000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('resetEmail', email);
        navigate('/enter-code');
      } else {
        setError(data.error || 'Failed to send verification code');
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
        <img src={logo} alt="Logo" className="logo" style={{ width: '450px', height: 'auto' }}/>
        <h1><span style={{ color: 'blue' }}></span></h1>
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
            <input 
              type="email" 
              placeholder="Username or email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label style={{ color: 'gray', marginBottom: '100px' }}>
              You may receive a code to your institutional account for security and login purposes
            </label>
            {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
            <br />
            <button 
              type="submit" 
              className="sign-in-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;