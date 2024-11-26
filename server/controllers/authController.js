const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserLoginModel'); 
const Organization = require('../models/Organization');
// const otpService = require('../services/otpService'); 
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('948616457649-9m9i5mjm96aq76cgbk96t1rk0guo137k.apps.googleusercontent.com');

// Registers a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;
    if (!organization) {
      return res.status(400).json({ error: 'Please select a valid organization' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, organization });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
}; 

// Authenticates a user and returns a JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        status: user.status
      },
      process.env.JWT_SECRET || 'your-fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        organization: user.organization
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verifies 2FA code
exports.verify2FA = async (req, res) => {
  try {
    const { userId, otpCode } = req.body;
    const isVerified = otpService.verifyOTP(userId, otpCode);
    if (!isVerified) {
      return res.status(401).json({ error: 'Invalid OTP code' });
    }
    res.json({ message: '2FA verification successful' });
  } catch (error) {
    res.status(500).json({ error: '2FA verification failed' });
  }
};

// Refreshes the JWT
exports.refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({ token: newToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token has expired' });
    }
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

// Logs out the user
exports.logoutUser = (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

// Retrieves the current user detail and role
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
};

exports.authenticate = (req, res, next) => {
  next();
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '948616457649-9m9i5mjm96aq76cgbk96t1rk0guo137k.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if email is a valid BukSU email
    if (!email.endsWith('@student.buksu.edu.ph')) {
      return res.status(400).json({ error: 'Please use a valid BukSU student email address' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        username: email.split('@')[0], // Use email prefix as username
        email,
        googleId: payload.sub,
        role: 'officer',
        status: 'pending',
        organization: 'Default Organization' // You might want to handle this differently
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        status: user.status
      },
      process.env.JWT_SECRET || 'your-fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        organization: user.organization
      }
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
};
