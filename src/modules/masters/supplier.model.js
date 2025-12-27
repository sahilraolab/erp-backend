const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const generateCode = require('../../core/codeGenerator');

const Supplier = sequelize.define('supplier', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Primary contact number'
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },

  gstin: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'GST Identification Number'
  },

  pan: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Permanent Account Number'
  },

  // Structured address (same pattern as Company)
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: true
  },

  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true
  },

  city: {
    type: DataTypes.STRING,
    allowNull: true
  },

  state: {
    type: DataTypes.STRING,
    allowNull: true
  },

  pincode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  country: {
    type: DataTypes.STRING,
    defaultValue: 'India'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Supplier.beforeValidate(async (supplier) => {
  if (!supplier.code) {
    supplier.code = await generateCode('SUP', 'suppliers');
  }
});

module.exports = Supplier;
