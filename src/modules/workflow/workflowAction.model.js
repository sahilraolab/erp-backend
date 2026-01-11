const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkflowAction = sequelize.define(
  'workflow_action',
  {
    instanceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    stepOrder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    action: {
      type: DataTypes.ENUM('APPROVE', 'REJECT'),
      allowNull: false
    },

    remarks: {
      type: DataTypes.TEXT
    },

    actionAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['instanceId', 'stepOrder', 'userId']
      },
      { fields: ['instanceId'] },
      { fields: ['userId'] },
      { fields: ['stepOrder'] }
    ]
  }
);

module.exports = WorkflowAction;
