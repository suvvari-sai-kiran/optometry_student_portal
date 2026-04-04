const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, sendOtp, forgotPassword, resetPassword } = require('../controllers/authController');
const { registerValidation, loginValidation, validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/send-otp', authLimiter, sendOtp);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;

