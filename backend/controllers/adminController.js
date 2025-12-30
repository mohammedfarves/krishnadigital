import { User, Order, Product, Review, Coupon, Category, Brand } from '../models/index.js';
import { checkBirthdaysAndSendWishes } from '../utils/birthdayWish.js';
import { format } from 'date-fns';
import { createObjectCsvStringifier } from 'csv-writer';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Get counts
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      newUsersThisMonth,
      newOrdersThisMonth
    ] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Order.sum('finalAmount'),
      Order.sum('finalAmount', {
        where: {
          createdAt: { [Sequelize.Op.gte]: startOfMonth }
        }
      }),
      Order.sum('finalAmount', {
        where: {
          createdAt: { [Sequelize.Op.gte]: startOfYear }
        }
      }),
      User.count({
        where: {
          createdAt: { [Sequelize.Op.gte]: startOfMonth }
        }
      }),
      Order.count({
        where: {
          createdAt: { [Sequelize.Op.gte]: startOfMonth }
        }
      })
    ]);
    
    // Get recent orders
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone']
        }
      ]
    });
    
    // Get popular products
    const popularProducts = await Product.findAll({
      where: { isActive: true },
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
      limit: 10,
      attributes: ['id', 'name', 'price', 'rating', 'totalReviews']
    });
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue || 0,
          monthlyRevenue: monthlyRevenue || 0,
          yearlyRevenue: yearlyRevenue || 0,
          newUsersThisMonth,
          newOrdersThisMonth
        },
        recentOrders,
        popularProducts
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

/**
 * @desc    Send birthday wishes manually
 * @route   POST /api/admin/send-birthday-wishes
 * @access  Private (Admin)
 */
export const sendBirthdayWishes = async (req, res) => {
  try {
    const result = await checkBirthdaysAndSendWishes();
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        count: result.count,
        users: result.users || []
      }
    });
  } catch (error) {
    console.error('Send birthday wishes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending birthday wishes'
    });
  }
};

/**
 * @desc    Broadcast coupon to all users
 * @route   POST /api/admin/broadcast-coupon
 * @access  Private (Admin)
 */
export const broadcastCoupon = async (req, res) => {
  try {
    const { couponData } = req.body;
    
    if (!couponData || !couponData.code || !couponData.discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Coupon data is required'
      });
    }
    
    // Create coupon
    const coupon = await Coupon.create({
      ...couponData,
      validFrom: couponData.validFrom || new Date(),
      validUntil: couponData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    });
    
    // Get all active users
    const users = await User.findAll({
      where: {
        role: 'customer',
        isActive: true,
        isVerified: true
      },
      attributes: ['id']
    });
    
    // Assign coupon to users (in batches for performance)
    const batchSize = 100;
    const batches = Math.ceil(users.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const batch = users.slice(i * batchSize, (i + 1) * batchSize);
      const userCoupons = batch.map(user => ({
        userId: user.id,
        couponId: coupon.id,
        isUsed: false
      }));
      
      await UserCoupon.bulkCreate(userCoupons, { ignoreDuplicates: true });
    }
    
    res.status(201).json({
      success: true,
      message: `Coupon broadcasted to ${users.length} users`,
      data: {
        coupon,
        usersCount: users.length
      }
    });
  } catch (error) {
    console.error('Broadcast coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while broadcasting coupon'
    });
  }
};

/**
 * @desc    Get user analytics
 * @route   GET /api/admin/users/analytics
 * @access  Private (Admin)
 */
export const getUserAnalytics = async (req, res) => {
  try {
    // Get user growth data (last 12 months)
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear()
      });
    }
    
    const userGrowth = await Promise.all(
      months.map(async ({ month, year }) => {
        const startDate = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 1);
        const endDate = new Date(year, startDate.getMonth() + 1, 0);
        
        const count = await User.count({
          where: {
            createdAt: {
              [Sequelize.Op.between]: [startDate, endDate]
            }
          }
        });
        
        return { month: `${month} ${year}`, count };
      })
    );
    
    // Get user distribution by role
    const roleDistribution = await User.findAll({
      attributes: [
        'role',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['role']
    });
    
    // Get user verification stats
    const verificationStats = await User.findAll({
      attributes: [
        'isVerified',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['isVerified']
    });
    
    // Get active vs inactive users
    const activeStats = await User.findAll({
      attributes: [
        'isActive',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['isActive']
    });
    
    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        roleDistribution,
        verificationStats,
        activeStats,
        totalUsers: await User.count()
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user analytics'
    });
  }
};

/**
 * @desc    Export user data as CSV
 * @route   GET /api/admin/users/export
 * @access  Private (Admin)
 */
