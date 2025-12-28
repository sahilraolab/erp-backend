const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Advance = sequelize.define('advance', {
  contractorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  workOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  amount: {
    type: DataTypes.DECIMAL(14,2),
    allowNull: false
  },

  adjustedAmount: {
    type: DataTypes.DECIMAL(14,2),
    defaultValue: 0
  },

  balanceAmount: {
    type: DataTypes.DECIMAL(14,2)
  }
});

Advance.beforeSave(a => {
  a.balanceAmount = Number(a.amount) - Number(a.adjustedAmount);
});

module.exports = Advance;
