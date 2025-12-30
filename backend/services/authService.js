import { User, Otp, Coupon, UserCoupon } from '../models/index.js';
import { generateToken, setTokenCookie } from '../utils/jwt.js';
import { generateSlug } from '../utils/slugGenerator.js';
import { createOTP, verifyOTP } from './otpService.js';
import { validateRegistration, validateLogin } from '../utils/validators.js';

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  try {
    // Validate user data
    const validation = validateRegistration(userData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        phone: userData.phone
      }
    });

    if (existingUser) {
      return {
        success: false,
        message: 'User with this phone number already exists'
      };
    }

    // Check if email exists (if provided)
    if (userData.email) {
      const existingEmail = await User.findOne({
        where: {
          email: userData.email
        }
      });

      if (existingEmail) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }
    }

    // Generate unique slug
    const allSlugs = await User.findAll({
      attributes: ['slug'],
      raw: true
    }).then(users => users.map(user => user.slug));

    const slug = generateSlug(userData.name, allSlugs);

    // Create user (not verified yet)
    const user = await User.create({
      name: userData.name,
      phone: userData.phone,
      email: userData.email || null,
      password: userData.password,
      role: 'customer',
      slug,
      isVerified: false
    });

    // Generate OTP for verification
    const otpResult = await createOTP(userData.phone, 'register');

    return {
      success: true,
      message: 'Registration successful. OTP sent for verification.',
      userId: user.id,
      phone: user.phone,
      slug: user.slug,
      otp: process.env.NODE_ENV === 'development' ? otpResult.otp : undefined
    };
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return {
        success: false,
        message: `${field} already exists`
      };
    }

    throw error;
  }
};

/**
 * Complete registration by verifying OTP
 */
export const completeRegistration = async (phone, otp) => {
  try {
    // Verify OTP
    const otpResult = await verifyOTP(phone, otp, 'register');
    
    if (!otpResult.success) {
      return otpResult;
    }

    // Find user
    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Mark user as verified
    await user.update({ isVerified: true });

    // Generate welcome gift coupon for first-time registration
    if (!user.giftReceived) {
      await createWelcomeGiftCoupon(user.id);
      await user.update({ giftReceived: true });
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
      success: true,
      message: 'Registration completed successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        slug: user.slug,
        role: user.role,
        isVerified: user.isVerified
      }
    };
  } catch (error) {
    console.error('Error completing registration:', error);
    throw error;
  }
};

/**
 * Create welcome gift coupon for new user
 */
const createWelcomeGiftCoupon = async (userId) => {
  try {
    const coupon = await Coupon.create({
      code: `WELCOME${Date.now().toString().slice(-6)}`,
      description: 'Welcome to our store! Enjoy this special discount on your first purchase.',
      discountType: 'percentage',
      discountValue: 10, // 10% discount
      minOrderAmount: 0,
      maxDiscount: 500,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
      usageLimit: 1,
      isSingleUse: true,
      isActive: true
    });

    // Assign coupon to user
    await UserCoupon.create({
      userId,
      couponId: coupon.id,
      isUsed: false
    });

    return coupon;
  } catch (error) {
    console.error('Error creating welcome gift coupon:', error);
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (loginData) => {
  try {
    // Validate login data
    const validation = validateLogin(loginData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Find user
    const user = await User.findOne({
      where: { phone: loginData.phone }
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid phone number or password'
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact support.'
      };
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid phone number or password'
      };
    }

    // Generate OTP for login verification
    const otpResult = await createOTP(loginData.phone, 'login');

    return {
      success: true,
      message: 'OTP sent for login verification',
      userId: user.id,
      phone: user.phone,
      otp: process.env.NODE_ENV === 'development' ? otpResult.otp : undefined
    };
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};

/**
 * Complete login by verifying OTP
 */
export const completeLogin = async (phone, otp) => {
  try {
    // Verify OTP
    const otpResult = await verifyOTP(phone, otp, 'login');
    
    if (!otpResult.success) {
      return otpResult;
    }

    // Find user
    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact support.'
      };
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        slug: user.slug,
        role: user.role,
        isVerified: user.isVerified
      }
    };
  } catch (error) {
    console.error('Error completing login:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = (res) => {
  clearTokenCookie(res);
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Don't allow role change via profile update
    if (updateData.role) {
      delete updateData.role;
    }

    // Don't allow phone change via profile update
    if (updateData.phone) {
      delete updateData.phone;
    }

    // Update user
    await user.update(updateData);

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        slug: user.slug,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return {
        success: false,
        message: `${field} already exists`
      };
    }

    throw error;
  }
};

/**
 * Complete user profile (add DOB and address)
 */
export const completeUserProfile = async (userId, profileData) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const updateData = {};
    
    if (profileData.dateOfBirth) {
      updateData.dateOfBirth = profileData.dateOfBirth;
    }

    if (profileData.address) {
      updateData.address = profileData.address;
    }

    // Update user
    await user.update(updateData);

    return {
      success: true,
      message: 'Profile completed successfully',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        isVerified: user.isVerified
      }
    };
  } catch (error) {
    console.error('Error completing user profile:', error);
    throw error;
  }
};