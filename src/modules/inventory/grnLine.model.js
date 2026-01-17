const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const GRNLine = sequelize.define('grn_line', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  grnId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center for inventory valuation'
  },

  /* ================= TRACEABILITY ================= */

  purchaseOrderLineId: {
    type: DataTypes.BIGINT,
    allowNull: false
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
    allowNull: false
  },

  acceptedQty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
  },

  rejectedQty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= VALUATION SNAPSHOT ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false,
    comment: 'Rate from PO line'
  },

  valuationAmount: {
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
  tableName: 'grn_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['grnId']
    },
    {
      fields: ['purchaseOrderLineId']
    },
    {
      fields: ['materialId']
    },
    {
      unique: true,
      fields: ['grnId', 'purchaseOrderLineId']
    }
  ]
});

/* ================= QUANTITY & VALUATION ENFORCEMENT ================= */

GRNLine.beforeSave((line) => {
  const ordered = Number(line.orderedQty || 0);
  const received = Number(line.receivedQty || 0);
  const accepted = Number(line.acceptedQty || 0);
  const rejected = Number(line.rejectedQty || 0);
  const rate = Number(line.rate || 0);

  if (received > ordered) {
    throw new Error('Received quantity cannot exceed ordered quantity');
  }

  if (accepted + rejected !== received) {
    throw new Error('Accepted + rejected quantity must equal received quantity');
  }

  line.valuationAmount = (accepted * rate).toFixed(2);
});

module.exports = GRNLine;