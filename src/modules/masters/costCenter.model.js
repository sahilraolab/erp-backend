const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CostCenter = sequelize.define('cost_center', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Cost center code e.g. CC001, ADMIN'
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Cost center name'
  },

  budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Planned budget for this cost center'
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
  tableName: 'cost_centers',
  timestamps: true
});

module.exports = CostCenter;
