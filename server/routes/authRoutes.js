const express = require('express');
const router = express.Router();

const authRoutesHandler = require('../handlers/authRoutesHandler')

const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET || 'c0a60eb64e68204f3c090e3609a203ad7eed4281c5508066391eb024de0b1b72a9c5d5ce6155a7f641fcb36b35cd65979dab085d039883d1ffacf77cac68e79a';

router.post('/register', authRoutesHandler.register);

router.post('/login', authRoutesHandler.login);

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
router.get('/user-details', extractUser, authRoutesHandler.userDetails);

// Add this new route to your existing authRoutes.js
router.get('/me', extractUser, authRoutesHandler.me);
router.post('/forgot-password', authRoutesHandler.forgotPassword);
router.post('/verify-code', authRoutesHandler.verifyCode);
router.post('/reset-password', authRoutesHandler.resetPassword);
router.post('/resend-code', authRoutesHandler.resendCode);

// Add this new route
router.post('/google-login', authRoutesHandler.googleLogin);  

module.exports = router;
