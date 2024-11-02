const express = require('express');
const router = express.Router();
const User = require('../models/UserLoginModel'); // Adjust path to your User model
const bcrypt = require('bcryptjs');

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create the user
        const user = new User({
            username,
            email,
            password, // Password will be hashed in the pre-save hook
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { username, email, role: user.role, status: user.status } // Send user info except password
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const user = await User.find({});
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
