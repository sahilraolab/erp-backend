const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Estimate = sequelize.define('estimate', {
  projectId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  baseAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'FINAL'),
    defaultValue: 'DRAFT'
  }
});

module.exports = Estimate;
