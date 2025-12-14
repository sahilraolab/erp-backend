const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Interest = sequelize.define('interest', {
  accountId: DataTypes.INTEGER,
  rate: DataTypes.FLOAT,
  period: DataTypes.STRING
});

module.exports = Interest;
