const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Role = require('./role.model');

const User = sequelize.define('user', {
  name: DataTypes.STRING,
  // email: {
  //   type: DataTypes.STRING,
  //   unique: true
  // },
  email: {
  type: DataTypes.STRING,
  unique: true,
  allowNull: false
},
  password: DataTypes.STRING,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

User.belongsTo(Role);

module.exports = User;
