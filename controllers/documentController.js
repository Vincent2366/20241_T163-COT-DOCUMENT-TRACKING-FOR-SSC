const Document = require('../models/Document');

// Create a new document
exports.createDocument = async (req, res) => {
    const { serialNumber, currentLocation, originOffice } = req.body;
    try {
        const newDocument = new Document({ serialNumber, currentLocation, originOffice });
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
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