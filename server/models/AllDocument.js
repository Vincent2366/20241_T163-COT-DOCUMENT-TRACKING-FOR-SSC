const mongoose = require('mongoose');

// Document schema
const documentSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: true,
        unique: true,
    },
    recipient: {
        type: String,
        required: true,
        immutable: true,
    },
    dateCreated: {
        type: Date,
        required: true,
        timestamps: true
    },
    lastModified: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: '',
    },
   
}, 

);

// Create the Document model
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
