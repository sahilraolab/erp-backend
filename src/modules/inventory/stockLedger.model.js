const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockLedger = sequelize.define(
  'stock_ledger',
  {
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refType: {
      type: DataTypes.STRING, // GRN / ISSUE / TRANSFER
      allowNull: false
    },
    refId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qtyIn: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    qtyOut: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    balanceQty: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    indexes: [
      { fields: ['materialId'] },
      { fields: ['refType', 'refId'] },
      { fields: ['createdAt'] }
    ]
  }
);

module.exports = StockLedger;
