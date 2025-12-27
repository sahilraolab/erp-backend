const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const QuotationLine = sequelize.define(
  'quotation_line',
  {
    quotationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /* 🔒 Engineering traceability */
    bbsId: {
      type: DataTypes.INTEGER
    },

    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    qty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(14, 2)
    },

    taxPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },

    taxAmount: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0
    },

    totalAmount: {
      type: DataTypes.DECIMAL(14, 2)
    }
  },
  {
    indexes: [
      { fields: ['quotationId'] },
      { fields: ['projectId'] },
      { fields: ['materialId'] },
      { fields: ['bbsId'] }
    ]
  }
);

/* ✅ ENTERPRISE CALCULATION HOOK */
QuotationLine.beforeSave((line) => {
  const qty = Number(line.qty || 0);
  const rate = Number(line.rate || 0);
  const taxPct = Number(line.taxPercent || 0);

  line.amount = qty * rate;
  line.taxAmount = (line.amount * taxPct) / 100;
  line.totalAmount = line.amount + line.taxAmount;
});

module.exports = QuotationLine;
