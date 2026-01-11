const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockLedger = sequelize.define(
  'stock_ledger',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    uomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    refType: {
      type: DataTypes.ENUM(
        'OPENING',
        'GRN',
        'ISSUE',
        'ISSUE_CANCEL',
        'TRANSFER_IN',
        'TRANSFER_OUT',
        'ADJUSTMENT'
      ),
      allowNull: false
    },

    refId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    qtyIn: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    },

    qtyOut: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    },

    balanceQty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    },

    txnAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    indexes: [
      { fields: ['materialId'] },
      { fields: ['projectId', 'locationId'] },
      { fields: ['refType', 'refId'] },
      { fields: ['txnAt'] }
    ]
  }
);

module.exports = StockLedger;
