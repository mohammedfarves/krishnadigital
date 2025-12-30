import sequelize from '../config/database.js';
import User from './User.js';
import Otp from './Otp.js';
import Category from './Category.js';
import Brand from './Brand.js';
import Product from './Product.js';
import Cart from './Cart.js';
import Order from './Order.js';
import Review from './Review.js';
import Coupon from './Coupon.js';
import UserCoupon from './UserCoupon.js';

// Define associations

// User associations
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(UserCoupon, { foreignKey: 'userId', as: 'userCoupons' });
User.hasMany(Otp, { foreignKey: 'phone', sourceKey: 'phone', as: 'otps' });

// Product associations
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

// Review associations
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Coupon associations
Coupon.hasMany(Order, { foreignKey: 'couponId', as: 'orders' });
Coupon.hasMany(UserCoupon, { foreignKey: 'couponId', as: 'userCoupons' });

// UserCoupon associations
UserCoupon.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserCoupon.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });
UserCoupon.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Category associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
// Add self-referencing association for parent categories
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// Brand associations
Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });

// OTP associations
Otp.belongsTo(User, { foreignKey: 'phone', targetKey: 'phone', as: 'user' });

// Export all models individually
export {
  sequelize,
  User,
  Otp,
  Category,
  Brand,
  Product,
  Cart,
  Order,
  Review,
  Coupon,
  UserCoupon
};