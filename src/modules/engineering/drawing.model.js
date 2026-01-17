const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Drawing = sequelize.define('drawing', {

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

  /* ================= BUSINESS ID ================= */

  drawingNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Drawing number (project scoped)'
  },

  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  discipline: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Civil / Structural / Electrical / Plumbing / etc.'
  },

  /* ================= REVISION CONTROL ================= */

  currentRevisionId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Latest approved drawing revision'
  },

  /* ================= STATUS ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'SUPERSEDED',
      'OBSOLETE'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  /* ================= FILE METADATA ONLY ================= */

  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  fileMime: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  filePath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Storage path / object key'
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  approvedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'drawings',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'drawingNo']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Drawing;