const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteRequisitionLine = sequelize.define('site_requisition_line', {
  requisitionId: DataTypes.INTEGER,
  materialId: DataTypes.INTEGER,
  requiredQty: DataTypes.DECIMAL(14, 3)
});

module.exports = SiteRequisitionLine;
