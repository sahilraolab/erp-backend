const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const VoucherLine = sequelize.define(
  'voucher_line',
  {
    voucherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    debit: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0,
    },

    credit: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0,
    },

    costCenterId: DataTypes.INTEGER,
    contractorId: DataTypes.INTEGER,
  },
  {
    tableName: 'voucher_lines',
    indexes: [
      { fields: ['voucherId'] },
      { fields: ['accountId'] },
      { fields: ['contractorId'] },
    ],
  }
);

module.exports = VoucherLine;
