const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Voucher = sequelize.define(
  'voucher',
  {
    voucherNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM('JV', 'PV', 'RV'),
      allowNull: false,
    },

    narration: DataTypes.TEXT,

    posted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'vouchers',
    timestamps: true,
    indexes: [
      { fields: ['voucherNo'] },
      { fields: ['companyId'] },
      { fields: ['date'] },
      { fields: ['posted'] },
    ],
  }
);

module.exports = Voucher;
