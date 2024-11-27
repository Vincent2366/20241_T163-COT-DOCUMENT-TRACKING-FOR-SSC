const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const validateDocumentId = require('../middlewares/docuHistoryMiddleware');
const documentHandler = require('../handlers/documentsHandler');
const Document = require('../models/Document');

router.get('/organization/:orgId/all-transactions', async (req, res) => {
    try {
        const { orgId } = req.params;
        console.log('Searching for organization:', orgId);

        const testQuery = await Document.find({}).limit(1);
        console.log('Test query result:', testQuery);

        const documents = await Document.find({
            $or: [
                { currentOffice: orgId },
                { originalSender: orgId },
                { recipient: orgId },
                { 'previousOffices': orgId }
            ]
        }).sort({ createdAt: -1 });
        
        console.log('Found documents:', documents.length);
        res.json(documents);
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error fetching organization transactions',
            error: error.message 
        });
    }
});

router.get('/debug', documentHandler.debug);
router.post('/new', documentHandler.newDocument);
router.get('/daily-stats', documentController.getDailyStats);
router.get('/recipient-stats', documentController.getRecipientStats);
router.get('/all', documentHandler.getAll);
router.get('/status-counts', documentHandler.statusCount);
router.get('/history', documentController.getAllDocumentHistory);
router.get('/:id/history', validateDocumentId, documentController.getDocumentHistoryById);
router.get('/history/:id', documentHandler.historyID);
router.put('/update-status/:id', documentHandler.updateStatus);
router.put('/forward/:id', documentHandler.forward);
router.get('/organization/:orgName', documentController.getDocumentsByOrganization);



module.exports = router;
