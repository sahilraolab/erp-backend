const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const EstimateVersion = sequelize.define(
  'estimate_version',
  {
    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    versionNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    indexes: [
      { unique: true, fields: ['estimateId', 'versionNo'] },
      { fields: ['estimateId'] },
      { fields: ['isApproved'] }
    ]
  }
);

module.exports = EstimateVersion;
