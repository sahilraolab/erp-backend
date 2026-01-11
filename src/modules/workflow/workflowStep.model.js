const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkflowStep = sequelize.define(
  'workflow_step',
  {
    workflowId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    stepOrder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    slaHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24,
      validate: {
        min: 1
      }
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['workflowId', 'stepOrder']
      },
      { fields: ['roleId'] },
      { fields: ['isActive'] }
    ]
  }
);

module.exports = WorkflowStep;
