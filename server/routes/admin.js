const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const adminHandler = require('../handlers/adminHandler')

// Add this route first, before other routes
router.get('/users/pending', isAdmin, adminHandler.getPendingUsers);

// Register a new student organization (SSC Admin only)
router.post('/organizations', adminHandler.organizations);

// Approve new organization officer account
router.put('/users/:userId/approve', isAdmin, adminHandler.userApprove);

// Get all registered organizations
router.get('/organizations', isAdmin, adminHandler.organizations);

// Update organization status
router.put('/organizations/:orgId/status', isAdmin, adminHandler.organizationsStatus);

module.exports = router;  