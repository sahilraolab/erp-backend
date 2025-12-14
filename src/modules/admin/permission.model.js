const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Permission = sequelize.define('permission', {
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  module: DataTypes.STRING,
  action: DataTypes.STRING
});

module.exports = Permission;
