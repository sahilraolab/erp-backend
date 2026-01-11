const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Account = sequelize.define(
  'account',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    code: {
      type: DataTypes.STRING,
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
      type: DataTypes.INTEGER,
      allowNull: true
    },

    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    openingBalance: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0
    },

    openingBalanceType: {
      type: DataTypes.ENUM('DR', 'CR'),
      allowNull: false,
      defaultValue: 'DR'
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    indexes: [
      { unique: true, fields: ['companyId', 'code'] },
      { fields: ['companyId'] },
      { fields: ['parentId'] },
      { fields: ['type'] }
    ]
  }
);

module.exports = Account;
