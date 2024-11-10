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
    }, 
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'delivered', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Add any additional fields you need
});

// Only create index for serialNumber
documentSchema.index({ serialNumber: 1 }, { unique: true });

// Create the Document model
const Document = mongoose.model('document', documentSchema);

module.exports = Document;
