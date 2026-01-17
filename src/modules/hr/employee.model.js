const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Employee = sequelize.define(
  'employee',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },

    designation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'employees',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['code'] }
    ]
  }
);

module.exports = Employee;