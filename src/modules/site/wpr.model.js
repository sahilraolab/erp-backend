const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WPR = sequelize.define(
  'wpr',
  {
    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    weekStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    weekEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    generatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    generatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('GENERATED', 'FROZEN'),
      defaultValue: 'GENERATED'
    },

    remarks: {
      type: DataTypes.TEXT
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['siteId', 'weekStartDate', 'weekEndDate']
      },
      { fields: ['status'] }
    ]
  }
);

module.exports = WPR;
