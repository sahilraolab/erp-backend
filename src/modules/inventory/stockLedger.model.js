const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockLedger = sequelize.define('stock_ledger', {

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

  /* ================= REFERENCE ================= */

  refType: {
    type: DataTypes.ENUM(
      'OPENING',
      'GRN',
      'ISSUE',
      'ISSUE_CANCEL',
      'TRANSFER_IN',
      'TRANSFER_OUT',
      'RETURN',
      'ADJUSTMENT'
    ),
    allowNull: false
  },

  refId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= QUANTITY ================= */

  qtyIn: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false,
    defaultValue: 0
  },

  qtyOut: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false,
    defaultValue: 0
  },

  balanceQty: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false
  },

  /* ================= VALUATION ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false,
    comment: 'Valuation rate (FIFO / WAC)'
  },

  valueIn: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  valueOut: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  balanceValue: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false
  },

  /* ================= TIMING ================= */

  txnAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  }

}, {
  tableName: 'stock_ledger',
  timestamps: false, // ledger uses txnAt, not createdAt
  paranoid: false,
  indexes: [
    {
      fields: ['companyId', 'materialId']
    },
    {
      fields: ['projectId', 'locationId', 'materialId']
    },
    {
      fields: ['refType', 'refId']
    },
    {
      fields: ['txnAt']
    },
    {
      unique: true,
      fields: ['refType', 'refId', 'materialId']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

StockLedger.beforeUpdate(() => {
  throw new Error('Stock ledger entries are immutable');
});

StockLedger.beforeDestroy(() => {
  throw new Error('Stock ledger entries cannot be deleted');
});

module.exports = StockLedger;