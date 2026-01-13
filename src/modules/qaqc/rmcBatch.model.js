const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RMCBatch = sequelize.define('rmc_batch', {
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  siteId: { type: DataTypes.INTEGER, allowNull: false },

  batchNo: { type: DataTypes.STRING },
  grade: { type: DataTypes.STRING },
  quantity: DataTypes.FLOAT,

  pouredAt: DataTypes.DATE,

  status: {
    type: DataTypes.ENUM('CREATED', 'APPROVED', 'REJECTED'),
    defaultValue: 'CREATED'
  }
});

module.exports = RMCBatch;