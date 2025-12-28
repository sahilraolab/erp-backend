const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteGRN = sequelize.define('site_grn', {
  siteGrnNo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  sourceType: {
    type: DataTypes.ENUM('STORE', 'SITE'),
    allowNull: false
  },
  sourceRefId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receivedBy: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('QC_PENDING', 'APPROVED'),
    defaultValue: 'QC_PENDING'
  }
});

module.exports = SiteGRN;
