const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteRequisition = sequelize.define('site_requisition', {
  srNo: { type: DataTypes.STRING, unique: true },
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  requestedBy: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = SiteRequisition;
