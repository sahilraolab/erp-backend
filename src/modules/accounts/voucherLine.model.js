// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('VoucherLine', {
//   debit: DataTypes.DECIMAL,
//   credit: DataTypes.DECIMAL,
// });

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const VoucherLine = sequelize.define(
  "voucher_line",
  {
    voucherId: DataTypes.INTEGER,
    accountId: DataTypes.INTEGER,
    debit: { type: DataTypes.FLOAT, defaultValue: 0 },
    credit: { type: DataTypes.FLOAT, defaultValue: 0 },
    costCenterId: DataTypes.INTEGER,
  },
  {
    indexes: [{ fields: ["voucherId"] }, { fields: ["accountId"] }],
  }
);

module.exports = VoucherLine;
