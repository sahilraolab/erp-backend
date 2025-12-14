const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MISSnapshot = sequelize.define('mis_snapshot', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  role: DataTypes.STRING, // ADMIN, PM, STORE, ACCOUNTS

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
    { fields: ['date'] },
    { fields: ['projectId'] },
    { fields: ['role'] }
  ]
});

module.exports = MISSnapshot;
