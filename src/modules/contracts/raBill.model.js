const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RABill = sequelize.define(
  'ra_bill',
  {
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    billNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    billDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    periodStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    periodEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    previousGrossAmount: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0
    },

    currentGrossAmount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    grossAmount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
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
      allowNull: false
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
      { fields: ['workOrderId'] },
      { fields: ['status'] },
      {
        unique: true,
        fields: ['workOrderId', 'billNo']
      }
    ]
  }
);

module.exports = RABill;
