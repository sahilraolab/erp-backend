const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UOM = sequelize.define('uom', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= BUSINESS ID ================= */

  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'UOM code (KG, MT, NOS, SQM, HRS, etc.)'
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Readable unit name'
  },

  /* ================= CLASSIFICATION ================= */

  category: {
    type: DataTypes.ENUM(
      'WEIGHT',
      'LENGTH',
      'AREA',
      'VOLUME',
      'COUNT',
      'TIME'
    ),
    allowNull: false
  },

  isBase: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Base unit for this category'
  },

  /**
   * Conversion factor TO BASE UNIT
   * Base unit must ALWAYS have factor = 1
   */
  conversionFactor: {
    type: DataTypes.DECIMAL(14,6),
    allowNull: false,
    defaultValue: 1
  },

  decimalAllowed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'uoms',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    }
  ],

  hooks: {
    beforeValidate: (uom) => {
      if (uom.isBase && Number(uom.conversionFactor) !== 1) {
        throw new Error('Base UOM must have conversionFactor = 1');
      }
    }
  }
});

module.exports = UOM;