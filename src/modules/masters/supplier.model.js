const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Supplier = sequelize.define('supplier', {

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
    comment: 'Supplier code (company scoped)'
  },

  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  supplierType: {
    type: DataTypes.ENUM(
      'MATERIAL',
      'SERVICE',
      'LABOUR',
      'TRANSPORT',
      'MIXED'
    ),
    allowNull: false
  },

  /* ================= TAX ================= */

  gstNo: {
    type: DataTypes.STRING(15),
    allowNull: true
  },

  pan: {
    type: DataTypes.STRING(10),
    allowNull: true
  },

  isGstRegistered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  /* ================= ADDRESS ================= */

  addressLine1: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  addressLine2: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  pincode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },

  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'India'
  },

  /* ================= CONTACT ================= */

  contactPerson: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  /* ================= COMMERCIAL ================= */

  paymentTermDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },

  creditLimit: {
    type: DataTypes.DECIMAL(14,2),
    allowNull: true
  },

  /* ================= CONTROL ================= */

  status: {
    type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'BLACKLISTED'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },

  blacklistReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  /* ================= ACCOUNTING HOOKS ================= */

  controlAccountId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Supplier control account'
  },

  advanceAccountId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Advance paid account'
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
  tableName: 'suppliers',
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
      fields: ['supplierType']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Supplier;