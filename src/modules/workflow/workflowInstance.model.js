const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkflowInstance = sequelize.define('workflow_instance', {
  workflowId: DataTypes.INTEGER,
  recordId: DataTypes.INTEGER,
  currentStep: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  indexes: [
  { fields: ['workflowId'] },
  { fields: ['recordId'] },
  { fields: ['status'] }
]

});


module.exports = WorkflowInstance;
