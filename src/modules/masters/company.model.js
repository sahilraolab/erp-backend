const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Company = sequelize.define('company', {
  name: DataTypes.STRING,
  code: {
    type: DataTypes.STRING,
    unique: true
  },
  gstin: DataTypes.STRING,
  pan: DataTypes.STRING,
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  }
});

module.exports = Company;
