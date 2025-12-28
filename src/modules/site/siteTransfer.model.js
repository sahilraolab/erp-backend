const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteTransfer = sequelize.define('site_transfer', {
  transferNo: {
    type: DataTypes.STRING,
    unique: true
  },
  fromSiteId: DataTypes.INTEGER,
  toSiteId: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = SiteTransfer;
