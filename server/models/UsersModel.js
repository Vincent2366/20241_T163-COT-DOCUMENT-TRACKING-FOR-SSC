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
        default: 'officer',
    },
    documentHistory:{
        type: Array
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending',
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.updateProfilePicture = async function(driveFileId, driveFileLink) {
    this.profilePictureId = driveFileId;
    this.profilePicture = driveFileLink;
    this.driveFileLink = driveFileLink;
    return this.save();
};

module.exports = mongoose.model('Users', userSchema); 