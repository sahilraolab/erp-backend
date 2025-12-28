const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Account = sequelize.define('account', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },

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

  parentId: DataTypes.INTEGER,

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Account;
