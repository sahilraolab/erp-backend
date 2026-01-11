const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteTransferLine = sequelize.define(
  'site_transfer_line',
  {
    transferId: {
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

    requestedQty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    },

    approvedQty: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    }
  },
  {
    indexes: [
      { fields: ['transferId'] },
      { fields: ['materialId'] }
    ]
  }
);

module.exports = SiteTransferLine;
