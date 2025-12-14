const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const QuotationLine = sequelize.define('quotation_line', {
  quotationId: DataTypes.INTEGER,
  materialId: DataTypes.INTEGER,
  qty: DataTypes.FLOAT,
  rate: DataTypes.FLOAT,
  amount: DataTypes.FLOAT
});

module.exports = QuotationLine;
