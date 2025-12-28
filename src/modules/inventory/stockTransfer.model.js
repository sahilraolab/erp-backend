const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockTransfer = sequelize.define(
  'stock_transfer',
  {
    transferNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    fromLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    toLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    approvedBy: {
      type: DataTypes.INTEGER
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'CANCELLED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['fromLocationId'] },
      { fields: ['toLocationId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = StockTransfer;
