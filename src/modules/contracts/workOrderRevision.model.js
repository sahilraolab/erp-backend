const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrderRevision = sequelize.define('work_order_revision', {
  workOrderId: DataTypes.INTEGER,
  revisionNo: DataTypes.INTEGER,
  revisedValue: DataTypes.FLOAT,
  reason: DataTypes.TEXT
});

module.exports = WorkOrderRevision;
