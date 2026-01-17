const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseBill = sequelize.define('purchase_bill', {

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

  /* ================= ENGINEERING / PROCUREMENT LOCKS ================= */

  budgetId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  estimateId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  purchaseOrderId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  grnId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'One bill per GRN'
  },

  supplierId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  billNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Supplier bill number (company scoped)'
  },

  /* ================= DOCUMENT ================= */

  attachmentPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Supplier invoice / bill document'
  },

  billDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  /* ================= AMOUNT SNAPSHOT ================= */

  basicAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  taxAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  totalAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'POSTED',
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

  /* ================= APPROVAL / POSTING ================= */

  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  approvedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
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
  tableName: 'purchase_bills',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'billNo']
    },
    {
      unique: true,
      fields: ['grnId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['supplierId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

PurchaseBill.beforeUpdate((bill) => {
  if (bill.locked) {
    throw new Error('Approved or posted purchase bill cannot be modified');
  }
});

module.exports = PurchaseBill;