const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteTransferLine = sequelize.define('site_transfer_line', {
  transferId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  qty: {
    type: DataTypes.DECIMAL(14,3),
    allowNull: false
  }
});

module.exports = SiteTransferLine;
