const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Material = sequelize.define('material', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  subCategory: {
    type: DataTypes.STRING,
    allowNull: true
  },

  materialType: {
    type: DataTypes.ENUM('STOCK', 'NON_STOCK', 'SERVICE'),
    allowNull: false
  },

  baseUomId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  secondaryUomId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  conversionFactor: {
    type: DataTypes.DECIMAL(12,6),
    allowNull: true
  },

  valuationMethod: {
    type: DataTypes.ENUM('FIFO', 'WEIGHTED_AVG'),
    allowNull: false
  },

  hsnCode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  defaultTaxGroupId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  requiresQc: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isConsumable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  isReturnable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Material;
