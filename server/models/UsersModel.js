const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png',
    },
    role: {
        type: String,
        enum: ['officer', 'admin'],
        default: 'officer',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Users', userSchema); 