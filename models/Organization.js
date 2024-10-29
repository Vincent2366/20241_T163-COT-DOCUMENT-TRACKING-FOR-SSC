const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    orgType: {
        type: String,
        enum: ['college_council', 'department_council', 'student_organization'],
        required: true
    },
    college: {
        type: String,
        required: true
    },
    president: {
        type: String,
        required: true
    },
    adviser: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    dateRegistered: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;