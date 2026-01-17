const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Payment = sequelize.define(
  'payment',
  {
    paymentNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    billId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    grossAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    tdsAmount: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0
    },

    bankChargeAmount: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0
    },

    netPaidAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'),
      defaultValue: 'DRAFT'
    },

    postedToAccounts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'payments',
    timestamps: true,
    indexes: [
      { fields: ['companyId'] },
      { fields: ['supplierId'] },
      { fields: ['billId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = Payment;