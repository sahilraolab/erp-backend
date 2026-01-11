const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Voucher = sequelize.define(
  'voucher',
  {
    voucherNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM('JV', 'PV', 'RV'),
      allowNull: false
    },

    narration: {
      type: DataTypes.TEXT
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'POSTED'),
      defaultValue: 'DRAFT'
    },

    sourceType: {
      type: DataTypes.STRING,
      allowNull: false
    },

    sourceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'vouchers',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['companyId', 'voucherNo'] },
      { fields: ['companyId'] },
      { fields: ['date'] },
      { fields: ['status'] },
      { fields: ['sourceType', 'sourceId'] }
    ]
  }
);

module.exports = Voucher;
