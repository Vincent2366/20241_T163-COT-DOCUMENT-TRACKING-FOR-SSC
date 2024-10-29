const mongoose = require('mongoose');

// Document schema
const documentSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
    },
    originOffice: {
        type: String,
        required: true,
        immutable: true,
    },
    currentLocation: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
    remarks: {
        type: String,
        default: '',
    },
   
});

// Create the Document model
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
