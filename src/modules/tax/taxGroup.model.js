const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxGroup = sequelize.define('tax_group', {
  name: DataTypes.STRING,        // GST 18%
  cgst: DataTypes.FLOAT,
  sgst: DataTypes.FLOAT,
  igst: DataTypes.FLOAT,
  wct: DataTypes.FLOAT
});

module.exports = TaxGroup;
