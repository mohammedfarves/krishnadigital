import { Order, User, Product, Coupon } from '../models/index.js';
// import { sendOrderConfirmationEmail, sendOrderConfirmationSMS } from '../services/emailService.js';
import { sendOrderShippedSMS, sendOrderDeliveredSMS } from '../services/smsService.js';

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      userId,
      dateFrom,
      dateTo,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    if (status) where.orderStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (userId) where.userId = userId;
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Sequelize.Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Sequelize.Op.lte] = new Date(dateTo);
    }
    
    if (search) {
      where[Sequelize.Op.or] = [
        { orderNumber: { [Sequelize.Op.like]: `%${search}%` } },
        { trackingId: { [Sequelize.Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
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
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

/**
 * @desc    Get order details (admin)
 * @route   GET /api/admin/orders/:id
 * @access  Private (Admin)
 */
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone', 'email', 'slug']
        },
        {
          model: Coupon,
          as: 'coupon',
          attributes: ['id', 'code', 'discountType', 'discountValue']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Enrich order items with product details
    const enrichedItems = await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findByPk(item.productId, {
          attributes: ['id', 'name', 'slug', 'images', 'sku']
        });
        
        return {
          ...item,
          product: product || null
        };
      })
    );
    
    const enrichedOrder = {
      ...order.toJSON(),
      orderItems: enrichedItems
    };
    
    res.status(200).json({
      success: true,
      data: enrichedOrder
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order details'
    });
  }
};

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Valid status is required. Allowed: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findByPk(req.params.id, { transaction });
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const oldStatus = order.orderStatus;
    
    // Prevent invalid status transitions
    if (oldStatus === 'cancelled' && status !== 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of a cancelled order'
      });
    }
    
    if (oldStatus === 'delivered') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of a delivered order'
      });
    }
    
    // Update order
    const updateData = { orderStatus: status };
    
    // Generate tracking ID when shipping
    if (status === 'shipped' && !order.trackingId) {
      updateData.trackingId = `TRK${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }
    
    // Update payment status for COD orders when delivered
    if (status === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'pending') {
      updateData.paymentStatus = 'paid';
    }
    
    await order.update(updateData, { transaction });
    
    await transaction.commit();
    
    // Send notifications based on status change
    const user = await User.findByPk(order.userId);
    
    if (status === 'shipped' && user) {
      await sendOrderShippedSMS(user.phone, order.orderNumber, order.trackingId);
    } else if (status === 'delivered' && user) {
      await sendOrderDeliveredSMS(user.phone, order.orderNumber);
    }
    
    res.status(200).json({
      success: true,
      message: `Order status updated from "${oldStatus}" to "${status}"`,
      data: order
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

/**
 * @desc    Update payment status (admin)
 * @route   PUT /api/admin/orders/:id/payment
 * @access  Private (Admin)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Valid status is required. Allowed: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const oldStatus = order.paymentStatus;
    await order.update({ paymentStatus: status });
    
    res.status(200).json({
      success: true,
      message: `Payment status updated from "${oldStatus}" to "${status}"`,
      data: order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
};

/**
 * @desc    Get order statistics (admin)
 * @route   GET /api/admin/orders/stats
 * @access  Private (Admin)
 */
export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Get counts by status
    const statusCounts = await Order.findAll({
      attributes: [
        'orderStatus',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['orderStatus']
    });
    
    // Get payment status counts
    const paymentStatusCounts = await Order.findAll({
      attributes: [
        'paymentStatus',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['paymentStatus']
    });
    
    // Get revenue stats
    const totalRevenue = await Order.sum('finalAmount');
    const monthlyRevenue = await Order.sum('finalAmount', {
      where: {
        createdAt: { [Sequelize.Op.gte]: startOfMonth }
      }
    });
    const yearlyRevenue = await Order.sum('finalAmount', {
      where: {
        createdAt: { [Sequelize.Op.gte]: startOfYear }
      }
    });
    
    // Get recent 30 days revenue trend
    const revenueTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const revenue = await Order.sum('finalAmount', {
        where: {
          createdAt: {
            [Sequelize.Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      
      revenueTrend.push({
        date: date.toISOString().split('T')[0],
        revenue: revenue || 0
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        paymentStatusCounts,
        revenue: {
          total: totalRevenue || 0,
          monthly: monthlyRevenue || 0,
          yearly: yearlyRevenue || 0
        },
        revenueTrend,
        totalOrders: await Order.count()
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
};

/**
 * @desc    Search orders (admin)
 * @route   GET /api/admin/orders/search
 * @access  Private (Admin)
 */
export const searchOrders = async (req, res) => {
  try {
    const {
      query,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    if (status) where.orderStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Sequelize.Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Sequelize.Op.lte] = new Date(dateTo);
    }
    
    if (query) {
      where[Sequelize.Op.or] = [
        { orderNumber: { [Sequelize.Op.like]: `%${query}%` } },
        { trackingId: { [Sequelize.Op.like]: `%${query}%` } },
        { '$user.name$': { [Sequelize.Op.like]: `%${query}%` } },
        { '$user.phone$': { [Sequelize.Op.like]: `%${query}%` } },
        { '$user.email$': { [Sequelize.Op.like]: `%${query}%` } }
      ];
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone', 'email'],
          required: query ? true : false
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
    console.error('Search orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching orders'
    });
  }
};