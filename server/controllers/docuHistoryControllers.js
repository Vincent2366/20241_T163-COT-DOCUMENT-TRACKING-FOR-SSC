const documentController = {};

// Fetch movement history for a specific document by ID
documentController.getDocumentHistoryById = async (req, res) => {
    try {
        const documentId = req.params.id;
        const documentHistory = await getDocumentHistoryById(documentId); // Replace with actual data fetch function
        
        if (!documentHistory) {
            return res.status(404).json({ message: 'Document not found' });
        }
        
        res.json(documentHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving document history', error });
    }
};
 
// Fetch all document transfer history with optional filters
documentController.getAllDocumentHistory = async (req, res) => {
    try {
        const { dateRange, department, office } = req.query;
        const documentHistory = await getAllDocumentHistory({ dateRange, department, office }); // Replace with actual data fetch function

        res.json(documentHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving document transfer history', error });
    }
};

module.exports = documentController;
