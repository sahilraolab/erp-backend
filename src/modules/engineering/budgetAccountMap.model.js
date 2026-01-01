const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Account = require('../accounts/account.model');
const Budget = require('./budget.model');

const BudgetAccountMap = sequelize.define(
  'budget_account_map',
  {
    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    limitAmount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    consumedAmount: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0
    }
  },
  {
    indexes: [
      { unique: true, fields: ['budgetId', 'accountId'] }
    ]
  }
);

Budget.hasMany(BudgetAccountMap, { foreignKey: 'budgetId' });
BudgetAccountMap.belongsTo(Budget, { foreignKey: 'budgetId' });

BudgetAccountMap.belongsTo(Account, { foreignKey: 'accountId' });

module.exports = BudgetAccountMap;
