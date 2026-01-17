const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Estimate = sequelize.define('estimate', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Owning project'
  },

  /* ================= BUSINESS INFO ================= */

  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Estimate name / description'
  },

  /**
   * Cached total amount derived from BBS.
   * NOT a source of truth.
   */
  derivedAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Derived from BBS quantities and rates'
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

  /**
   * Pointer to the approved estimate version.
   * Only valid when status = APPROVED
   */
  approvedVersionId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /**
   * Once approved, estimate becomes immutable.
   */
  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'estimates',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['projectId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Estimate;