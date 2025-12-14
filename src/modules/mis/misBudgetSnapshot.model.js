const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MISBudgetSnapshot = sequelize.define('mis_budget_snapshot', {
  date: DataTypes.DATEONLY,
  projectId: DataTypes.INTEGER,
  budgetHeadId: DataTypes.INTEGER,

  budgetAmount: DataTypes.FLOAT,
  actualAmount: DataTypes.FLOAT,
  variance: DataTypes.FLOAT
}, {
  indexes: [
    { fields: ['projectId'] },
    { fields: ['budgetHeadId'] },
    { fields: ['date'] }
  ]
});

module.exports = MISBudgetSnapshot;
