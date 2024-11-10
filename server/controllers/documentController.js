const Document = require('../models/Document');
const DocumentHistory = require('../models/DocumentHistory');

// Create a new document
exports.createDocument = async (req, res) => {
    try {
        const { 
            documentName, 
            serialNumber, 
            recipient, 
            currentLocation, 
            originOffice 
        } = req.body;

        const newDocument = new Document({
            documentName,
            serialNumber,
            recipient,
            currentLocation,
            originOffice,
            dateCreated: new Date(),
            status: 'pending'
        });

        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get all documents with optional filters
exports.getAllDocuments = async (req, res) => {
    try {
        const filters = req.query;
        const documents = await Document.find(filters);
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single document by serial number
exports.getDocument = async (req, res) => {
    try {
        const document = await Document.findOne({ serialNumber: req.params.id });
        if (!document) return res.status(404).json({ error: 'Document not found' });
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Transfer document to new location
exports.transferDocument = async (req, res) => {
    const { newLocation } = req.body;
    try {
        const document = await Document.findOneAndUpdate(
            { serialNumber: req.params.id },
            { currentLocation: newLocation },
            { new: true }
        );
        if (!document) return res.status(404).json({ error: 'Document not found' });
        res.status(200).json(document);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOneAndDelete({ serialNumber: req.params.id });
        if (!document) return res.status(404).json({ error: 'Document not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDocumentHistoryById = async (documentId) => {
    try {
        const history = await DocumentHistory.find({ documentId })
            .sort({ date: -1 });
        return history;
    } catch (error) {
        throw error;
    }
};

const getAllDocumentHistory = async ({ dateRange, department, office }) => {
    try {
        let query = {};
        
        if (dateRange) {
            // Add date filtering logic if needed
            query.date = dateRange;
        }
        
        const history = await DocumentHistory.find(query)
            .sort({ date: -1 });
        return history;
    } catch (error) {
        throw error;
    }
};

// Add this new function
exports.getRecipientStats = async (req, res) => {
    try {
        const stats = await Document.aggregate([
            {
                $group: {
                    _id: '$recipient',
                    value: { $sum: 1 },
                }
            }
        ]);

        // Transform the data to include colors
        const colors = ['#344bfd', '#f4a79d', '#f68d2b', '#4CAF50', '#9C27B0']; // Add more colors if needed
        const formattedStats = stats.map((stat, index) => ({
            name: stat._id,
            value: stat.value,
            color: colors[index % colors.length]
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDailyStats = async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const stats = await Document.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastWeek }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format data for the last 7 days
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedStats = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const stat = stats.find(s => s._id === dateStr);
            
            formattedStats.push({
                day: i === 0 ? 'Today' : daysOfWeek[date.getDay()],
                value: stat ? stat.count : 0
            });
        }

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    ...module.exports,  // Keep existing exports
    getDocumentHistoryById,
    getAllDocumentHistory
}; 