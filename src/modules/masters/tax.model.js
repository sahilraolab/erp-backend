const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Tax = sequelize.define('tax', {
  name: DataTypes.STRING,
  percentage: DataTypes.FLOAT,
  type: DataTypes.STRING
});

module.exports = Tax;
