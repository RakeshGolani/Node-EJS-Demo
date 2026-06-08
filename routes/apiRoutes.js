const express = require('express');
const authController = require('../controller/api/customer/authController');
const customerController = require('../controller/api/customer/customerController');
const commonController = require('../controller/api/commonController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../utils/multer');

const router = express.Router();

// Initiate the app with the necessary data
router.get('/init/:type/:app_version', upload.none(), commonController.initGet);
router.post('/send-otp', upload.none(), commonController.sendOtp);

// Auth Routes
router.post('/register', upload.none(), authController.register);
router.post('/login', upload.none(), authController.login);

router.get('/logout', verifyToken, authController.logout);

// Customer Routes
router.get('/me', verifyToken, customerController.me);
router.put('/profile', verifyToken, upload.fields([{ name: 'profile_image', maxCount: 1 }]), customerController.updateProfile);
router.post('/change-password', verifyToken, upload.none(), customerController.changePassword);

module.exports = router;