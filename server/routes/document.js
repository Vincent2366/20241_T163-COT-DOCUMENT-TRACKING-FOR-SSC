const express = require('express');
const router = express.Router();
const AllDocument = require('../models/Document');
const documentController = require('../controllers/documentController');
const validateDocumentId = require('../middlewares/docuHistoryMiddleware');

// Debug route
router.get('/debug', async (req, res) => {
    try {
        const documents = await AllDocument.find({});
        console.log('Debug documents found:', documents);
        res.json({
            count: documents.length,
            documents: documents
        });
    } catch (error) {
        console.error('Debug route error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Main documents route
router.get('/documents/all', async (req, res) => {
    try {
        console.log('Fetching all documents...');
        const documents = await AllDocument.find({}).sort({ createdAt: -1 });
        console.log(`Found ${documents.length} documents`);
        console.log(documents)
        res.json(documents);
    } catch (error) {
        console.error('Error in /documents/all:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to get all document transfer history with optional filters
router.get('/history', documentController.getAllDocumentHistory);

// Route to get movement history of a specific document by ID
router.get('/:id/history', validateDocumentId, documentController.getDocumentHistoryById);

// Add this new route
router.get('/recipient-stats', documentController.getRecipientStats);

// Add this new route
router.get('/daily-stats', documentController.getDailyStats);

module.exports = router;
