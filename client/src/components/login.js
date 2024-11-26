import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const recaptchaRef = React.useRef();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const response = await fetch('http://localhost:2000/api/auth/google-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                credential: credentialResponse.credential
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Reset reCAPTCHA
        recaptchaRef.current.reset();
        setIsCaptchaVerified(false);

        // Route based on role and status
        if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (data.user.role === 'officer' && data.user.status === 'active') {
            navigate('/dashboard');
        } else if (data.user.status === 'pending') {
            setError('Your account is pending approval');
        }

    } catch (error) {
        console.error("Google login error:", error);
        setError(error.message || 'Login failed. Please try again.');
        recaptchaRef.current.reset();
        setIsCaptchaVerified(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(!!value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!recaptchaRef.current.getValue()) {
        setError("Please complete the reCAPTCHA");
        return;
    }

    try {
        const response = await fetch('http://localhost:2000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email.toLowerCase(),
                password: formData.password
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Check user role and status
        if (data.user.role === 'officer' && data.user.status === 'pending') {
            throw new Error('Your account is still pending approval');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Reset reCAPTCHA
        recaptchaRef.current.reset();
        setIsCaptchaVerified(false);

        // Route based on role and status
        if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (data.user.role === 'officer' && data.user.status === 'active') {
            navigate('/dashboard');
        }

    } catch (error) {
        setError(error.message);
        console.error('Login error:', error);
        recaptchaRef.current.reset();
        setIsCaptchaVerified(false);
    } 
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" style={{ width: '450px', height: 'auto' }}/>
        <h1><span style={{ color: 'blue' }}></span></h1>
      </div>
      <div className="form-section">
        <div className="form-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'skyblue' }}>Welcome to <span style={{ color: '#448EE4', fontWeight: 'bold' }}>DocuTrack</span></h2>
            <p style={{ fontSize: '14px' }}><br />No account?<br /> <Link to="/sign-up" className="signup-link">Sign Up</Link></p>
          </div>
          <h1>Sign in</h1>
          
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <GoogleOAuthProvider clientId="814983617624-cr4q91nie6v91k83kv9io9stvabte2oo.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              size="large"
              logo_alignment="left"
            />
          </GoogleOAuthProvider>
      
          <form onSubmit={handleSubmit}>
            <label>Enter your username or email address</label>
            <input 
              type="text" 
              name="email"
              placeholder="Username or email address" 
              required 
              value={formData.email}
              onChange={handleInputChange}
            />
            <br />
            <label>Enter your Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleInputChange}
            />
       
            <ReCAPTCHA
              sitekey="6LdeY2oqAAAAAGSi81scus4rs5Rz8WM8yeWcdfrZ"
              ref={recaptchaRef}
              onChange={handleCaptchaChange}
            />
            
            <Link to="/forgot-password" className="forgot-password">Forgotten Password?</Link>
            <button 
              type="submit" 
              className="sign-in-btn"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;