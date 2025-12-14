const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const EstimateVersion = sequelize.define('estimate_version', {
  estimateId: DataTypes.INTEGER,
  versionNo: DataTypes.INTEGER,
  amount: DataTypes.FLOAT
});

module.exports = EstimateVersion;
