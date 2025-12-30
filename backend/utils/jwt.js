import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 */
export const generateToken = (user) => {
  const payload = {
    userId: user.id,
    phone: user.phone,
    slug: user.slug,
    role: user.role,
    isVerified: user.isVerified
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode token without verification
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    phone: user.phone,
    type: 'refresh'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * Set token cookie
 */
export const setTokenCookie = (res, token, tokenName = 'token') => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
  };

  res.cookie(tokenName, token, cookieOptions);
};

/**
 * Clear token cookie
 */
export const clearTokenCookie = (res, tokenName = 'token') => {
  res.clearCookie(tokenName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};