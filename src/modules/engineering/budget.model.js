const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Budget = sequelize.define('budget', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /**
   * Budget MUST be based on an approved estimate version
   */
  estimateVersionId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Approved estimate version'
  },

  /**
   * Cached total derived from budget lines
   * NOT authoritative truth
   */
  derivedTotal: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'REJECTED',
      'SUPERSEDED'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  /* ================= APPROVAL ================= */

  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  approvedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
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
  tableName: 'budgets',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'estimateVersionId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Budget;