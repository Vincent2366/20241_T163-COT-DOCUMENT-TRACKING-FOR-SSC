const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Document = require('../models/Document');
const Organization = require('../models/Organization');

const generateSerialNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DOC-${year}-${random}`;
};

async function seedDocuments() {
    try {
        await connectDB();
        console.log('Connected to MongoDB...');

        // Get all organizations
        const organizations = await Organization.find();
        
        // Clear existing documents
        await Document.deleteMany({});
        console.log('Cleared existing documents...');

        // Create sample documents
        const documents = [
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Annual Budget Proposal',
                description: 'Yearly budget allocation request for organization activities',
                recipient: 'Supreme Student Council',
                remarks: 'Need approval from finance committee',
                status: 'Accept',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Submit supporting financial documents'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Student Council Meeting Minutes',
                description: 'Minutes from the monthly general assembly meeting',
                recipient: 'Supreme Student Council',
                remarks: 'Pending approval from council members',
                status: 'Accept',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Collect signatures from all officers'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Student Organization Recognition Forms',
                description: 'Annual renewal documents for student organizations',
                recipient: 'Supreme Student Council',
                remarks: 'Missing requirements from 3 organizations',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Follow up with pending organizations'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Student Council Election Guidelines',
                description: 'Updated election procedures for upcoming SC elections',
                recipient: 'Supreme Student Council',
                remarks: 'Awaiting COMELEC review',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Include new online voting procedures'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Student Activity Fund Report',
                description: 'Quarterly financial report of student activities',
                recipient: 'Supreme Student Council',
                remarks: 'Needs reconciliation with accounting records',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Attach supporting receipts and documentation'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Event Permit Request',
                description: 'Permission request for conducting leadership seminar',
                recipient: 'College of Business - Student Body Organization',
                remarks: 'Venue availability needs to be confirmed',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Provide event schedule and participant list'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Equipment Requisition Form',
                description: 'Request for laboratory equipment access',
                recipient: 'Computer Society (ComSoc)',
                remarks: 'Pending inventory check',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Submit equipment handling certification'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Activity Completion Report',
                description: 'Summary of community outreach program',
                recipient: 'BukSU - College Red Cross Youth Council',
                remarks: 'Missing attendance sheets',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Attach participant attendance and photos'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Membership Update Form',
                description: 'Updated list of active members for AY 2023-2024',
                recipient: 'Mathematics Society (MATHSOC)',
                remarks: 'Incomplete member information',
                status: 'in-transit',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Complete member contact details'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Facility Maintenance Request',
                description: 'Request for repair of organization office facilities',
                recipient: 'English Circle (EC)',
                remarks: 'Awaiting maintenance schedule',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Provide detailed list of repairs needed'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Fund Release Request',
                description: 'Request for release of approved project funds',
                recipient: 'Junior Philippine Institute of Accountants (JPIA)',
                remarks: 'Pending budget verification',
                status: 'pending',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Submit project timeline and cost breakdown'
            },
            {
                serialNumber: generateSerialNumber(),
                documentName: 'Event Sponsorship Proposal',
                description: 'Sponsorship request for annual technical symposium',
                recipient: 'Electronics Technology Society (ETS)',
                remarks: 'Additional details required',
                status: 'in-transit',
                userId: "user123",
                createdBy: "64f1f3c1e2c1e123456789ab",
                actionNeeded: 'Provide sponsorship packages and benefits'
            },
            {
                serialNumber: "SSC-DOC-001",
                documentName: "Student Council Budget Proposal",
                description: "Annual budget proposal for student activities",
                remarks: "Pending review by finance committee",
                recipient: "Supreme Student Council",
                status: "in-transit",
                createdAt: new Date()
            },
            {
                serialNumber: "SSC-DOC-002",
                documentName: "Event Planning Guidelines",
                description: "Updated guidelines for organizing student events",
                remarks: "Final version approved",
                recipient: "Supreme Student Council",
                status: "delivered",
                createdAt: new Date()
            },
            {
                serialNumber: "SSC-DOC-003",
                documentName: "Leadership Training Program",
                description: "Proposal for student leadership development",
                remarks: "Needs revision",
                recipient: "Supreme Student Council",
                status: "rejected",
                createdAt: new Date()
            },
            {
                serialNumber: "SSC-DOC-004",
                documentName: "Student Welfare Report",
                description: "Quarterly report on student welfare initiatives",
                remarks: "Under review",
                recipient: "Supreme Student Council",
                status: "in-transit",
                createdAt: new Date()
            },
            {
                serialNumber: "SSC-DOC-005",
                documentName: "Election Guidelines 2024",
                description: "Updated student council election procedures",
                remarks: "Approved by administration",
                recipient: "Supreme Student Council",
                status: "delivered",
                createdAt: new Date()
            }
        ];

        // Update all other documents in the array with the same pattern
        documents.forEach(doc => {
            doc.userId = "user123";
            doc.createdBy = "64f1f3c1e2c1e123456789ab";
            // Convert status to match enum values
            if (doc.status === 'In Progress') doc.status = 'in-transit';
            if (doc.status === 'Under Review' || doc.status === 'Pending') doc.status = 'pending';
        });

        // Insert new documents
        await Document.insertMany(documents);
        console.log('Documents seeded successfully!');

    } catch (error) {
        console.error('Error seeding documents:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDocuments(); 