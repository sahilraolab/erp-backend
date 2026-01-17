const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockTransfer = sequelize.define('stock_transfer', {

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

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center owning the stock'
  },

  /* ================= LOCATIONS ================= */

  fromLocationId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  toLocationId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  transferNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Stock transfer number (company scoped)'
  },

  transferDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'CANCELLED'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'stock_transfers',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'transferNo']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['fromLocationId']
    },
    {
      fields: ['toLocationId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ================= */

StockTransfer.beforeUpdate((transfer) => {
  if (transfer.locked) {
    throw new Error('Approved stock transfer cannot be modified');
  }
});

module.exports = StockTransfer;