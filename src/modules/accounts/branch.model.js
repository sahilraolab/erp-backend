const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Branch = sequelize.define('branch', {
  name: DataTypes.STRING,
  code: DataTypes.STRING
});

module.exports = Branch;
