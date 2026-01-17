const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Material = sequelize.define('material', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Owning company'
  },

  /* ================= BUSINESS ID ================= */

  code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Material code (company scoped)'
  },

  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  subCategory: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  /* ================= TYPE & CONTROL ================= */

  materialType: {
    type: DataTypes.ENUM('STOCK', 'NON_STOCK', 'SERVICE'),
    allowNull: false
  },

  requiresQc: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  /* ================= UOM ================= */

  baseUomId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  secondaryUomId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  conversionFactor: {
    type: DataTypes.DECIMAL(12,6),
    allowNull: true,
    comment: 'Secondary to base UOM conversion'
  },

  /* ================= INVENTORY & VALUATION ================= */

  valuationMethod: {
    type: DataTypes.ENUM('FIFO', 'WEIGHTED_AVG'),
    allowNull: true,
    comment: 'Applicable only for STOCK materials'
  },

  isConsumable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  isReturnable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  /* ================= TAX ================= */

  hsnCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  defaultTaxGroupId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /* ================= STATUS ================= */

  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'materials',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'code']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['materialType']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Material;