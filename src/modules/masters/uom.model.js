const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UOM = sequelize.define('uom', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Short unit code e.g. KG, MT, NOS'
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Unit name e.g. Kilogram, Number'
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = UOM;
