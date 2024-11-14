const mongoose = require('mongoose');

// Document schema
const documentSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
    },
    documentName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    recipient: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    remarks: {
        type: String,
        default: '',
    }, 
    status: {
        type: String,
        enum: ['pending', 'Keeping the Document', 'delivered', 'rejected', 'Accept'],
        default: 'Accept',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    forwardHistory: [{
        fromOffice: String,
        toOffice: String,
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'pending' } // pending, accepted, rejected
    }],
    originalSender: { type: String, required: true }, // Store the original sender's office
    currentOffice: { type: String, required: true },  // Current location of document
    previousOffices: [String], // Array of offices that have handled the document
});

// Only create index for serialNumber
documentSchema.index({ serialNumber: 1 }, { unique: true });

// Create the Document model
const Document = mongoose.model('document', documentSchema);

module.exports = Document;