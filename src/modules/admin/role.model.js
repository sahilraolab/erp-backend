const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Role = sequelize.define(
  'role',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'roles',
    indexes: [{ fields: ['name'] }],
    hooks: {
      beforeValidate: (role) => {
        if (role.name) {
          role.name = role.name.toUpperCase().trim();
        }
      }
    }
  }
);

module.exports = Role;
