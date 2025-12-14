const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxRate = sequelize.define('tax_rate', {
  name: DataTypes.STRING,       // GST 18%
  type: DataTypes.STRING,       // CGST, SGST, IGST, WCT
  rate: DataTypes.FLOAT,        // %
  accountId: DataTypes.INTEGER  // Ledger account
});

module.exports = TaxRate;
