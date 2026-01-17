const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Supplier = sequelize.define('supplier', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  name: {
    type: DataTypes.STRING,
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

  gstNo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  pan: {
    type: DataTypes.STRING,
    allowNull: true
  },

  isGstRegistered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false
  },

  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false
  },

  state: {
    type: DataTypes.STRING,
    allowNull: false
  },

  pincode: {
    type: DataTypes.STRING,
    allowNull: false
  },

  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'India'
  },

  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false
  },

  paymentTermDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },

  creditLimit: {
    type: DataTypes.DECIMAL(14,2),
    allowNull: true
  },

  isBlacklisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  blacklistReason: {
    type: DataTypes.STRING,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Supplier;
