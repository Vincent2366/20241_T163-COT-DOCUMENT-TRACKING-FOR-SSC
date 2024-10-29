const express = require('express');
const router = express.Router();
const { isAdmin, isOfficer } = require('../middleware/auth');
const documentController = require('../controllers/documentController');
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

module.exports = router;
