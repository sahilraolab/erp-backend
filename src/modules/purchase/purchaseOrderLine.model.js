const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseOrderLine = sequelize.define('purchase_order_line', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  purchaseOrderId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center for budget enforcement'
  },

  /* ================= TRACEABILITY ================= */

  quotationLineId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Approved quotation line'
  },

  bbsId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /* ================= ITEM ================= */

  materialId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  uomId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  orderedQty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
  },

  receivedQty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= PRICING ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false
  },

  baseAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= TAX SNAPSHOT ================= */

  taxGroupId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  taxRate: {
    type: DataTypes.DECIMAL(6, 3),
    allowNull: false,
    defaultValue: 0
  },

  taxAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  totalAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
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
  tableName: 'purchase_order_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['purchaseOrderId']
    },
    {
      fields: ['materialId']
    },
    {
      unique: true,
      fields: ['purchaseOrderId', 'quotationLineId']
    }
  ]
});

/* ================= SAFE DERIVED CALCULATIONS ================= */

PurchaseOrderLine.beforeSave((line) => {
  const qty = Number(line.orderedQty || 0);
  const rate = Number(line.rate || 0);
  const taxRate = Number(line.taxRate || 0);

  const base = qty * rate;
  const tax = (base * taxRate) / 100;

  line.baseAmount = base.toFixed(2);
  line.taxAmount = tax.toFixed(2);
  line.totalAmount = (base + tax).toFixed(2);
});

module.exports = PurchaseOrderLine;