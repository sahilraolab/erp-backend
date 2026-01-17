const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const ApprovalFlow = require('./approvalFlow.model');

const ApprovalRequest = sequelize.define(
  'approval_request',
  {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    approvalFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    currentLevel: {
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

    initiatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'approval_requests',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['companyId', 'documentType', 'documentId']
      },
      { fields: ['status'] }
    ]
  }
);

/* Associations */
ApprovalFlow.hasMany(ApprovalRequest, { foreignKey: 'approvalFlowId' });
ApprovalRequest.belongsTo(ApprovalFlow, { foreignKey: 'approvalFlowId' });

module.exports = ApprovalRequest;