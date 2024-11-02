const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\d{10}@student\.buksu\.edu\.ph$/, 'Please enter a valid BukSU student number email (e.g., 2001xxxxx@student.buksu.edu.ph)']
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png'
    },
    role: {
        type: String,
        enum: ['officer', 'admin'],
        default: 'officer'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending'
    }
});

// Hash the password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
