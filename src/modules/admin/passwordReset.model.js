const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PasswordReset = sequelize.define('password_reset', {
  userId: DataTypes.INTEGER,
  token: DataTypes.STRING,
  expiresAt: DataTypes.DATE,
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = PasswordReset;
