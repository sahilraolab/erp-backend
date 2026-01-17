const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Role = require('./role.model');
const Supplier = require('../masters/supplier.model');
const Employee = require('../hr/employee.model');
const UserCompanyRole = require('./userCompanyRole.model');
const Company = require('../masters/company.model');

const User = sequelize.define(
  'user',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /* 🔗 NEW LINK */
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Linked employee (internal users only)'
    },

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'For supplier portal users'
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
      { fields: ['employeeId'] },
      { fields: ['supplierId'] }
    ],
    hooks: {
      beforeValidate: (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
      }
    }
  }
);

/* ================= ASSOCIATIONS ================= */

User.belongsTo(Role, { foreignKey: 'roleId' });
User.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasOne(User, { foreignKey: 'employeeId' });

User.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(User, { foreignKey: 'supplierId' });

User.hasMany(UserCompanyRole, { foreignKey: 'userId' });
UserCompanyRole.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(UserCompanyRole, { foreignKey: 'companyId' });
UserCompanyRole.belongsTo(Company, { foreignKey: 'companyId' });

UserCompanyRole.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(UserCompanyRole, { foreignKey: 'roleId' });

module.exports = User;