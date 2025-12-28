const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DebitCreditNote = sequelize.define(
  'debit_credit_note',
  {
    contractorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    raBillId: {
      type: DataTypes.INTEGER,
      allowNull: true // may apply to future RA
    },

    noteNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM('DEBIT', 'CREDIT'),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    reason: {
      type: DataTypes.STRING,
      allowNull: false
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
    }
  },
  {
    indexes: [
      { fields: ['contractorId'] },
      { fields: ['raBillId'] },
      { fields: ['postedToAccounts'] }
    ]
  }
);

module.exports = DebitCreditNote;
