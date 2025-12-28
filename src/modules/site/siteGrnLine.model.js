const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteGRNLine = sequelize.define('site_grn_line', {
  siteGrnId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receivedQty: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false
  }
});

module.exports = SiteGRNLine;
