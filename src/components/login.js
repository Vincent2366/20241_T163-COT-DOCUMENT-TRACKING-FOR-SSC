import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './login.css'; // Import the CSS file for styling
import logo from '../assets/logo.png';
import googleLogo from '../assets/google.webp'; // Import the Google logo
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login'; // Import GoogleLogin
import ReCAPTCHA from 'react-google-recaptcha'; // Import ReCAPTCHA

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const recaptchaRef = React.useRef(); // Create a ref for the reCAPTCHA
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false); // State to track reCAPTCHA verification

  const responseGoogle = (response) => {
    console.log("Google response:", response); // Log the response from Google
    if (response.profileObj) {
      // Only navigate if the response is valid
      recaptchaRef.current.reset(); // Reset the reCAPTCHA
      setIsCaptchaVerified(false); // Reset the captcha verification state
      navigate('/dashboard'); // Redirect to the dashboard
    }
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(!!value); // Set state to true when reCAPTCHA is verified
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const recaptchaValue = recaptchaRef.current.getValue(); // Get the reCAPTCHA value
    if (!recaptchaValue) {
      alert("Please complete the reCAPTCHA"); // Alert if reCAPTCHA is not completed
      return;
    }
    
    console.log("Form submitted with reCAPTCHA value:", recaptchaValue);
    recaptchaRef.current.reset(); // Reset the reCAPTCHA
    setIsCaptchaVerified(false); // Reset the captcha verification state
    // Add your login API call here
    navigate('/dashboard'); // Redirect to the dashboard
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
        <h1><span style={{ color: 'blue' }}>DOCU TRACK</span></h1>
      </div>
      <div className="form-section">
        <div className="form-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'skyblue' }}>Welcome to <span style={{ color: '#448EE4', fontWeight: 'bold' }}>DocuTrack</span></h2>
            <p style={{ fontSize: '14px' }}><br />No account?<br /> <Link to="/sign-up" className="signup-link">Sign Up</Link></p>
          </div>
          <h1>Sign in</h1>
          
          {/* Google Login Button */}
          <GoogleLogin
            clientId="948616457649-9m9i5mjm96aq76cgbk96t1rk0guo137k.apps.googleusercontent.com" // Replace with your client ID
            buttonText="Sign in with Google"
            onSuccess={responseGoogle} // Handle success
            onFailure={responseGoogle} // Handle failure
            cookiePolicy={'single_host_origin'}
            render={renderProps => (
              <button 
                className="google-btn" 
                onClick={isCaptchaVerified ? renderProps.onClick : null} // Disable if captcha not verified
                disabled={!isCaptchaVerified} // Disable button if captcha not verified
              >
                <img src={googleLogo} alt="Google Icon" className="google-icon" />
                Sign in with Google
              </button>
            )}
          />
      
          <form onSubmit={handleSubmit}> {/* Update form to handle submit */}
            <label>Enter your username or email address</label>
            <input type="text" placeholder="Username or email address" required />
            <br />
            <label>Enter your Password</label>
            <input type="password" placeholder="Password" required />
       
            <ReCAPTCHA
              sitekey="6LdeY2oqAAAAAGSi81scus4rs5Rz8WM8yeWcdfrZ" // Replace with your reCAPTCHA site key
              ref={recaptchaRef} // Attach the ref
              onChange={handleCaptchaChange} // Handle reCAPTCHA change
            />
            
            <Link to="/forgot-password" className="forgot-password">Forgotten Password?</Link>
            <button type="submit" className="sign-in-btn">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;