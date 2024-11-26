const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const UserController = require('../controllers/userController');
const multer = require('multer');



const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Put specific routes before parameterized routes
router.post('/register', UserController.createUser);
router.get('/all', UserController.getAllUsers);
router.get('/all/pending', UserController.getPendingUsers);
router.get('/profile', authenticateToken, UserController.getUserProfile);
router.put('/update-profile', authenticateToken, UserController.updateProfile);
router.post('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), UserController.uploadProfilePicture);


// Parameterized routes should come last
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.put('/approve/:id', UserController.approveUser);

module.exports = router;
