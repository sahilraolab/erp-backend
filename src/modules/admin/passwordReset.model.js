const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PasswordReset = sequelize.define(
  'password_reset',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'password_resets',
    timestamps: true,
    indexes: [
      { fields: ['token'] },
      { fields: ['userId'] },
      { fields: ['expiresAt'] }
    ]
  }
);

module.exports = PasswordReset;
