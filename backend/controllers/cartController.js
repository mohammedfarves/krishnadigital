import { Cart, Product, User } from '../models/index.js';
import { validateCartItem } from '../utils/validators.js';

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private (Customer)
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      const newCart = await Cart.create({
        userId: req.user.id,
        items: [],
        totalAmount: 0
      });
      
      return res.status(200).json({
        success: true,
        data: newCart
      });
    }
    
    // Enrich cart items with product details
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findByPk(item.productId, {
          attributes: ['id', 'name', 'slug', 'price', 'discountPrice', 'images', 'availability', 'stock']
        });
        
        return {
          ...item,
          product: product || null,
          totalPrice: (product?.discountPrice || product?.price || 0) * (item.quantity || 1)
        };
      })
    );
    
    const totalAmount = enrichedItems.reduce((total, item) => {
      return total + (item.totalPrice || 0);
    }, 0);
    
    const enrichedCart = {
      ...cart.toJSON(),
      items: enrichedItems,
      totalAmount
    };
    
    res.status(200).json({
      success: true,
      data: enrichedCart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private (Customer)
 */
export const addToCart = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { productId, quantity } = req.body;
    
    // Validate cart item
    const validation = validateCartItem({ productId, quantity });
    if (!validation.isValid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }
    
    // Check if product exists and is available
    const product = await Product.findByPk(productId, { transaction });
    
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.availability || product.stock < 1) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }
    
    // Get or create cart
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      transaction
    });
    
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
        totalAmount: 0
      }, { transaction });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId == productId);
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + parseInt(quantity);
      
      // Check stock availability
      if (newQuantity > product.stock) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.discountPrice || product.price;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
        price: product.discountPrice || product.price,
        addedAt: new Date()
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const itemProduct = item.productId === productId 
        ? product 
        : await Product.findByPk(item.productId, { transaction });
      
      if (itemProduct) {
        totalAmount += (itemProduct.discountPrice || itemProduct.price) * item.quantity;
      }
    }
    
    // Update cart
    await cart.update({
      items: cart.items,
      totalAmount
    }, { transaction });
    
    await transaction.commit();
    
    // Get updated cart with product details
    const updatedCart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart'
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:productId
 * @access  Private (Customer)
 */
export const updateCartItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || isNaN(quantity) || quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Valid quantity (minimum 1) is required'
      });
    }
    
    // Check if product exists
    const product = await Product.findByPk(productId, { transaction });
    
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check stock availability
    if (quantity > product.stock) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }
    
    // Get cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      transaction
    });
    
    if (!cart) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    
    if (itemIndex === -1) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // Update item quantity
    cart.items[itemIndex].quantity = parseInt(quantity);
    cart.items[itemIndex].price = product.discountPrice || product.price;
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const itemProduct = item.productId == productId 
        ? product 
        : await Product.findByPk(item.productId, { transaction });
      
      if (itemProduct) {
        totalAmount += (itemProduct.discountPrice || itemProduct.price) * item.quantity;
      }
    }
    
    // Update cart
    await cart.update({
      items: cart.items,
      totalAmount
    }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart item'
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:productId
 * @access  Private (Customer)
 */
export const removeFromCart = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { productId } = req.params;
    
    // Get cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      transaction
    });
    
    if (!cart) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    
    if (itemIndex === -1) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // Remove item
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (product) {
        totalAmount += (product.discountPrice || product.price) * item.quantity;
      }
    }
    
    // Update cart
    await cart.update({
      items: cart.items,
      totalAmount
    }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart'
    });
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private (Customer)
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id }
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.update({
      items: [],
      totalAmount: 0
    });
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};

/**
 * @desc    Get cart item count
 * @route   GET /api/cart/count
 * @access  Private (Customer)
 */
export const getCartItemCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id }
    });
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { count: 0 }
      });
    }
    
    const itemCount = cart.items.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
    
    res.status(200).json({
      success: true,
      data: {
        count: itemCount,
        uniqueItems: cart.items.length
      }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart count'
    });
  }
};