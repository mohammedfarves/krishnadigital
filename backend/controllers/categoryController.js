import { Category, Product } from '../models/index.js';
import { generateSlug } from '../utils/slugGenerator.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'slug', 'price', 'images'],
          limit: 10
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get subcategories
    const subcategories = await Category.findAll({
      where: { parentId: category.id, isActive: true },
      attributes: ['id', 'name', 'slug']
    });
    
    const categoryData = {
      ...category.toJSON(),
      subcategories
    };
    
    res.status(200).json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentId, attributesSchema } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    // Generate unique slug
    const existingSlugs = await Category.findAll({
      attributes: ['slug'],
      raw: true
    }).then(categories => categories.map(c => c.slug));
    
    const slug = generateSlug(name, existingSlugs);
    
    // Check if parent exists
    if (parentId) {
      const parent = await Category.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }
    
    // Create category
    const category = await Category.create({
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      attributesSchema: attributesSchema ? JSON.parse(attributesSchema) : null,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Category name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if trying to set self as parent
    if (req.body.parentId && req.body.parentId == category.id) {
      return res.status(400).json({
        success: false,
        message: 'Category cannot be its own parent'
      });
    }
    
    // Check if parent exists
    if (req.body.parentId) {
      const parent = await Category.findByPk(req.body.parentId);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }
    
    // Parse JSON fields
    const updateData = { ...req.body };
    if (updateData.attributesSchema) {
      updateData.attributesSchema = JSON.parse(updateData.attributesSchema);
    }
    
    // Update category
    await category.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Category name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.count({
      where: { categoryId: category.id }
    });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }
    
    // Check if category has subcategories
    const subcategoryCount = await Category.count({
      where: { parentId: category.id }
    });
    
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing subcategories'
      });
    }
    
    // Soft delete or hard delete
    if (req.query.hardDelete === 'true') {
      await category.destroy();
    } else {
      await category.update({ isActive: false });
    }
    
    res.status(200).json({
      success: true,
      message: `Category ${req.query.hardDelete === 'true' ? 'deleted' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
};