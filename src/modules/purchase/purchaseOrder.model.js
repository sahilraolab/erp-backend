const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseOrder = sequelize.define('purchase_order', {

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

  /* ================= ENGINEERING / BUDGET LOCKS ================= */

  budgetId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Approved budget used for this PO'
  },

  estimateId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Approved estimate used for this PO'
  },

  quotationId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Approved quotation'
  },

  supplierId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  poNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'PO number (company scoped)'
  },

  /* ================= DOCUMENT ================= */

  attachmentPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Signed PO document'
  },

  poDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  /**
   * Cached total derived from PO lines
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
      'PARTIALLY_RECEIVED',
      'CLOSED',
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

  /* ================= APPROVAL ================= */

  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  approvedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /* ================= CANCELLATION ================= */

  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  cancelledBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  cancellationReason: {
    type: DataTypes.STRING(255),
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
  tableName: 'purchase_orders',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'poNo']
    },
    {
      unique: true,
      fields: ['quotationId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['supplierId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

PurchaseOrder.beforeUpdate((po) => {
  if (po.locked) {
    throw new Error('Locked purchase order cannot be modified');
  }
});

module.exports = PurchaseOrder;