const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('Approval', {
  module: DataTypes.STRING,
  recordId: DataTypes.INTEGER,
  status: DataTypes.STRING,
  approvedBy: DataTypes.INTEGER,
});
