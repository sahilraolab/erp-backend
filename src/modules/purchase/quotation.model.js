const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Quotation = sequelize.define('quotation', {
  rfqId: DataTypes.INTEGER,
  supplierId: DataTypes.INTEGER,
  totalAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('SUBMITTED', 'APPROVED', 'REJECTED'),
    defaultValue: 'SUBMITTED'
  }
});

module.exports = Quotation;
