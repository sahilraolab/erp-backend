const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RMCBatch = sequelize.define('rmc_batch', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  batchNo: DataTypes.STRING,
  grade: DataTypes.STRING,
  pourLocation: DataTypes.STRING,
  slump: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('PASS', 'FAIL'),
    defaultValue: 'PASS'
  }
});

module.exports = RMCBatch;
