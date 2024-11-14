const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const Organization = require('../models/Organization');
const User = require('../models/UsersModel');

// Add this route first, before other routes
router.get('/users/pending', isAdmin, async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' });
        res.json(pendingUsers);
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register a new student organization (SSC Admin only)
router.post('/organizations', async (req, res) => {
    try {
        const {
            name,
            orgType,
            college,
            president,
            adviser,
            academicYear
        } = req.body;
        
        const organization = new Organization({
            name,
            orgType,
            college,
            president,
            adviser,
            academicYear
        });

        await organization.save();
        res.status(201).json({
            message: 'Student organization registered successfully',
            organization
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Approve new organization officer account
router.put('/users/:userId/approve', isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { status: 'active' },
            { new: true }
        ).exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ 
            message: 'User approved successfully',
            user 
        });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all registered organizations
router.get('/organizations', isAdmin, async (req, res) => {
    try {
        const organizations = await Organization.find({});
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update organization status
router.put('/organizations/:orgId/status', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const organization = await Organization.findById(req.params.orgId);
        
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        organization.status = status;
        await organization.save();

        res.json({
            message: 'Organization status updated successfully',
            organization
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;