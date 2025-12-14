const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Department = sequelize.define('department', {
  name: DataTypes.STRING,
  code: DataTypes.STRING
});

module.exports = Department;
