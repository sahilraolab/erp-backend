const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Account = require('../accounts/account.model');

const BudgetAccountMap = sequelize.define('budget_account_map', {
  budgetHeadId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

BudgetAccountMap.belongsTo(Account);

module.exports = BudgetAccountMap;
