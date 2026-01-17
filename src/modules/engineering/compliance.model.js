const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Compliance = sequelize.define('compliance', {

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

  /* ================= COMPLIANCE INFO ================= */

  type: {
    type: DataTypes.ENUM(
      'STATUTORY',
      'SAFETY',
      'ENVIRONMENT',
      'LABOUR',
      'QUALITY',
      'OTHER'
    ),
    allowNull: false
  },

  documentRef: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Reference number / certificate number'
  },

  validTill: {
    type: DataTypes.DATE,
    allowNull: true
  },

  /* ================= STATUS ================= */

  status: {
    type: DataTypes.ENUM(
      'PENDING',
      'SUBMITTED',
      'APPROVED',
      'EXPIRED',
      'CLOSED'
    ),
    allowNull: false,
    defaultValue: 'PENDING'
  },

  /**
   * If true, project activities must be blocked
   * when compliance is not APPROVED.
   */
  blocking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  /* ================= DOCUMENT METADATA ================= */

  documentName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  documentMime: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  documentSize: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  documentPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Storage path / object key'
  },

  /* ================= APPROVAL ================= */

  approvedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  approvedAt: {
    type: DataTypes.DATE,
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
  tableName: 'compliances',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['projectId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['blocking']
    },
    {
      fields: ['validTill']
    }
  ]
});

module.exports = Compliance;