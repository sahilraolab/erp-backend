const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteStockLedger = sequelize.define(
  'site_stock_ledger',
  {
    siteId: {
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
        'SITE_GRN',
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
      { fields: ['siteId', 'materialId'] },
      { fields: ['refType', 'refId'] },
      { fields: ['txnAt'] }
    ]
  }
);

module.exports = SiteStockLedger;
