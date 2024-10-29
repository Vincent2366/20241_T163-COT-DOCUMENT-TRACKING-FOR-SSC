const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    orgType: { type: String, required: true },
    college: { type: String, required: true },
    president: { type: String, required: true },
    adviser: { type: String, required: true },
    academicYear: { type: String, required: true },
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
