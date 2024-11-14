const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const documentRoutes = require('./document');
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require ('./userRoutes')


// ROUTES

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users',userRoutes);


module.exports = router;