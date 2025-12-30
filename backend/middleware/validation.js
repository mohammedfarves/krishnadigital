import { sanitizeInput, validateRegistration, validateLogin, validateOTP, validateProduct, validateCartItem, validateOrder, validateReview, validateCoupon, validateUserUpdate } from '../utils/validators.js';

/**
 * Generic validation middleware
 */
export const validate = (validator) => {
  return (req, res, next) => {
    // Sanitize input first
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);

    const validation = validator(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    next();
  };
};

/**
 * Route-specific validators
 */
export const validateRegistrationData = validate(validateRegistration);
export const validateLoginData = validate(validateLogin);
export const validateOTPData = validate(validateOTP);
export const validateProductData = validate(validateProduct);
export const validateCartItemData = validate(validateCartItem);
export const validateOrderData = validate(validateOrder);
export const validateReviewData = validate(validateReview);
export const validateCouponData = validate(validateCoupon);
export const validateUserUpdateData = validate(validateUserUpdate);

/**
 * Validate query parameters
 */
export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters'
    });
  }
  
  req.pagination = { page, limit };
  next();
};

/**
 * Validate sort parameters
 */
export const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    
    if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed: ${allowedFields.join(', ')}`
      });
    }
    
    if (!['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Sort order must be "asc" or "desc"'
      });
    }
    
    req.sort = { sortBy, sortOrder: sortOrder.toLowerCase() };
    next();
  };
};

/**
 * Validate filter parameters
 */
export const validateFilters = (allowedFilters = {}) => {
  return (req, res, next) => {
    const filters = {};
    const errors = [];
    
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        const filterKey = key.substring(7, key.length - 1);
        
        if (allowedFilters[filterKey]) {
          const value = req.query[key];
          const validator = allowedFilters[filterKey];
          
          if (validator(value)) {
            filters[filterKey] = value;
          } else {
            errors.push(`Invalid value for filter ${filterKey}`);
          }
        } else {
          errors.push(`Filter ${filterKey} is not allowed`);
        }
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filters',
        errors
      });
    }
    
    req.filters = filters;
    next();
  };
};

/**
 * Validate search query
 */
export const validateSearch = (req, res, next) => {
  const search = req.query.search || '';
  
  if (search && search.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Search query too long (max 100 characters)'
    });
  }
  
  req.search = search.trim();
  next();
};

/**
 * Validate date range
 */
export const validateDateRange = (req, res, next) => {
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;
  
  if (dateFrom && isNaN(Date.parse(dateFrom))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid dateFrom format (use YYYY-MM-DD)'
    });
  }
  
  if (dateTo && isNaN(Date.parse(dateTo))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid dateTo format (use YYYY-MM-DD)'
    });
  }
  
  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    return res.status(400).json({
      success: false,
      message: 'dateFrom must be before dateTo'
    });
  }
  
  req.dateRange = {
    from: dateFrom ? new Date(dateFrom) : null,
    to: dateTo ? new Date(dateTo) : null
  };
  
  next();
};