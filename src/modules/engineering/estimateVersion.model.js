const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const EstimateVersion = sequelize.define('estimate_version', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  estimateId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Parent estimate'
  },

  /* ================= VERSION INFO ================= */

  versionNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Incremental version number'
  },

  /**
   * Cached amount derived from BBS.
   * NOT authoritative truth.
   */
  derivedAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= APPROVAL & LIFECYCLE ================= */

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
  tableName: 'estimate_versions',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['estimateId', 'versionNo']
    },
    {
      fields: ['estimateId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = EstimateVersion;