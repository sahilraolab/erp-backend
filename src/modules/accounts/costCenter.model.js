// src/modules/accounts/costCenter.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CostCenter = sequelize.define('cost_center', {
  name: DataTypes.STRING,
  code: { type: DataTypes.STRING, unique: true }
});

module.exports = CostCenter;
