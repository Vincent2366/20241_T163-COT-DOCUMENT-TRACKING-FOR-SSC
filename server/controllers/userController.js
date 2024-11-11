// userController.js
const User = require('../models/UsersModel'); // Import your User model

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
}

module.exports = UserController;