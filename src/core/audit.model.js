const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('audit_log', {
  userId: DataTypes.INTEGER,
  action: DataTypes.STRING,
  module: DataTypes.STRING,
  recordId: DataTypes.INTEGER,
  meta: DataTypes.JSON
});

module.exports = AuditLog;
