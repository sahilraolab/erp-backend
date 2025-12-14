const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Contractor = sequelize.define('contractor', {
  name: DataTypes.STRING,
  gstNo: DataTypes.STRING,
  contactPerson: DataTypes.STRING,
  phone: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Contractor;
