const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MISSnapshot = sequelize.define('mis_snapshot', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Finance
  totalPurchase: DataTypes.FLOAT,
  totalExpense: DataTypes.FLOAT,
  totalRevenue: DataTypes.FLOAT,
  cashBalance: DataTypes.FLOAT,

  // Inventory
  stockValue: DataTypes.FLOAT,
  stockIn: DataTypes.FLOAT,
  stockOut: DataTypes.FLOAT,

  // Contracts
  raBilled: DataTypes.FLOAT,
  contractorOutstanding: DataTypes.FLOAT,

  // Progress
  dprCount: DataTypes.INTEGER,
  wprCount: DataTypes.INTEGER
}, {
  indexes: [
    { unique: true, fields: ['date', 'projectId'] },
    { fields: ['projectId'] },
    { fields: ['date'] }
  ]
});

module.exports = MISSnapshot;
