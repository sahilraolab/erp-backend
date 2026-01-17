const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Company = sequelize.define('company', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  legalName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  gstNo: {
    type: DataTypes.STRING,
    unique: true
  },

  pan: {
    type: DataTypes.STRING
  },

  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false
  },

  addressLine2: DataTypes.STRING,

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

  baseCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR'
  },

  financialYearStart: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  hasBranches: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  status: {
    type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'CLOSED'),
    defaultValue: 'ACTIVE'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'companies',
  indexes: [
    { unique: true, fields: ['code'] },
    { unique: true, fields: ['gstNo'] }
  ]
});

module.exports = Company;
