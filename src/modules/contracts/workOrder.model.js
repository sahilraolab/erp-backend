const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrder = sequelize.define(
  'work_order',
  {
    woNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    contractorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    scope: {
      type: DataTypes.TEXT
    },

    totalValue: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    retentionPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 5
    },

    startDate: {
      type: DataTypes.DATE
    },

    endDate: {
      type: DataTypes.DATE
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'CLOSED'),
      defaultValue: 'DRAFT'
    },

    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
      { fields: ['projectId'] },
      { fields: ['contractorId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = WorkOrder;
