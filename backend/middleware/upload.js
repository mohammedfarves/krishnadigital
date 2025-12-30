import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

/**
 * Configure Cloudinary storage for multer
 */
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalname = file.originalname.split('.')[0];
      return `product_${timestamp}_${originalname}`;
    }
  }
});

/**
 * File filter for image uploads
 */
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

/**
 * Multer upload instance
 */
export const upload = multer({
  storage: cloudinaryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

/**
 * Single image upload middleware
 */
export const uploadSingleImage = (fieldName = 'image') => {
  return upload.single(fieldName);
};

/**
 * Multiple images upload middleware
 */
export const uploadMultipleImages = (fieldName = 'images', maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Handle upload errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload.'
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error.'
    });
  }
  next();
};

/**
 * Process uploaded files
 */
export const processUploadedFiles = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    req.uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));
  } else if (req.file) {
    req.uploadedFiles = [{
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }];
  }
  next();
};

/**
 * Validate images for product
 */
export const validateProductImages = (req, res, next) => {
  if (!req.body.images && !req.uploadedFiles) {
    return res.status(400).json({
      success: false,
      message: 'At least one image is required for the product.'
    });
  }
  next();
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
};