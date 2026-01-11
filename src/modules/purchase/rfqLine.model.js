const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQLine = sequelize.define(
  'rfq_line',
  {
    rfqId: {
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

    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    requisitionLineId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    indexes: [
      { fields: ['rfqId'] },
      { fields: ['materialId'] }
    ]
  }
);

module.exports = RFQLine;
