import React, { useState } from 'react';
import './signin.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    organization: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email format
      if (!formData.email.endsWith('@student.buksu.edu.ph')) {
        setError('Please use a valid BukSU student email address');
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const response = await fetch('http://localhost:2000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          organization: formData.organization,
          role: 'officer', // Add default role
          status: 'pending' // Add default status
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      alert('Registration successful! Please wait for admin approval.');
      navigate('/'); // Redirect to login page
    } catch (error) {
      setError(error.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const organizations = [
    'SBO COT',
    'SBO EDUC',
    'SBO CAS'
  ];

  return (
    <div className="signup-container">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
        <h1><span style={{ color: 'blue' }}>DOCU TRACK</span></h1>
      </div>
      <div className="form-section">
        <div className="form-content1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'skyblue' }}>Welcome to <span style={{ color: '#448EE4', fontWeight: 'bold' }}>DocuTrack</span></h2>
            <p style={{ fontSize: '14px' }}><br />Have account?<br /> <Link to="/" className="signup-link">Sign In</Link></p>
          </div>
          <h1>Sign Up</h1>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Enter your university Email Address</label>
            <input 
              id="email" 
              type="email" 
              placeholder="University Email" 
              required 
              value={formData.email}
              onChange={handleChange}
              pattern=".+@student\.buksu\.edu\.ph"
              title="Please use your BukSU student email"
            />
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ width: '48%' }}>
                <label htmlFor="username">User Name</label>
                <input 
                  id="username" 
                  type="text" 
                  placeholder="User Name" 
                  required 
                  value={formData.username}
                  onChange={handleChange}
                  style={{ width: '100%' }} 
                />
              </div>
            </div>
            <br />
            <label htmlFor="organization">Select your Organization</label>
            <select
              id="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              style={{
                width: '105%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ddd',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            >
              <option value="">Select Organization</option>
              {organizations.map((org, index) => (
                <option key={index} value={org}>{org}</option>
              ))}
            </select>
            <br />
            <label htmlFor="password">Enter your Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleChange}
              minLength="6"
            />
            <br/>
            <button 
              type="submit" 
              className="sign-in-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;