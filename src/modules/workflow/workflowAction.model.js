const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkflowAction = sequelize.define('workflow_action', {
  instanceId: DataTypes.INTEGER,
  stepOrder: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
  action: {
    type: DataTypes.ENUM('APPROVE', 'REJECT'),
  },
  remarks: DataTypes.TEXT
});

module.exports = WorkflowAction;
