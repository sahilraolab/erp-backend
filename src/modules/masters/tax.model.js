const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Tax = sequelize.define('tax', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // GST, TDS, CESS
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(
      'GST',
      'TDS',
      'CESS',
      'OTHER'
    ),
    allowNull: false
  },

  isRecoverable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // GST yes, TDS no
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Tax;
