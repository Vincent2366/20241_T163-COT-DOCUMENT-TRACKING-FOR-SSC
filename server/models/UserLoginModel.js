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
        validate: {
            validator: function(email) {
                if (this.role === 'admin') return true;
                return email.endsWith('@student.buksu.edu.ph');
            },
            message: 'Please use a valid BukSU student email'
        }
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    password: {
        type: String,
        default: '',
        validate: {
            validator: function(password) {
                return !this.googleId || password.length >= 6 || password === '';
            },
            message: 'Password must be at least 6 characters long'
        }
    },
    organization: {
        type: String,
        required: function() {
            return this.role !== 'admin';
        }
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png'
    },
    profilePictureId: {
        type: String,
        default: null
    },
    driveFileLink: {
        type: String,
        default: null
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
    },
    localProfilePath: {
        type: String,
        default: null
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

userSchema.methods.updateProfilePicture = async function(driveFileId, driveFileLink) {
    this.profilePictureId = driveFileId;
    this.profilePicture = driveFileLink;
    this.driveFileLink = driveFileLink;
    await this.save();
    return this;
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
