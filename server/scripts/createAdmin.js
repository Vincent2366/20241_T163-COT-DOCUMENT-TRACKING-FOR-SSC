const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/UserLoginModel');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@buksu.edu.ph' });
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        console.log('Creating admin account...');
        
        const adminUser = new User({
            username: 'admin',
            email: 'admin@buksu.edu.ph',
            password: 'admin123', // The password will be hashed by the pre-save middleware
            organization: 'SBO COT',
            role: 'admin',
            status: 'active'
        });

        await adminUser.save();
        console.log('Admin account created successfully');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('Database connection closed');
        }
        process.exit(0);
    }
};

async function resetAdminPassword() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await User.findOneAndUpdate(
            { email: 'admin@buksu.edu.ph' },
            { 
                $set: { 
                    password: hashedPassword,
                    status: 'active',
                    role: 'admin'
                }
            },
            { upsert: true, new: true }
        );
        
        console.log('Admin password reset successfully');
    } catch (error) {
        console.error('Error resetting admin password:', error);
    }
}

createAdmin();
resetAdminPassword();
