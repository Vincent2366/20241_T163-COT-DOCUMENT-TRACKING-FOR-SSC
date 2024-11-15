const express = require('express');
const router = express.Router();
const User = require('../models/UserLoginModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const { sendVerificationCode } = require('../services/emailService');
const VerificationCode = require('../models/VerificationCode');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('948616457649-9m9i5mjm96aq76cgbk96t1rk0guo137k.apps.googleusercontent.com');

const JWT_SECRET = process.env.JWT_SECRET || 'c0a60eb64e68204f3c090e3609a203ad7eed4281c5508066391eb024de0b1b72a9c5d5ce6155a7f641fcb36b35cd65979dab085d039883d1ffacf77cac68e79a';

router.post('/register', async (req, res) => {
    try {
        const { username, email, organization, password  } = req.body;

        console.log('Organization received:', organization);

        console.log('Received registration data:', {
            username,
            email,
            organization,
            hasPassword: !!password
        });

        // Validate email format
        if (!email.endsWith('@student.buksu.edu.ph')) {
            return res.status(400).json({
                error: 'Please use a valid BukSU student email address'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email 
                    ? 'Email already registered' 
                    : 'Username already taken'
            });
        }

        // Create new user with organization
        const user = new User({
            username,
            email,
            password,
            organization,
            role: 'officer',
            status: 'pending'
        });

        console.log('User object before save:', user.toObject());

        await user.save();

        console.log('User saved successfully with ID:', user._id);

        // Include organization in the response
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please wait for admin approval.',
            user: {
                username,
                email,
                organization,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt details:', {
            email,
            providedPassword: password,
        });

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: email.toLowerCase() }
            ]
        });

        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
            console.log('User account not active:', email);
            return res.status(403).json({ error: 'Account is not active. Please wait for admin approval.' });
        }

        const isValidPassword = await user.comparePassword(password);
        
        console.log('Password comparison details:', {
            isValid: isValidPassword,
            email: user.email,
            role: user.role,
            status: user.status
        });

        if (!isValidPassword) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                status: user.status 
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add middleware to extract user from token
const extractUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Update the user-details route
router.get('/user-details', extractUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details' });
  }
});

// Add this new route to your existing authRoutes.js
router.get('/me', extractUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save code to database
    await VerificationCode.create({
      email,
      code: verificationCode
    });

    // Send email
    const emailSent = await sendVerificationCode(email, verificationCode);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification code' });
    }

    res.json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const verificationRecord = await VerificationCode.findOne({ email, code });
    
    if (!verificationRecord) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Delete the verification code after successful verification
    await VerificationCode.deleteOne({ _id: verificationRecord._id });
    
    // Generate a temporary token for password reset
    const resetToken = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ message: 'Code verified successfully', resetToken });
  } catch (error) {
    console.error('Code verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }

    const user = await User.findOne({ email: decoded.email });
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update the password directly using findOneAndUpdate
      await User.findOneAndUpdate(
        { email: decoded.email },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      console.log('Password reset successful for user:', decoded.email);
      return res.json({ message: 'Password reset successful' });
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({ error: 'Error while updating password' });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'Internal server error during password reset' });
  }
});

router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate new 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save new code to database
    await VerificationCode.create({
      email,
      code: verificationCode
    });

    // Send email with new code
    const emailSent = await sendVerificationCode(email, verificationCode);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification code' });
    }

    res.json({ message: 'New verification code sent to email' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this new route
router.post('/google-login', async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const googleId = payload.sub;

        if (!payload.email.endsWith('@student.buksu.edu.ph')) {
            return res.status(403).json({ error: 'Please use a BukSU student email' });
        }

        let user = await User.findOne({ 
            $or: [
                { googleId: googleId },
                { email: payload.email }
            ]
        });
        
        if (!user) {
            user = new User({
                username: payload.email.split('@')[0],
                email: payload.email,
                googleId: googleId,
                password: '', // Empty password for Google users
                organization: 'Pending',
                role: 'officer',
                status: 'pending'
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, status: user.status },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                status: user.status,
                organization: user.organization,
                hasPassword: !!user.password
            }
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;
