const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Stock = sequelize.define('stock', {
  materialId: DataTypes.INTEGER,
  location: DataTypes.STRING, // Store / Site
  quantity: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = Stock;
