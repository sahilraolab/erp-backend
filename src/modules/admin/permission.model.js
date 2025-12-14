const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Permission = sequelize.define(
  'permission',
  {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'permissions',
    indexes: [
      { fields: ['key'] },
      { fields: ['module'] }
    ],
    hooks: {
      beforeValidate: (perm) => {
        if (perm.key) perm.key = perm.key.toLowerCase().trim();
        if (perm.module) perm.module = perm.module.toUpperCase().trim();
        if (perm.action) perm.action = perm.action.toUpperCase().trim();
      }
    }
  }
);

module.exports = Permission;
