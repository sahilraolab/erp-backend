const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RABill = sequelize.define('ra_bill', {
  workOrderId: DataTypes.INTEGER,
  billNo: { type: DataTypes.STRING, unique: true },
  billDate: DataTypes.DATE,
  grossAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'),
    defaultValue: 'DRAFT'
  },
  postedToAccounts: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [
    { fields: ['postedToAccounts'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = RABill;
