const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteGRN = sequelize.define('site_grn', {
  siteGrnNo: { type: DataTypes.STRING, unique: true },
  source: DataTypes.STRING, // STORE / SITE
  sourceRefId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('QC_PENDING', 'APPROVED'),
    defaultValue: 'QC_PENDING'
  }
});

module.exports = SiteGRN;
