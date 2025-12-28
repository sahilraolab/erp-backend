const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockTransferLine = sequelize.define(
  'stock_transfer_line',
  {
    transferId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    transferQty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    }
  },
  {
    indexes: [
      { fields: ['transferId'] },
      { fields: ['materialId'] }
    ]
  }
);

module.exports = StockTransferLine;
