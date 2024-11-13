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

router.get('/status-counts', async (req, res) => {
    try {
      const userOrganization = req.query.organization;
      
      if (!userOrganization) {
        return res.status(400).json({ 
          error: 'Organization parameter is required'
        });
      }

      const pendingCount = await AllDocument.countDocuments({ 
        recipient: userOrganization,
        status: 'pending'
      });
      
      const inTransitCount = await AllDocument.countDocuments({ 
        recipient: userOrganization,
        status: 'Accept'
      });
      
      res.json({
        pending: pendingCount,
        inTransit: inTransitCount
      });
    } catch (error) {
      console.error('Error in status-counts:', error);
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

// Add this after your existing routes
router.get('/history/:id', async (req, res) => {
  try {
    const document = await AllDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Create a history entry for the document
    const history = [
      {
        date: document.createdAt,
        action: 'Document Created',
        description: `Document "${document.documentName}" was created`
      }
    ];

    // Add status change history if status is not pending
    if (document.status !== 'pending') {
      history.push({
        date: document.updatedAt || document.createdAt,
        action: 'Status Updated',
        description: `Document status changed to ${document.status}`
      });
    }

    res.json(history);
  } catch (error) {
    console.error('Error fetching document history:', error);
    res.status(500).json({ message: 'Error retrieving document history' });
  }
});

module.exports = router;
