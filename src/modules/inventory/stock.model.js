const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Stock = sequelize.define(
  'stock',
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

    quantity: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    }
  },
  {
    indexes: [
      { unique: true, fields: ['projectId', 'locationId', 'materialId'] }
    ]
  }
);

module.exports = Stock;
