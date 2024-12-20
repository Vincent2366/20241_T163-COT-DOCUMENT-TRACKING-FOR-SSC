const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const documentRoutes = require('./document');
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require ('./userRoutes')
const notificationsRouter = require('./notifications');
const reportsRouter = require('./reports');
// ROUTES

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users',userRoutes);
router.use('/notifications', notificationsRouter);
router.use('/reports', reportsRouter);

module.exports = router;