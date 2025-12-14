const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkflowStep = sequelize.define('workflow_step', {
  workflowId: DataTypes.INTEGER,
  stepOrder: DataTypes.INTEGER,
  roleId: DataTypes.INTEGER,
  slaHours: DataTypes.INTEGER
});

module.exports = WorkflowStep;
