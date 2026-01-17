const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RequisitionLine = sequelize.define('requisition_line', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  requisitionId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center for budget enforcement'
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
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
  },

  /* ================= ENGINEERING LINK ================= */

  bbsId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Linked BBS item'
  },

  /* ================= SCHEDULING ================= */

  requiredDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  /* ================= FINANCIAL FORECAST ================= */

  estimatedRate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: true,
    comment: 'Estimated rate for budget forecasting'
  },

  derivedAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  remarks: {
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
  tableName: 'requisition_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['requisitionId']
    },
    {
      fields: ['materialId']
    },
    {
      fields: ['bbsId']
    },
    {
      fields: ['costCenterId']
    }
  ]
});

/* ================= SAFE AMOUNT CALCULATION ================= */

RequisitionLine.beforeSave((line) => {
  if (
    line.changed('quantity') ||
    line.changed('estimatedRate')
  ) {
    if (line.estimatedRate) {
      line.derivedAmount = (
        Number(line.quantity) * Number(line.estimatedRate)
      ).toFixed(2);
    }
  }
});

module.exports = RequisitionLine;