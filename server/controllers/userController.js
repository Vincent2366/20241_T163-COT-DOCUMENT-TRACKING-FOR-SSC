// userController.js
const User = require('../models/UserLoginModel');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const GoogleDriveService = require('../services/googleDriveService');
const driveService = new GoogleDriveService();

class UserController {
  // Create a new user
  static async createUser(req, res) {
    try {
      const { username, email } = req.body; // Destructure the request body

      // Check for duplicate username
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Duplicate username' });
      }

      const newUser = new User({ username, email });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
        const users = await User.find(); 
        res.status(200).json(users); 
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
}

  // Get a single user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error });
    }
  }

  // Update a user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  // Delete a user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send(); // No content
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
  static async getPendingUsers (req, res) {
    try {
      const pendingUsers = await User.find({ status: 'pending' });
      res.json(pendingUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      res.status(500).json({ message: 'Error fetching pending users' });
    }
  }
  static async approveUser (req, res){
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: 'active' },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error approving user:', error);
      res.status(500).json({ message: 'Error approving user' });
    }
  }
  static async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const profilePicture = user.profilePicture 
        ? `${baseUrl}${user.profilePicture}`
        : null;

      res.json({
        username: user.username,
        email: user.email,
        organization: user.organization,
        role: user.role,
        status: user.status,
        profilePicture: profilePicture
      });
    } catch (error) {
      console.error('Error retrieving profile:', error);
      res.status(500).json({ message: 'Error retrieving user profile' });
    }
  }
  static async updateProfile(req, res) {
    try {
      const { username, email, organization, role, password } = req.body;
      const userId = req.user.id;

      // Validate the input
      if (!username || !email || !organization) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }

      // Check if username or email already exists (excluding current user)
      const existingUser = await User.findOne({
        $or: [
          { username: username },
          { email: email }
        ],
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.username === username 
            ? 'Username already taken' 
            : 'Email already registered' 
        });
      }

      // Create update object without password
      const updateData = {
        username,
        email,
        organization,
        role
      };

      // If password is provided, handle it separately
      if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { 
          new: true,
          runValidators: true 
        }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          username: user.username,
          email: user.email,
          organization: user.organization,
          role: user.role,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ 
        message: error.name === 'ValidationError' 
          ? error.message 
          : 'Error updating profile'
      });
    }
  }

  static async uploadProfilePicture(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads/profiles');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Save file locally
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const localFilePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(localFilePath, req.file.buffer);

      // Upload to Google Drive
      const driveResponse = await driveService.uploadFile(req.file);

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete old profile picture if exists
      if (user.profilePictureId && user.localProfilePath) {
        try {
          await driveService.deleteFile(user.profilePictureId);
          const oldLocalPath = path.join(uploadsDir, user.localProfilePath);
          if (fs.existsSync(oldLocalPath)) {
            fs.unlinkSync(oldLocalPath);
          }
        } catch (error) {
          console.error('Error deleting old profile picture:', error);
        }
      }

      // Update user profile
      user.profilePictureId = driveResponse.id;
      user.profilePicture = `/uploads/profiles/${fileName}`;
      user.driveFileLink = driveResponse.directLink;
      user.localProfilePath = fileName;
      await user.save();

      res.json({
        success: true,
        user: {
          ...user.toObject(),
          profilePicture: `/uploads/profiles/${fileName}`
        },
        message: 'Profile picture updated successfully'
      });

    } catch (error) {
      console.error('Error in upload:', error);
      res.status(500).json({ message: 'Error uploading profile picture' });
    }
  }
}
  
module.exports = UserController;