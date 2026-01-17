const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Project = sequelize.define('project', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Owning company'
  },

  /* ================= BUSINESS ID ================= */

  code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Project code (company scoped)'
  },

  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  /* ================= ADDRESS ================= */

  addressLine1: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  addressLine2: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'India'
  },

  pincode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },

  /* ================= LIFECYCLE ================= */

  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM(
      'PLANNING',
      'ACTIVE',
      'ON_HOLD',
      'COMPLETED',
      'CLOSED'
    ),
    allowNull: false,
    defaultValue: 'PLANNING'
  },

  engineeringLocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Locks estimates, BBS, and budgets once approved'
  },

  /* ================= FINANCIAL HOOKS ================= */

  costCenterCode: {
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: 'Default cost center for project accounting'
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
  tableName: 'projects',
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
    },
    {
      fields: ['city', 'state']
    }
  ]
});

module.exports = Project;