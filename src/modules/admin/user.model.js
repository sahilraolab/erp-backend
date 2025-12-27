const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Role = require('./role.model');
const Department = require('../masters/department.model');

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

    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Optional department
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['departmentId'] }
    ],
    hooks: {
      beforeValidate: (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
        if (user.phone) {
          user.phone = user.phone.trim();
        }
      }
    }
  }
);

// Associations
User.belongsTo(Role, { foreignKey: 'roleId' });
User.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(User, { foreignKey: 'departmentId' });

module.exports = User;
