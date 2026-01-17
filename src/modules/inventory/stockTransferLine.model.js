const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockTransferLine = sequelize.define('stock_transfer_line', {

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

  stockTransferId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false
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

  quantity: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false
  },

  /* ================= VALUATION ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false,
    comment: 'Valuation rate from stock (FIFO/WAC)'
  },

  transferValue: {
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
  tableName: 'stock_transfer_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['stockTransferId']
    },
    {
      fields: ['materialId']
    }
  ]
});

/* ================= VALUATION ENFORCEMENT ================= */

StockTransferLine.beforeSave((line) => {
  const qty = Number(line.quantity || 0);
  const rate = Number(line.rate || 0);

  if (qty <= 0) {
    throw new Error('Transfer quantity must be greater than zero');
  }

  line.transferValue = (qty * rate).toFixed(2);
});

module.exports = StockTransferLine;