const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseBillLine = sequelize.define('purchase_bill_line', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  purchaseBillId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center for accounting & budget impact'
  },

  /* ================= TRACEABILITY ================= */

  purchaseOrderLineId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Source PO line'
  },

  grnLineId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Source GRN line (billing against receipt)'
  },

  bbsId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Engineering linkage'
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

  billedQty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false,
    comment: 'Quantity billed (<= GRN qty)'
  },

  /* ================= PRICING SNAPSHOT ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false,
    comment: 'Rate as per supplier bill'
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
  tableName: 'purchase_bill_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['purchaseBillId']
    },
    {
      fields: ['purchaseOrderLineId']
    },
    {
      fields: ['grnLineId']
    },
    {
      unique: true,
      fields: ['purchaseBillId', 'grnLineId']
    }
  ]
});

/* ================= SAFE DERIVED CALCULATIONS ================= */

PurchaseBillLine.beforeSave((line) => {
  const qty = Number(line.billedQty || 0);
  const rate = Number(line.rate || 0);
  const taxRate = Number(line.taxRate || 0);

  const base = qty * rate;
  const tax = (base * taxRate) / 100;

  line.baseAmount = base.toFixed(2);
  line.taxAmount = tax.toFixed(2);
  line.totalAmount = (base + tax).toFixed(2);
});

module.exports = PurchaseBillLine;