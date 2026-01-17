const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CostCenter = sequelize.define('cost_center', {

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

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Linked project (NULL = Head Office / Common)'
  },

  /* ================= BUSINESS ID ================= */

  code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Cost center code (company scoped)'
  },

  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  /* ================= HIERARCHY ================= */

  parentId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Parent cost center (same company)'
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
  tableName: 'cost_centers',
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
      fields: ['projectId']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = CostCenter;