const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DrawingRevision = sequelize.define('drawing_revision', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  drawingId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Parent drawing'
  },

  /* ================= REVISION INFO ================= */

  revisionNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Incremental revision number'
  },

  changeNote: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  /* ================= STATUS ================= */

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
  tableName: 'drawing_revisions',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['drawingId', 'revisionNo']
    },
    {
      fields: ['drawingId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = DrawingRevision;