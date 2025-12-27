const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const generateCode = require('../../core/codeGenerator');

const Company = sequelize.define('company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
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

  // Structured address (professional & report-friendly)
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

  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Company.beforeValidate(async (company) => {
  if (!company.code) {
    company.code = await generateCode('CMP', 'companies');
  }
});

module.exports = Company;
