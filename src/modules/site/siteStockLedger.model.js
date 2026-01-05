const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteStockLedger = sequelize.define(
  'site_stock_ledger',
  {
    siteId: DataTypes.INTEGER,
    materialId: DataTypes.INTEGER,
    refType: {
      type: DataTypes.ENUM('SITE_GRN', 'SITE_TRANSFER', 'ISSUE'),
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
      { fields: ['siteId', 'materialId'] },
      { fields: ['refType', 'refId'] }
    ]
  }
);

module.exports = SiteStockLedger;
