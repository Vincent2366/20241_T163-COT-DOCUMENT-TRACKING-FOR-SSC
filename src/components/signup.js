import React from 'react';
import './signin.css'; // Reuse the CSS file for styling
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    // Add your form submission logic here
    console.log("Form submitted");
    navigate('/'); // Redirect to the login page
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
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Enter your university Email Address</label>
            <input id="email" type="email" placeholder="University Email" required />
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ width: '48%' }}>
                <label htmlFor="name">User Name</label>
                <input id="name" type="text" placeholder="User Name" required style={{ width: '100%' }} />
              </div>
              <div style={{ width: '40%' }}>
                <label htmlFor="number">Contact Number</label>
                <input id="number" type="tel" placeholder="09XX-XXX-XXXX" required style={{ width: '100%' }} />
              </div>
            </div>
            <br />
            <label htmlFor="password">Enter your Password</label>
            <input id="password" type="password" placeholder="Password" required />
            <br/>
            <button type="submit" className="sign-in-btn">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
