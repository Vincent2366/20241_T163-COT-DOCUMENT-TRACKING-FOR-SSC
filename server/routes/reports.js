const express = require('express');
const router = express.Router();
const { exportTransactions } = require('../controllers/reportController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/export-transactions/:organizationId', authenticateToken, exportTransactions);

module.exports = router; 