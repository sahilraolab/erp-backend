const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Role = require('./role.model');

const User = sequelize.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'users',
    indexes: [{ fields: ['email'] }],
    hooks: {
      beforeValidate: (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
      }
    }
  }
);

User.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = User;
