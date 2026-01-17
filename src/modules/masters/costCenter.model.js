const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CostCenter = sequelize.define('cost_center', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // CC-SITE-A, CC-HO
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true // NULL = common / HO
  },

  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true // enables hierarchy (optional use)
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = CostCenter;
