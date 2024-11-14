const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/UsersModel');

const pendingUsers = [
    {
        username: 'officer1',
        email: 'officer1@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Technologies - Student Body Organization',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer2',
        email: 'officer2@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Education - Student Body Organization',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer3',
        email: 'officer3@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Arts and Sciences- Student Body Organization',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer4',
        email: 'officer4@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Technologies - Student Body Organization',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer5',
        email: 'officer5@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Education - Student Body Organization',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer6',
        email: 'officer6@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Arts and Sciences- Student Body Organization',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer7',
        email: 'officer7@student.buksu.edu.ph',
        password: 'password123',
        organization: 'Supreme Student Council',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer8',
        email: 'officer8@student.buksu.edu.ph',
        password: 'password123',
        organization: 'Collegianer - The Official Student Publication',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer9',
        email: 'officer9@student.buksu.edu.ph',
        password: 'password123',
        organization: 'Matigda - The Official Yearbook Publication',
        role: 'officer',
        status: 'pending'
    },
    {
        username: 'officer10',
        email: 'officer10@student.buksu.edu.ph',
        password: 'password123',
        organization: 'College of Nursing -Student Body Organization',
        role: 'officer',
        status: 'pending'
    }
];

const seedPendingUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        
        console.log('Seeding pending users...');
        
        for (const userData of pendingUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`Created pending user: ${userData.username}`);
            } else {
                console.log(`User ${userData.username} already exists, skipping...`);
            }
        }

        console.log('Seeding completed successfully');

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

seedPendingUsers(); 