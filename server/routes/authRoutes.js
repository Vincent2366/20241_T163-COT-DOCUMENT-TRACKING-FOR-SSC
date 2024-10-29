const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const apiIntegrationController = require("../controllers/apiIntegration");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

// Register a new user
router.post('/register', authController.registerUser);

// User login, returns a JWT for session management
router.post('/login', authController.loginUser);

// Verifies a 2FA code (OTP) 
router.post('/verify-2fa', authController.verify2FA);

// Refreshes the JWT when it’s about to expire
router.post('/refresh', authController.refreshToken);

// Logs the user out
router.post('/logout', verifyToken, authController.logoutUser);

// Retrieves the current user detail and role
router.get('/user', verifyToken, authController.getUserDetails);

router.post(
    "/calendar",
    authMiddleware.authenticate,          
    validationMiddleware.validateReminderData,  
    apiIntegrationController.scheduleReminder   
  );
  
router.get(
    "/tasks",
    authMiddleware.authenticate,             
    apiIntegrationController.getTasks          
  );
  
router.post(
    "/verify-captcha",
    validationMiddleware.validateCaptchaData,  
    apiIntegrationController.verifyCaptcha      
  );

module.exports = router;
