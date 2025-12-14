const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Project = sequelize.define('project', {
  name: DataTypes.STRING,
  code: { type: DataTypes.STRING, unique: true },
  location: DataTypes.STRING,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Project;
