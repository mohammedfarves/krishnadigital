import { Product, Category, Brand, Review, User } from '../models/index.js';
import { generateProductSlug } from '../utils/slugGenerator.js';
import { deleteImages } from '../middleware/upload.js';

/**
 * @desc    Get all products with filters
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      availability,
      isFeatured
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = { isActive: true };
    
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (availability !== undefined) where.availability = availability === 'true';
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Sequelize.Op.lte] = parseFloat(maxPrice);
    }
    
    if (search) {
      where[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.like]: `%${search}%` } },
        { description: { [Sequelize.Op.like]: `%${search}%` } },
        { sku: { [Sequelize.Op.like]: `%${search}%` } }
      ];
    }
    
    // Validate sort field
    const allowedSortFields = [
      'name', 'price', 'rating', 'createdAt', 'updatedAt',
      'discountPercentage', 'stock'
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) 
      ? sortOrder.toLowerCase() 
      : 'desc';
    
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[validSortBy, validSortOrder]],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        },
        filters: {
          categoryId,
          brandId,
          minPrice,
          maxPrice,
          search,
          availability,
          isFeatured
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:identifier
 * @access  Public
 */
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const where = isNaN(identifier) 
      ? { slug: identifier, isActive: true }
      : { id: parseInt(identifier), isActive: true };
    
    const product = await Product.findOne({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'attributesSchema']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'slug']
            }
          ],
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment view count or similar analytics
    // await product.increment('views');
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:categorySlug
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const category = await Category.findOne({
      where: { slug: categorySlug, isActive: true }
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        categoryId: category.id,
        isActive: true
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products by category'
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Admin/Seller)
 */
export const createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      variant,
      description,
      brandId,
      categoryId,
      price,
      discountPrice,
      tax,
      stock,
      sku,
      colors,
      attributes,
      isFeatured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;
    
    // Get brand and category for slug generation
    const brand = await Brand.findByPk(brandId, { transaction });
    const category = await Category.findByPk(categoryId, { transaction });
    
    if (!brand || !category) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Brand or category not found'
      });
    }
    
    // Generate unique slug
    const existingSlugs = await Product.findAll({
      attributes: ['slug'],
      raw: true,
      transaction
    }).then(products => products.map(p => p.slug));
    
    const baseSlug = generateProductSlug(name, brand.name, variant);
    let slug = baseSlug;
    let counter = 1;
    
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Process images
    let images = [];
    if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
    } else if (req.uploadedFiles) {
      images = req.uploadedFiles.map((file, index) => ({
        url: file.url,
        publicId: file.publicId,
        isPrimary: index === 0,
        color: colors && colors.length > 0 ? colors[0] : null
      }));
    }
    
    // Create product
    const product = await Product.create({
      name,
      variant: variant || null,
      slug,
      description,
      brandId,
      categoryId,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      tax: tax ? parseFloat(tax) : 0,
      stock: parseInt(stock) || 0,
      sku: sku || `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      colors: colors ? JSON.parse(colors) : [],
      images,
      attributes: attributes ? JSON.parse(attributes) : {},
      sellerId: req.user.id,
      isFeatured: isFeatured === 'true',
      metaTitle,
      metaDescription,
      keywords: keywords ? JSON.parse(keywords) : []
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create product error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Admin/Seller)
 */
export const updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const product = await Product.findByPk(req.params.id, { transaction });
    
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership (admin or seller)
    if (req.user.role !== 'admin' && product.sellerId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle images update
    if (req.uploadedFiles && req.uploadedFiles.length > 0) {
      const newImages = req.uploadedFiles.map((file, index) => ({
        url: file.url,
        publicId: file.publicId,
        isPrimary: index === 0,
        color: updateData.colors ? JSON.parse(updateData.colors)[0] : null
      }));
      
      // Delete old images from Cloudinary if needed
      if (updateData.replaceImages === 'true' && product.images && product.images.length > 0) {
        const oldPublicIds = product.images
          .filter(img => img.publicId)
          .map(img => img.publicId);
        
        if (oldPublicIds.length > 0) {
          await deleteImages(oldPublicIds);
        }
        
        updateData.images = newImages;
      } else {
        // Merge old and new images
        const oldImages = product.images || [];
        updateData.images = [...oldImages, ...newImages];
      }
      
      delete updateData.replaceImages;
    }
    
    // Parse JSON fields
    if (updateData.colors) {
      updateData.colors = JSON.parse(updateData.colors);
    }
    
    if (updateData.attributes) {
      updateData.attributes = JSON.parse(updateData.attributes);
    }
    
    if (updateData.keywords) {
      updateData.keywords = JSON.parse(updateData.keywords);
    }
    
    // Update product
    await product.update(updateData, { transaction });
    
    await transaction.commit();
    
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update product error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin/Seller)
 */
export const deleteProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const product = await Product.findByPk(req.params.id, { transaction });
    
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership (admin or seller)
    if (req.user.role !== 'admin' && product.sellerId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const publicIds = product.images
        .filter(img => img.publicId)
        .map(img => img.publicId);
      
      if (publicIds.length > 0) {
        await deleteImages(publicIds);
      }
    }
    
    // Soft delete or hard delete
    if (req.query.hardDelete === 'true') {
      await product.destroy({ transaction });
    } else {
      await product.update({ isActive: false }, { transaction });
    }
    
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: `Product ${req.query.hardDelete === 'true' ? 'deleted' : 'deactivated'} successfully`
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        isFeatured: true,
        isActive: true,
        availability: true
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
};

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const relatedProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        brandId: product.brandId,
        id: { [Sequelize.Op.ne]: product.id },
        isActive: true,
        availability: true
      },
      limit: 10,
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching related products'
    });
  }
};

/**
 * @desc    Update product stock
 * @route   PUT /api/products/:id/stock
 * @access  Private (Admin/Seller)
 */
export const updateProductStock = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership (admin or seller)
    if (req.user.role !== 'admin' && product.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    const { stock, operation = 'set' } = req.body;
    
    if (stock === undefined || isNaN(stock)) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock value is required'
      });
    }
    
    let newStock;
    switch (operation) {
      case 'increment':
        newStock = product.stock + parseInt(stock);
        break;
      case 'decrement':
        newStock = product.stock - parseInt(stock);
        if (newStock < 0) newStock = 0;
        break;
      case 'set':
      default:
        newStock = parseInt(stock);
        break;
    }
    
    await product.update({ stock: newStock });
    
    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        id: product.id,
        name: product.name,
        oldStock: product.stock,
        newStock,
        operation
      }
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product stock'
    });
  }
};