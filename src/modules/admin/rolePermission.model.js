const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Role = require('./role.model');
const Permission = require('./permission.model');

const RolePermission = sequelize.define(
  'role_permission',
  {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'role_permissions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'permissionId']
      }
    ]
  }
);

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

module.exports = RolePermission;
