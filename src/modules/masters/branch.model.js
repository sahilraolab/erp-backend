const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Company = require('./company.model');

const Branch = sequelize.define('branch', {
  name: DataTypes.STRING,
  code: DataTypes.STRING
});

Branch.belongsTo(Company);

module.exports = Branch;
