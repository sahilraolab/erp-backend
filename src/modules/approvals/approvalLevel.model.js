const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const ApprovalFlow = require('./approvalFlow.model');
const Role = require('../admin/role.model');

const ApprovalLevel = sequelize.define(
  'approval_level',
  {
    approvalFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    levelNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1,2,3... approval sequence'
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Role allowed to approve at this level'
    },

    isFinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'approval_levels',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['approvalFlowId', 'levelNo']
      },
      { fields: ['roleId'] }
    ]
  }
);

/* Associations */
ApprovalFlow.hasMany(ApprovalLevel, { foreignKey: 'approvalFlowId' });
ApprovalLevel.belongsTo(ApprovalFlow, { foreignKey: 'approvalFlowId' });

Role.hasMany(ApprovalLevel, { foreignKey: 'roleId' });
ApprovalLevel.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = ApprovalLevel;