import express from 'express';
import { 
  register, 
  verifyOTP, 
  login, 
  verifyLogin, 
  resendOTPController,
  logout,
  getMe,
  updateMe,
  completeProfile 
} from '../controllers/authController.js';
import { 
  validateRegistrationData, 
  validateLoginData, 
  validateOTPData 
} from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateRegistrationData, register);
router.post('/verify-otp', authLimiter, validateOTPData, verifyOTP);
router.post('/login', authLimiter, validateLoginData, login);
router.post('/verify-login', authLimiter, validateOTPData, verifyLogin);
router.post('/resend-otp', otpLimiter, validateOTPData, resendOTPController);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.post('/complete-profile', authenticate, completeProfile);

export default router;