const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ApprovalFlow = sequelize.define(
  'approval_flow',
  {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'PURCHASE_REQUISITION, PURCHASE_PO, PURCHASE_BILL, VOUCHER'
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'approval_flows',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['companyId', 'documentType'] },
      { fields: ['companyId'] }
    ]
  }
);

module.exports = ApprovalFlow;