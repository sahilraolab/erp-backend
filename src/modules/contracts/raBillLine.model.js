const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RABillLine = sequelize.define('ra_bill_line', {
  raBillId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  workOrderLineId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  previousQty: {
    type: DataTypes.DECIMAL(14,3),
    defaultValue: 0
  },
  currentQty: {
    type: DataTypes.DECIMAL(14,3),
    allowNull: false
  },
  totalQty: {
    type: DataTypes.DECIMAL(14,3)
  },
  rate: {
    type: DataTypes.DECIMAL(14,2)
  },
  amount: {
    type: DataTypes.DECIMAL(16,2)
  }
});

RABillLine.beforeSave(line => {
  line.totalQty = Number(line.previousQty) + Number(line.currentQty);
  line.amount = Number(line.currentQty) * Number(line.rate);
});

module.exports = RABillLine;
