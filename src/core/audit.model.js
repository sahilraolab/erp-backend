const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../modules/admin/user.model');

const AuditLog = sequelize.define(
  'audit_log',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    module: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    recordId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'audit_logs',
    indexes: [
      { fields: ['userId'] },
      { fields: ['module'] },
      { fields: ['createdAt'] }
    ]
  }
);

AuditLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = AuditLog;
