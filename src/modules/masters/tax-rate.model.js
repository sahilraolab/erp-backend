const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxRate = sequelize.define('tax_rate', {
  taxId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rate: {
    type: DataTypes.DECIMAL(6,3), // supports 0.25%
    allowNull: false
  },

  effectiveFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  effectiveTo: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = TaxRate;