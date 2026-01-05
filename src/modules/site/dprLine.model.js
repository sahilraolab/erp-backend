// src/modules/site/dprLine.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DPRLine = sequelize.define('dpr_line', {
  dprId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  bbsId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  qty: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false
  },

  activity: DataTypes.STRING,
  unit: DataTypes.STRING
});

module.exports = DPRLine;
