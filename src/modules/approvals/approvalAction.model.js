const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const ApprovalRequest = require('./approvalRequest.model');

const ApprovalAction = sequelize.define(
  'approval_action',
  {
    approvalRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    levelNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    action: {
      type: DataTypes.ENUM('APPROVE', 'REJECT'),
      allowNull: false
    },

    actionBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },

    actionAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'approval_actions',
    timestamps: false,
    indexes: [
      { fields: ['approvalRequestId'] },
      { fields: ['actionBy'] }
    ]
  }
);

/* Associations */
ApprovalRequest.hasMany(ApprovalAction, {
  foreignKey: 'approvalRequestId'
});
ApprovalAction.belongsTo(ApprovalRequest, {
  foreignKey: 'approvalRequestId'
});

module.exports = ApprovalAction;