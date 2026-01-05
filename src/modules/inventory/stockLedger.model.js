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

    refType: {
      type: DataTypes.ENUM(
        'GRN',
        'ISSUE',
        'ISSUE_CANCEL',
        'TRANSFER'
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
    }
  },
  {
    indexes: [
      { fields: ['materialId'] },
      { fields: ['projectId', 'locationId'] },
      { fields: ['refType', 'refId'] }
    ]
  }
);

module.exports = StockLedger;
