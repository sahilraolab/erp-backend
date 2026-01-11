const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkflowInstance = sequelize.define(
  'workflow_instance',
  {
    workflowId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    module: {
      type: DataTypes.STRING,
      allowNull: false
    },

    entity: {
      type: DataTypes.STRING,
      allowNull: false
    },

    recordId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    currentStep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },

    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING'
    },

    initiatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    completedAt: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'workflow_instances',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['module', 'entity', 'recordId']
      },
      { fields: ['workflowId'] },
      { fields: ['status'] },
      { fields: ['currentStep'] }
    ],
    hooks: {
      beforeValidate: (inst) => {
        if (inst.module) inst.module = inst.module.toUpperCase().trim();
        if (inst.entity) inst.entity = inst.entity.toUpperCase().trim();
      }
    }
  }
);

module.exports = WorkflowInstance;
