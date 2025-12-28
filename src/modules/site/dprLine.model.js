const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DPRLine = sequelize.define('dpr_line', {
  dprId: DataTypes.INTEGER,
  activity: DataTypes.STRING,
  quantity: DataTypes.DECIMAL(12, 3),
  unit: DataTypes.STRING
});

module.exports = DPRLine;
