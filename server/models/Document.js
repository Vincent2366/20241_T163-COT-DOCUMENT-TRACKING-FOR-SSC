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
        enum: ['pending', 'in-transit', 'delivered', 'rejected', 'Accept'],
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
});

// Only create index for serialNumber
documentSchema.index({ serialNumber: 1 }, { unique: true });

// Create the Document model
const Document = mongoose.model('document', documentSchema);

module.exports = Document;
