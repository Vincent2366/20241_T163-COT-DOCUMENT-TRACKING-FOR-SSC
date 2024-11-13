import React, { useState, useEffect } from 'react';
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
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/organizations');
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('Failed to load organizations');
      }
    };

    fetchOrganizations();
  }, []);

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
              <div style={{ width: '100%' }}>
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
            <div className="select-wrapper" style={{
              position: 'relative',
              width: '105%',
              marginBottom: '15px'
            }}>
              <select
                id="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  appearance: 'none',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e1e4e8',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#24292e',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <option value="">Select Organization</option>
                <optgroup label="USG/Institutional">
                  {organizations
                    .filter(org => org.type === 'USG/Institutional')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Academic Organizations">
                  {organizations
                    .filter(org => org.type === 'ACADEMIC')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Civic Organizations">
                  {organizations
                    .filter(org => org.type === 'CIVIC')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Religious Organizations">
                  {organizations
                    .filter(org => org.type === 'RELIGIOUS')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Fraternity and Sorority">
                  {organizations
                    .filter(org => org.type === 'FRATERNITY AND SORORITY')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
              </select>
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6c757d'
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M3.879 4.379L6 6.5l2.121-2.121a.75.75 0 111.06 1.06l-2.829 2.829a.75.75 0 01-1.06 0L2.47 5.439a.75.75 0 011.06-1.06z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
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