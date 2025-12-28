const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WPR = sequelize.define('wpr', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  weekStart: DataTypes.DATEONLY,
  weekEnd: DataTypes.DATEONLY,
  summary: DataTypes.TEXT
});

module.exports = WPR;
