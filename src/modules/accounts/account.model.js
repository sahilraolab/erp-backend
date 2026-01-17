const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Account = sequelize.define('account', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= STRUCTURE ================= */

  code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Account code (company scoped)'
  },

  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(
      'ASSET',
      'LIABILITY',
      'INCOME',
      'EXPENSE',
      'EQUITY'
    ),
    allowNull: false
  },

  parentId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Parent account for hierarchy'
  },

  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Derived hierarchy level'
  },

  /* ================= BEHAVIOR ================= */

  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Group account cannot be posted to'
  },

  requiresSubLedger: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Supplier / Partner / Customer sub-ledger required'
  },

  /* ================= OPENING ================= */

  openingBalance: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  openingBalanceType: {
    type: DataTypes.ENUM('DR', 'CR'),
    allowNull: false
  },

  /* ================= STATUS ================= */

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'accounts',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'code']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['type']
    }
  ]
});

/* ================= ACCOUNTING RULE ENFORCEMENT ================= */

Account.beforeValidate((account) => {
  if (
    (account.type === 'ASSET' || account.type === 'EXPENSE') &&
    account.openingBalanceType !== 'DR'
  ) {
    throw new Error('Assets and Expenses must have DR opening balance');
  }

  if (
    (account.type === 'LIABILITY' ||
      account.type === 'INCOME' ||
      account.type === 'EQUITY') &&
    account.openingBalanceType !== 'CR'
  ) {
    throw new Error('Liabilities, Income, and Equity must have CR opening balance');
  }
});

module.exports = Account;