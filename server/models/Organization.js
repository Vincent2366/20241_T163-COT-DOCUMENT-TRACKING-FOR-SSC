const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Organization name is required'] },
    organizationId: { type: String, required: [true, 'Organization ID is required'], unique: true },
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
 