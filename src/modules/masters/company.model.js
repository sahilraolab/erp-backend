const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Company = sequelize.define('company', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Business-readable company code'
  },

  /* ================= LEGAL IDENTITY ================= */

  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Common company name'
  },

  legalName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Registered legal name'
  },

  pan: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'PAN of company'
  },

  gstNo: {
    type: DataTypes.STRING(15),
    allowNull: true,
    comment: 'GST number (can be null for unregistered companies)'
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

  /* ================= FINANCIAL CONFIG ================= */

  baseCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'INR',
    comment: 'ISO currency code'
  },

  financialYearStart: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  hasBranches: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  ownershipType: {
    type: DataTypes.ENUM('SOLE', 'PARTNERSHIP', 'PRIVATE_LTD', 'LLP', 'OTHER'),
    allowNull: false,
    defaultValue: 'PRIVATE_LTD',
    comment: 'Used for partner/investor logic'
  },

  /* ================= STATUS ================= */

  status: {
    type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'CLOSED'),
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
  tableName: 'companies',
  timestamps: true,
  paranoid: false,
  indexes: [
    { unique: true, fields: ['code'] },
    { fields: ['status'] }
  ]
});

module.exports = Company;