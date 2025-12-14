const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Material = sequelize.define('material', {
  name: DataTypes.STRING,
  code: { type: DataTypes.STRING, unique: true },
  category: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Material;
