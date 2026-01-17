const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UOM = sequelize.define('uom', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true    // KG, MT, NOS, SQM
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false // Kilogram, Meter, Number
  },

  category: {
    type: DataTypes.ENUM(
      'WEIGHT',
      'LENGTH',
      'AREA',
      'VOLUME',
      'COUNT',
      'TIME'
    ),
    allowNull: false
  },

  isBase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  /**
   * conversionFactor TO BASE UNIT
   * Base unit must have factor = 1
   *
   * Example:
   * KG → 1
   * MT → 1000
   * SQFT → 0.092903
   */
  conversionFactor: {
    type: DataTypes.DECIMAL(14,6),
    allowNull: false
  },

  decimalAllowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = UOM;
