const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxGroup = sequelize.define('tax_group', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // GST18, GST12, IGST18
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = TaxGroup;