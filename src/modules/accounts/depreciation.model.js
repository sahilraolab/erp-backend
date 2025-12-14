const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Depreciation = sequelize.define('depreciation', {
  assetAccountId: DataTypes.INTEGER,
  rate: DataTypes.FLOAT,
  method: DataTypes.STRING
});

module.exports = Depreciation;
