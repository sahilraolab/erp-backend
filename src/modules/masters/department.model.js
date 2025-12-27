const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Department = sequelize.define('department', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Department code e.g. HR, ENG, ACC'
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Department name'
  },

  departmentHead: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Department head name (optional, can be mapped to user later)'
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'departments',
  timestamps: true
});

module.exports = Department;
