const express = require('express');

const UserController = require('../controllers/userController'); // Adjust path to your UserController

const router = express.Router();
// User registration route
router.post('/register', UserController.createUser);
router.get('/all', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.get('/all/pending', UserController.getPendingUsers)
router.put('/approve/:id', UserController.approveUser)

module.exports = router;
