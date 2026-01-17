const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Stock = sequelize.define('stock', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  locationId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= ITEM ================= */

  materialId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  uomId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= SNAPSHOT ================= */

  quantity: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false,
    defaultValue: 0
  }

}, {
  tableName: 'stock',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: [
        'companyId',
        'projectId',
        'locationId',
        'costCenterId',
        'materialId',
        'uomId'
      ]
    }
  ]
});

/* ================= SAFETY GUARD ================= */

/**
 * Stock table must never be updated directly.
 * It is derived exclusively from Stock Ledger.
 */
Stock.beforeUpdate(() => {
  throw new Error('Stock snapshot cannot be updated directly');
});

Stock.beforeDestroy(() => {
  throw new Error('Stock snapshot cannot be deleted');
});

module.exports = Stock;