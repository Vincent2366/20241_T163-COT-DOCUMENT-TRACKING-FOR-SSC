const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const validateDocumentId = require('../middlewares/docuHistoryMiddleware');
const documentHandler = require('../handlers/documentsHandler')


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

module.exports = router;
