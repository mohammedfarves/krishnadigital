import express from 'express';
import { 
  getDashboardStats,
  sendBirthdayWishes,
  broadcastCoupon,
  getUserAnalytics,
  exportUsers,
  searchUsers,
  getUserDetails,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserOrdersAdmin,
  getUserReviewsAdmin,
  getUserCartAdmin
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { adminLimiter, exportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply admin authentication and rate limiting to all routes
router.use(authenticate, requireAdmin, adminLimiter);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.post('/send-birthday-wishes', sendBirthdayWishes);
router.post('/broadcast-coupon', broadcastCoupon);

// User management routes
router.get('/users/analytics', getUserAnalytics);
router.get('/users/export', exportLimiter, exportUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/users/:id/orders', getUserOrdersAdmin);
router.get('/users/:id/reviews', getUserReviewsAdmin);
router.get('/users/:id/cart', getUserCartAdmin);

export default router;