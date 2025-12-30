/**
 * Generate a random string of specified length
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency}${parseFloat(amount).toFixed(2)}`;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate order number
 */
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD${timestamp}${random}`;
};

/**
 * Generate tracking ID
 */
export const generateTrackingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TRK${timestamp}${random}`;
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Sanitize user data for public view
 */
export const sanitizeUserForPublic = (user) => {
  if (!user) return null;
  
  const { id, slug, name, role, isVerified, createdAt, updatedAt } = user;
  
  return {
    id,
    slug,
    name,
    role,
    isVerified,
    memberSince: createdAt
  };
};

/**
 * Paginate array of data
 */
export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = array.slice(startIndex, endIndex);
  
  return {
    data: results,
    currentPage: page,
    totalPages: Math.ceil(array.length / limit),
    totalItems: array.length,
    hasNextPage: endIndex < array.length,
    hasPrevPage: startIndex > 0
  };
};