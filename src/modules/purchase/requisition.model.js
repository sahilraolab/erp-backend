const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Requisition = sequelize.define('requisition', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center for budget enforcement'
  },

  /* ================= ENGINEERING REFERENCES ================= */

  budgetId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  estimateId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  reqNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Requisition number (company scoped)'
  },

  /* ================= REQUEST INFO ================= */

  requestedBy: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'User who raised requisition'
  },

  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'REJECTED',
      'CANCELLED',
      'CLOSED'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

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
  tableName: 'requisitions',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'reqNo']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['budgetId']
    },
    {
      fields: ['costCenterId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

Requisition.beforeUpdate((req) => {
  if (req.locked) {
    throw new Error('Approved requisition cannot be modified');
  }
});

module.exports = Requisition;