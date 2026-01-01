const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Estimate = sequelize.define(
  'estimate',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    name: DataTypes.STRING,

    baseAmount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'FINAL'),
      defaultValue: 'DRAFT'
    },

    approvedVersionId: DataTypes.INTEGER
  },
  {
    indexes: [{ fields: ['projectId'] }]
  }
);

module.exports = Estimate;