export const exportUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 'customerCode', 'name', 'slug', 'phone', 'email',
        'role', 'dateOfBirth', 'isVerified', 'isActive',
        'giftReceived', 'createdAt'
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Format data for CSV
    const csvData = users.map(user => ({
      id: user.id,
      customerCode: user.customerCode || '',
      name: user.name,
      slug: user.slug,
      phone: user.phone,
      email: user.email || '',
      role: user.role,
      dateOfBirth: user.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '',
      isVerified: user.isVerified ? 'Yes' : 'No',
      isActive: user.isActive ? 'Active' : 'Inactive',
      giftReceived: user.giftReceived ? 'Yes' : 'No',
      memberSince: format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm:ss')
    }));
    
    // Create CSV stringifier
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'customerCode', title: 'Customer Code' },
        { id: 'name', title: 'Name' },
        { id: 'slug', title: 'Slug' },
        { id: 'phone', title: 'Phone' },
        { id: 'email', title: 'Email' },
        { id: 'role', title: 'Role' },
        { id: 'dateOfBirth', title: 'Date of Birth' },
        { id: 'isVerified', title: 'Verified' },
        { id: 'isActive', title: 'Status' },
        { id: 'giftReceived', title: 'Gift Received' },
        { id: 'memberSince', title: 'Member Since' }
      ]
    });
    
    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    
    res.status(200).send(csvString);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting users'
    });
  }
};

/**
 * @desc    Search users with filters
 * @route   GET /api/admin/users/search
 * @access  Private (Admin)
 */
export const searchUsers = async (req, res) => {
  try {
    const {
      search = '',
      role,
      isVerified,
      isActive,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    if (role) where.role = role;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    if (search) {
      where[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.like]: `%${search}%` } },
        { phone: { [Sequelize.Op.like]: `%${search}%` } },
        { email: { [Sequelize.Op.like]: `%${search}%` } },
        { slug: { [Sequelize.Op.like]: `%${search}%` } },
        { customerCode: { [Sequelize.Op.like]: `%${search}%` } }
      ];
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Sequelize.Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Sequelize.Op.lte] = new Date(dateTo);
    }
    
    // Validate sort field
    const allowedSortFields = ['id', 'name', 'phone', 'email', 'role', 'createdAt', 'updatedAt'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';
    
    const { count, rows: users } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[validSortBy, validSortOrder]],
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        },
        filters: {
          search,
          role,
          isVerified,
          isActive,
          dateFrom,
          dateTo
        }
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching users'
    });
  }
};

/**
 * @desc    Get user details (admin view - all data)
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'orderNumber', 'totalPrice', 'orderStatus', 'createdAt'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Product,
          as: 'products',
          where: { sellerId: req.params.id },
          required: false,
          attributes: ['id', 'name', 'price', 'stock', 'isActive'],
          limit: 10
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate additional stats
    const orderStats = await Order.findOne({
      where: { userId: user.id },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount'],
        [Sequelize.fn('SUM', Sequelize.col('finalAmount')), 'totalSpent'],
        [Sequelize.fn('AVG', Sequelize.col('finalAmount')), 'avgOrderValue']
      ],
      raw: true
    });
    
    const reviewStats = await Review.findOne({
      where: { userId: user.id },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'reviewCount']
      ],
      raw: true
    });
    
    const userData = user.toJSON();
    userData.stats = {
      orderCount: parseInt(orderStats?.orderCount || 0),
      totalSpent: parseFloat(orderStats?.totalSpent || 0),
      avgOrderValue: parseFloat(orderStats?.avgOrderValue || 0),
      averageRating: parseFloat(reviewStats?.averageRating || 0),
      reviewCount: parseInt(reviewStats?.reviewCount || 0)
    };
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user details'
    });
  }
};

/**
 * @desc    Update user (admin only)
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Don't allow changing own role or deactivating own account
    if (req.user.id === user.id && (req.body.role || req.body.isActive === false)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role or deactivate your own account'
      });
    }
    
    // Update user
    await user.update(req.body);
    
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};

/**
 * @desc    Toggle user active status
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Don't allow deactivating own account
    if (req.user.id === user.id && user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }
    
    // Toggle status
    await user.update({ isActive: !user.isActive });
    
    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user.id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling user status'
    });
  }
};

/**
 * @desc    Delete user (soft delete)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Don't allow deleting own account
    if (req.user.id === user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    // Soft delete (deactivate)
    await user.update({ isActive: false });
    
    // Optional: Archive user data
    // await user.destroy(); // For hard delete
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

/**
 * @desc    Get user's orders (admin view)
 * @route   GET /api/admin/users/:id/orders
 * @access  Private (Admin)
 */
export const getUserOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId: req.params.id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user orders admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user orders'
    });
  }
};

/**
 * @desc    Get user's reviews (admin view)
 * @route   GET /api/admin/users/:id/reviews
 * @access  Private (Admin)
 */
export const getUserReviewsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId: req.params.id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'images']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reviews'
    });
  }
};

/**
 * @desc    Get user's cart (admin view)
 * @route   GET /api/admin/users/:id/cart
 * @access  Private (Admin)
 */
export const getUserCartAdmin = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get user cart admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user cart'
    });
  }
};