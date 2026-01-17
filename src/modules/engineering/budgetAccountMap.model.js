const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const BudgetAccountMap = sequelize.define('budget_account_map', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  budgetId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  accountId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center for budget enforcement'
  },

  /* ================= BUDGET CONTROL ================= */

  limitAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false
  },

  consumedAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'budget_account_maps',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['budgetId', 'accountId', 'costCenterId']
    },
    {
      fields: ['budgetId']
    },
    {
      fields: ['accountId']
    },
    {
      fields: ['costCenterId']
    }
  ]
});

/* ================= BUSINESS ENFORCEMENT ================= */

BudgetAccountMap.beforeValidate((row) => {
  if (Number(row.consumedAmount) > Number(row.limitAmount)) {
    throw new Error('Consumed amount cannot exceed budget limit');
  }
});

module.exports = BudgetAccountMap;