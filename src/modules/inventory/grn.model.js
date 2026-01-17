const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const GRN = sequelize.define('grn', {

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

  locationId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Store / site where material is received'
  },

  /* ================= PURCHASE LINK ================= */

  purchaseOrderId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  grnNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'GRN number (company scoped)'
  },

  /* ================= RECEIPT ================= */

  receivedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  receivedBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= QC & LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'QC_PENDING',
      'PARTIAL_APPROVED',
      'APPROVED',
      'REJECTED',
      'CANCELLED'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'grns',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'grnNo']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['purchaseOrderId']
    },
    {
      fields: ['locationId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

GRN.beforeUpdate((grn) => {
  if (grn.locked) {
    throw new Error('Approved or cancelled GRN cannot be modified');
  }
});

module.exports = GRN;