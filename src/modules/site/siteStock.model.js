const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteStock = sequelize.define(
  'site_stock',
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

    quantity: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['siteId', 'materialId', 'uomId']
      }
    ]
  }
);

module.exports = SiteStock;
