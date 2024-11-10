const express = require('express');
const router = express.Router();
const User = require('../models/UserLoginModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, organization } = req.body;

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

        // Validate organization
        const validOrganizations = ['SBO COT', 'SBO EDUC', 'SBO CAS'];
        if (!organization || !validOrganizations.includes(organization)) {
            return res.status(400).json({
                error: 'Please select a valid organization'
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
            process.env.JWT_SECRET || 'your-secret-key',
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

module.exports = router;
