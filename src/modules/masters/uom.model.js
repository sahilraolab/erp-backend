const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UOM = sequelize.define('uom', {
  name: DataTypes.STRING,
  symbol: DataTypes.STRING
});

module.exports = UOM;
