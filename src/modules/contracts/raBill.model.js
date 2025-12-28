const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RABill = sequelize.define('ra_bill', {
  workOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  billNo: {
    type: DataTypes.STRING,
    unique: true
  },

  billDate: DataTypes.DATE,

  grossAmount: {
    type: DataTypes.DECIMAL(16, 2),
    defaultValue: 0
  },

  retentionAmount: {
    type: DataTypes.DECIMAL(16, 2),
    defaultValue: 0
  },

  advanceRecovery: {
    type: DataTypes.DECIMAL(16, 2),
    defaultValue: 0
  },

  netPayable: {
    type: DataTypes.DECIMAL(16, 2),
    defaultValue: 0
  },

  isFinalBill: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'),
    defaultValue: 'DRAFT'
  },

  postedToAccounts: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = RABill;
