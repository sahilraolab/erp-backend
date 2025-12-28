const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrder = sequelize.define('work_order', {
  woNo: { type: DataTypes.STRING, unique: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  contractorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  scope: DataTypes.TEXT,

  totalValue: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false
  },

  retentionPercent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5
  },

  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,

  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED', 'CLOSED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = WorkOrder;
