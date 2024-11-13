const Document = require('../models/Document');

// Validate document existence
exports.validateDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        req.document = document; 
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error validating document' });
    }
};
 
// Validate document transfer permissions
exports.validateTransfer = async (req, res, next) => {
    try {
        const { document } = req;
        // Check if user's office matches document's current location
        if (req.user.office !== document.currentLocation) {
            return res.status(403).json({ 
                error: 'You can only transfer documents from your office'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error validating transfer' });
    }
};

// Validate document creation
exports.validateDocumentCreation = (req, res, next) => {
    const { serialNumber, documentName, recipient, userId } = req.body;
    
    if (!serialNumber || !documentName || !recipient || !userId) {
        return res.status(400).json({ 
            success: false,
            message: 'Serial number, document name, recipient, and user ID are required' 
        });
    }
    next();
}; 