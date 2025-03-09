const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Organization name is required'],
        unique: true 
    },
    type: {
        type: String,
        enum: ['USG/Institutional', 'ACADEMIC', 'CIVIC', 'RELIGIOUS', 'FRATERNITY AND SORORITY'],
        required: true
    },
    organizationId: {
        type: String,
        unique: true,
        default: function() {
            return this.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 5);
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    editKey: {
        type: String,
        default: null,
        expires: 300 // Key will automatically expire after 5 minutes
    },
    editLockedAt: {
        type: Date,
        default: null
    },
    editLockedBy: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Add method to check if organization is locked
organizationSchema.methods.isLocked = function() {
    return this.editKey !== null && this.editLockedAt !== null;
};

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
 