const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Department = sequelize.define('department', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= BUSINESS ID ================= */

  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Department code (ENG, PUR, ACC, QA, HR, etc.)'
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Owning company'
  },

  /* ================= STATUS ================= */

  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'departments',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'code']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Department;