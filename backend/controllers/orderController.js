import { Order, Cart, Product, User, Coupon, UserCoupon } from '../models/index.js';
import { generateOrderNumber } from '../utils/helpers.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { sendOrderConfirmationSMS } from '../services/smsService.js';

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      couponCode
    } = req.body;
    
    // Validate shipping address
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    // Get user's cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      transaction
    });
    
    if (!cart || !cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Verify all items are available
    const orderItems = [];
    let totalPrice = 0;
    let shippingCost = 0;
    let taxAmount = 0;
    
    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      
      if (!product.availability || product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is out of stock or insufficient quantity`
        });
      }
      
      const price = product.discountPrice || product.price;
      const itemTotal = price * item.quantity;
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        price,
        quantity: item.quantity,
        total: itemTotal,
        image: product.images && product.images.length > 0 ? product.images[0].url : null,
        variant: product.variant
      });
      
      totalPrice += itemTotal;
      taxAmount += itemTotal * (product.tax || 0) / 100;
    }
    
    // Apply coupon if provided
    let discountAmount = 0;
    let couponId = null;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: {
          code: couponCode,
          isActive: true,
          validFrom: { [Sequelize.Op.lte]: new Date() },
          validUntil: { [Sequelize.Op.gte]: new Date() }
        },
        transaction
      });
      
      if (coupon) {
        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Coupon usage limit reached'
          });
        }
        
        // Check minimum order amount
        if (coupon.minOrderAmount && totalPrice < coupon.minOrderAmount) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Minimum order amount of ${coupon.minOrderAmount} required for this coupon`
          });
        }
        
        // Check if user has already used this coupon
        if (coupon.isSingleUse) {
          const userCoupon = await UserCoupon.findOne({
            where: {
              userId: req.user.id,
              couponId: coupon.id,
              isUsed: true
            },
            transaction
          });
          
          if (userCoupon) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: 'Coupon already used'
            });
          }
        }
        
        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (totalPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        
        discountAmount = discount;
        couponId = coupon.id;
        
        // Mark coupon as used
        await UserCoupon.create({
          userId: req.user.id,
          couponId: coupon.id,
          isUsed: true,
          usedAt: new Date(),
          orderId: null // Will be updated after order creation
        }, { transaction });
        
        // Increment coupon usage count
        await coupon.increment('usedCount', { transaction });
      }
    }
    
    // Calculate final amount
    const finalAmount = totalPrice + shippingCost + taxAmount - discountAmount;
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Create order
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
      totalPrice,
      shippingCost,
      taxAmount,
      discountAmount,
      finalAmount,
      notes,
      couponId
    }, { transaction });
    
    // Update coupon with order ID if used
    if (couponId) {
      await UserCoupon.update(
        { orderId: order.id },
        {
          where: {
            userId: req.user.id,
            couponId,
            orderId: null
          },
          transaction
        }
      );
    }
    
    // Update product stock
    for (const item of cart.items) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction
      });
      
      // Check if stock becomes zero
      const updatedProduct = await Product.findByPk(item.productId, { transaction });
      if (updatedProduct.stock === 0) {
        await updatedProduct.update({ availability: false }, { transaction });
      }
    }
    
    // Clear cart
    await cart.update({
      items: [],
      totalAmount: 0
    }, { transaction });
    
    await transaction.commit();
    
    // Send confirmation notifications
    const user = await User.findByPk(req.user.id);
    await sendOrderConfirmationEmail(user, order);
    await sendOrderConfirmationSMS(user.phone, order.orderNumber, order.finalAmount);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/orders
 * @access  Private (Customer)
 */
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { userId: req.user.id };
    if (status) where.orderStatus = status;
    
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
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private (Customer)
 */
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone', 'email']
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
          attributes: ['id', 'name', 'slug', 'images']
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
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (Customer)
 */
export const cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      transaction
    });
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.orderStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in "${order.orderStatus}" status`
      });
    }
    
    // Update order status
    await order.update({
      orderStatus: 'cancelled',
      paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'failed'
    }, { transaction });
    
    // Restore product stock
    for (const item of order.orderItems) {
      await Product.increment('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction
      });
      
      // Update product availability
      const product = await Product.findByPk(item.productId, { transaction });
      if (product.stock > 0 && !product.availability) {
        await product.update({ availability: true }, { transaction });
      }
    }
    
    // Refund coupon if used
    if (order.couponId) {
      await UserCoupon.update(
        { isUsed: false, usedAt: null, orderId: null },
        {
          where: {
            userId: req.user.id,
            couponId: order.couponId,
            orderId: order.id
          },
          transaction
        }
      );
      
      await Coupon.decrement('usedCount', {
        where: { id: order.couponId },
        transaction
      });
    }
    
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
};

/**
 * @desc    Track order by tracking ID
 * @route   GET /api/orders/track/:trackingId
 * @access  Public
 */
export const trackOrder = async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    const order = await Order.findOne({
      where: { trackingId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Return limited info for public tracking
    const trackingInfo = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      shippingAddress: order.shippingAddress,
      estimatedDelivery: order.estimatedDelivery,
      lastUpdated: order.updatedAt
    };
    
    res.status(200).json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking order'
    });
  }
};

/**
 * @desc    Get order by order number
 * @route   GET /api/orders/number/:orderNumber
 * @access  Private (Customer)
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await Order.findOne({
      where: {
        orderNumber,
        userId: req.user.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone', 'email']
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
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};