const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Advance = sequelize.define('advance', {
  contractorId: DataTypes.INTEGER,
  amount: DataTypes.FLOAT,
  adjustedAmount: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = Advance;
