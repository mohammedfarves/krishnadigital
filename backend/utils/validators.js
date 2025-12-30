import { isValidPhone, isValidEmail } from './helpers.js';
import { isValidSlug } from './slugGenerator.js';

/**
 * Validate registration data
 */
export const validateRegistration = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Valid email address is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate login data
 */
export const validateLogin = (data) => {
  const errors = {};

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate OTP data
 */
export const validateOTP = (data) => {
  const errors = {};

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  if (!data.otp || !/^\d{6}$/.test(data.otp)) {
    errors.otp = 'Valid 6-digit OTP is required';
  }

  if (!data.purpose || !['register', 'login', 'reset'].includes(data.purpose)) {
    errors.purpose = 'Valid purpose is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate product data
 */
export const validateProduct = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters long';
  }

  if (!data.brandId || isNaN(data.brandId)) {
    errors.brandId = 'Valid brand ID is required';
  }

  if (!data.categoryId || isNaN(data.categoryId)) {
    errors.categoryId = 'Valid category ID is required';
  }

  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.price = 'Valid price is required';
  }

  if (data.discountPrice && (isNaN(data.discountPrice) || data.discountPrice < 0)) {
    errors.discountPrice = 'Discount price must be a valid number';
  }

  if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
    errors.stock = 'Stock must be a valid non-negative number';
  }

  if (!data.sku || data.sku.trim().length < 3) {
    errors.sku = 'Valid SKU is required';
  }

  if (!data.sellerId || isNaN(data.sellerId)) {
    errors.sellerId = 'Valid seller ID is required';
  }

  // Validate slug if provided
  if (data.slug && !isValidSlug(data.slug)) {
    errors.slug = 'Invalid slug format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate cart item data
 */
export const validateCartItem = (data) => {
  const errors = {};

  if (!data.productId || isNaN(data.productId)) {
    errors.productId = 'Valid product ID is required';
  }

  if (!data.quantity || isNaN(data.quantity) || data.quantity < 1) {
    errors.quantity = 'Valid quantity (minimum 1) is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate order data
 */
export const validateOrder = (data) => {
  const errors = {};

  if (!data.shippingAddress || typeof data.shippingAddress !== 'object') {
    errors.shippingAddress = 'Valid shipping address is required';
  } else {
    const { street, city, state, zipCode, country } = data.shippingAddress;
    if (!street || !city || !state || !zipCode || !country) {
      errors.shippingAddress = 'Complete shipping address is required';
    }
  }

  if (!data.orderItems || !Array.isArray(data.orderItems) || data.orderItems.length === 0) {
    errors.orderItems = 'At least one order item is required';
  }

  if (data.paymentMethod && !['cod', 'card', 'upi'].includes(data.paymentMethod)) {
    errors.paymentMethod = 'Valid payment method is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate review data
 */
export const validateReview = (data) => {
  const errors = {};

  if (!data.productId || isNaN(data.productId)) {
    errors.productId = 'Valid product ID is required';
  }

  if (!data.rating || isNaN(data.rating) || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Valid rating (1-5) is required';
  }

  if (data.comment && data.comment.length > 1000) {
    errors.comment = 'Comment must not exceed 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate coupon data
 */
export const validateCoupon = (data) => {
  const errors = {};

  if (!data.code || data.code.trim().length < 3) {
    errors.code = 'Coupon code must be at least 3 characters long';
  }

  if (!data.discountType || !['percentage', 'fixed'].includes(data.discountType)) {
    errors.discountType = 'Valid discount type is required';
  }

  if (!data.discountValue || isNaN(data.discountValue) || data.discountValue <= 0) {
    errors.discountValue = 'Valid discount value is required';
  }

  if (data.discountType === 'percentage' && data.discountValue > 100) {
    errors.discountValue = 'Percentage discount cannot exceed 100%';
  }

  if (!data.validFrom || !data.validUntil) {
    errors.dates = 'Valid from and valid until dates are required';
  } else if (new Date(data.validUntil) <= new Date(data.validFrom)) {
    errors.dates = 'Valid until must be after valid from';
  }

  if (data.usageLimit && (isNaN(data.usageLimit) || data.usageLimit < 1)) {
    errors.usageLimit = 'Usage limit must be a positive number';
  }

  if (data.minOrderAmount && (isNaN(data.minOrderAmount) || data.minOrderAmount < 0)) {
    errors.minOrderAmount = 'Minimum order amount must be a valid number';
  }

  if (data.maxDiscount && (isNaN(data.maxDiscount) || data.maxDiscount < 0)) {
    errors.maxDiscount = 'Maximum discount must be a valid number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate user update data
 */
export const validateUserUpdate = (data) => {
  const errors = {};

  if (data.name && data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Valid email address is required';
  }

  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
  }

  if (data.address && typeof data.address === 'object') {
    const { street, city, state, zipCode, country } = data.address;
    if (street && !city) errors.address = 'City is required when street is provided';
    if (city && !state) errors.address = 'State is required when city is provided';
    if (state && !country) errors.address = 'Country is required when state is provided';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize input data
 */
export const sanitizeInput = (data) => {
  if (typeof data !== 'object' || data === null) return data;

  const sanitized = { ...data };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key]
        .trim()
        .replace(/[<>]/g, '') // Remove HTML tags
        .substring(0, 1000); // Limit length
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
  }

  return sanitized;
};