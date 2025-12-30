import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  variant: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(250),
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  tax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isValidImages(value) {
        if (value && Array.isArray(value)) {
          value.forEach(img => {
            if (!img.url || typeof img.url !== 'string') {
              throw new Error('Image URL is required');
            }
          });
        }
      }
    }
  },
  attributes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metaTitle: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  keywords: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'products',
  hooks: {
    beforeValidate: (product) => {
      // Calculate discount percentage if discount price is provided
      if (product.discountPrice && product.price) {
        const discount = ((product.price - product.discountPrice) / product.price) * 100;
        product.discountPercentage = parseFloat(discount.toFixed(2));
      }
      
      // Set availability based on stock
      if (product.stock !== undefined) {
        product.availability = product.stock > 0;
      }
    }
  }
});

export default Product;