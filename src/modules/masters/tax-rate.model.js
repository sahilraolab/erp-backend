const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxRate = sequelize.define('tax_rate', {

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  taxId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  rate: {
    type: DataTypes.DECIMAL(6,3),
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

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'tax_rates',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['taxId', 'effectiveFrom']
    },
    {
      fields: ['taxId']
    }
  ]
});

module.exports = TaxRate;