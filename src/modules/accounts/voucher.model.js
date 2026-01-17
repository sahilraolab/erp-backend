const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Voucher = sequelize.define('voucher', {

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
    allowNull: true
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /* ================= BUSINESS ID ================= */

  voucherNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Voucher number (company scoped)'
  },

  voucherDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  financialYear: {
    type: DataTypes.STRING(9),
    allowNull: false,
    comment: 'e.g. 2025-26'
  },

  /* ================= TYPE ================= */

  voucherType: {
    type: DataTypes.ENUM(
      'OPENING',
      'PURCHASE',
      'PAYMENT',
      'RECEIPT',
      'JOURNAL',
      'INVENTORY'
    ),
    allowNull: false
  },

  narration: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  /* ================= SOURCE ================= */

  sourceType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'PURCHASE_BILL, ISSUE, ADJUSTMENT, etc.'
  },

  sourceId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM('DRAFT', 'POSTED'),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  postedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  postedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
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
  tableName: 'vouchers',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'voucherNo']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['voucherDate']
    },
    {
      fields: ['voucherType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['sourceType', 'sourceId']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

Voucher.beforeUpdate((voucher) => {
  if (voucher.status === 'POSTED') {
    throw new Error('Posted voucher cannot be modified');
  }
});

module.exports = Voucher;