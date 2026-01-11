const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const GRNLine = sequelize.define(
  'grn_line',
  {
    grnId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    poLineId: {
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

    orderedQty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    receivedQty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    acceptedQty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    rejectedQty: {
      type: DataTypes.DECIMAL(12, 3),
      defaultValue: 0
    }
  },
  {
    indexes: [
      { fields: ['grnId'] },
      { fields: ['poLineId'] },
      { fields: ['materialId'] }
    ]
  }
);

module.exports = GRNLine;
