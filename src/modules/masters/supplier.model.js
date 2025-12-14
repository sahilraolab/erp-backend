const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Supplier = sequelize.define('supplier', {
  name: DataTypes.STRING,
  gstNo: DataTypes.STRING,
  contactPerson: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Supplier;
