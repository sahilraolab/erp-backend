const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrderRevision = sequelize.define(
  'work_order_revision',
  {
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    revisionNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    revisedValue: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    reason: {
      type: DataTypes.TEXT
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'REJECTED'),
      defaultValue: 'DRAFT'
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    approvedBy: {
      type: DataTypes.INTEGER
    },

    approvedAt: {
      type: DataTypes.DATE
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['workOrderId', 'revisionNo']
      },
      { fields: ['status'] }
    ]
  }
);

module.exports = WorkOrderRevision;
