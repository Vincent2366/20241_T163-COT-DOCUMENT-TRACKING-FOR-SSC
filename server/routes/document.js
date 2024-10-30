const express = require('express');
const router = express.Router();
const { isAdmin, isOfficer } = require('../middlewares/auth');
const documentController = require('../controllers/documentController');
const AllDocument = require('../models/AllDocument');
const { 
    validateDocument, 
    validateTransfer,
    validateDocumentCreation 
} = require('../middlewares/documentMiddleware');

// Routes using controller methods and middleware
router.post('/', [isAdmin, validateDocumentCreation], documentController.createDocument);
router.get('/', isOfficer, documentController.getAllDocuments);
router.get('/:id', [isOfficer, validateDocument], documentController.getDocument);
router.put('/:id/transfer', [
    isOfficer, 
    validateDocument, 
    validateTransfer
], documentController.transferDocument);
router.delete('/:id', [isAdmin, validateDocument], documentController.deleteDocument);

router.get('/documents/all', async (req, res) => {
    try {
        const document = await AllDocument.find({});
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch the document with its history
    const document = await AllDocument.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // If you store history in the document model, return it
    // You might need to adjust this based on your actual data structure
    const history = document.history || [];
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching document history:', error);
    res.status(500).json({ message: 'Error fetching document history' });
  }
});

module.exports = router;
