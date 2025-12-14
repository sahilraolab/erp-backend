const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteStock = sequelize.define('site_stock', {
  siteId: DataTypes.INTEGER,
  materialId: DataTypes.INTEGER,
  quantity: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = SiteStock;
