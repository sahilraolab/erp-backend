const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Voucher = sequelize.define(
  'Voucher',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    voucherNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM('JV', 'PV', 'RV'),
      allowNull: false,
    },

    narration: {
      type: DataTypes.TEXT,
    },

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

    // ✅ indexes go ONLY here
    indexes: [
      { fields: ['voucherNo'] },
      { fields: ['companyId'] },
    ],
  }
);

module.exports = Voucher;
