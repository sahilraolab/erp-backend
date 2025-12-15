const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Budget = sequelize.define('budget', {
  projectId: DataTypes.INTEGER,
  totalBudget: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = Budget;
