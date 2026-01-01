const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Budget = sequelize.define(
  'budget',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    totalBudget: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'LOCKED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [{ fields: ['projectId'] }]
  }
);

module.exports = Budget;
