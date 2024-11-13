const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Organization = require('../models/Organization');

const organizations = [
    // USG/Institutional
    { name: 'Supreme Student Council', type: 'USG/Institutional' },
    { name: 'College of Public Administration and Governance - Student Body Organization', type: 'USG/Institutional' },
    { name: 'College of Technologies - Student Body Organization', type: 'USG/Institutional' },
    { name: 'College of Education - Student Body Organization', type: 'USG/Institutional' },
    { name: 'College of Business - Student Body Organization', type: 'USG/Institutional' },
    { name: 'College of Arts and Sciences- Student Body Organization', type: 'USG/Institutional' },
    { name: 'College of Nursing -Student Body Organization', type: 'USG/Institutional' },
    { name: 'Collegianer - The Official Student Publication', type: 'USG/Institutional' },
    { name: 'Matigda - The Official Yearbook Publication', type: 'USG/Institutional' },

    // Academic Organizations
    { name: 'League of Elementary Educators (LEE)', type: 'ACADEMIC' },
    { name: 'League of Social Science Students (LSSS)', type: 'ACADEMIC' },
    { name: 'Mathematics Society (MATHSOC)', type: 'ACADEMIC' },
    { name: 'Junior Philippine Institute of Accountants (JPIA)', type: 'ACADEMIC' },
    { name: 'English Language and Literature Council (ELLC)', type: 'ACADEMIC' },
    { name: 'Economics Society (ECONSOC)', type: 'ACADEMIC' },
    { name: 'Kapisanan ng mga Mag-aaral sa Filipino (KAMFIL)', type: 'ACADEMIC' },
    { name: 'The Educationalists', type: 'ACADEMIC' },
    { name: 'Philippine Association of Food Technologist, Inc. - BukSU Chapter', type: 'ACADEMIC' },
    { name: 'Social Studies Society (SSS)', type: 'ACADEMIC' },
    { name: 'Electronics Technology Society (ETS)', type: 'ACADEMIC' },
    { name: 'Young Educators Club (YEC)', type: 'ACADEMIC' },
    { name: 'Public Administration Society (PAS)', type: 'ACADEMIC' },
    { name: 'Guild of Science Educators (GSE)', type: 'ACADEMIC' },
    { name: 'Computer Society (ComSoc)', type: 'ACADEMIC' },
    { name: 'Community Development Students Society (CDSS)', type: 'ACADEMIC' },
    { name: 'Bar Operations Commission (BarOps)', type: 'ACADEMIC' },
    { name: 'English Circle (EC)', type: 'ACADEMIC' },
    { name: 'Junior Financial Managers Club', type: 'ACADEMIC' },
    { name: 'The Amicus Sophia', type: 'ACADEMIC' },
    { name: 'Natural Sciences Society', type: 'ACADEMIC' },
    { name: 'Mathematics Educators\' Circle', type: 'ACADEMIC' },
    { name: 'Sociology Student Organization (SSO)', type: 'ACADEMIC' },
    { name: 'BPED - Society', type: 'ACADEMIC' },
    { name: 'League of Hospitality Leaders (LOHL)', type: 'ACADEMIC' },
    { name: 'Chamber of Young Development Communicators', type: 'ACADEMIC' },
    { name: 'Automotive Society', type: 'ACADEMIC' },
    { name: 'Master of Public Administration – Graduate Students organization', type: 'ACADEMIC' },
    { name: 'Business Graduate Student\'s Collegium', type: 'ACADEMIC' },
    { name: 'Doctor of Philosophy in English Language Student Body Organization', type: 'ACADEMIC' },
    { name: 'Master of Philosophy in English Language Student Body Organization', type: 'ACADEMIC' },
    { name: 'Law Students\' Society', type: 'ACADEMIC' },
    { name: 'College of Nursing Debate Club', type: 'ACADEMIC' },
    { name: 'Master of Arts in Sociology Student Organization', type: 'ACADEMIC' },
    { name: 'Nightingales Note', type: 'ACADEMIC' },
    { name: 'Law Debate and Moot Society', type: 'ACADEMIC' },

    // Civic Organizations
    { name: 'BukSU - College Red Cross Youth Council', type: 'CIVIC' },
    { name: 'Association of Dormitory Residents (ADORE)', type: 'CIVIC' },
    { name: 'Nightingale\'s Harmonic Guild', type: 'CIVIC' },
    { name: 'Bukidnon State University Association of DOST Scholars (BADS)', type: 'CIVIC' },
    { name: 'P.E Human Kinetics', type: 'CIVIC' },
    { name: 'Project Michelangelo', type: 'CIVIC' },
    { name: 'BukSU- Sports Council', type: 'CIVIC' },
    { name: 'Eco-Venture Club Philippines Inc. Bukidnon State University Chapter', type: 'CIVIC' },
    { name: 'Bukidnon Indigenous Youth of Seven Tribes', type: 'CIVIC' },
    { name: 'Anak Lumad Movement Society', type: 'CIVIC' },

    // Religious Organizations
    { name: 'Movement of Adventists Students Adventist Ministry to College and University Students (MAS-AMiCUS) BukSU Chapter', type: 'RELIGIOUS' },
    { name: 'Campus Bible Fellowship', type: 'RELIGIOUS' },
    { name: 'Chi-Epsilon Evangelion Christian Campus Ministry', type: 'RELIGIOUS' },
    { name: 'BukSU- Muslim Student Association', type: 'RELIGIOUS' },
    { name: 'Liñaje Real — Bliss Foursquare Church', type: 'RELIGIOUS' },
    { name: 'Philippine Student Alliance Lay Movement', type: 'RELIGIOUS' },
    { name: 'Christian Brotherhood International', type: 'RELIGIOUS' },
    { name: 'Youth with A Vision', type: 'RELIGIOUS' },
    { name: 'Christ\'s Youth in Action', type: 'RELIGIOUS' },
    { name: 'Christian Youth Fellowship Campus Ministry (CYFCM)', type: 'RELIGIOUS' },
    { name: 'Next Gen Chi Aplha Campus Ministry', type: 'RELIGIOUS' },
    { name: 'Christ-Youth for Christ Campus Based (CFC-YFC)', type: 'RELIGIOUS' },

    // Fraternity and Sorority
    { name: 'Gamma Delta Phi "Eurekans" Delta Chapter', type: 'FRATERNITY AND SORORITY' },
    { name: 'MONA LISA SOCIETY FRATERNITY AND SORORITY', type: 'FRATERNITY AND SORORITY' },
    { name: 'Portia Sorority of Mindanao-BukSU Chapter', type: 'FRATERNITY AND SORORITY' },
    { name: 'Fraternitas Scintilla Legis - Bukidnon State University Chapter', type: 'FRATERNITY AND SORORITY' },
    { name: 'GAMMA KAPPA PHI 1962 (KAPPANS 1962)', type: 'FRATERNITY AND SORORITY' },
    { name: 'Student Commission on External Audit', type: 'FRATERNITY AND SORORITY' }
];

async function seedOrganizations() {
    try {
        await connectDB();
        console.log('Connected to MongoDB...');

        // Clear existing organizations
        await Organization.deleteMany({});
        console.log('Cleared existing organizations...');

        // Insert new organizations
        await Organization.insertMany(organizations);
        console.log('Organizations seeded successfully!');

    } catch (error) {
        console.error('Error seeding organizations:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedOrganizations(); 