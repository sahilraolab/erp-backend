const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UserCompanyRole = sequelize.define(
  'user_company_role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'user_company_roles',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId', 'companyId'] },
      { fields: ['companyId'] },
      { fields: ['roleId'] }
    ]
  }
);

module.exports = UserCompanyRole;