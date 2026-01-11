const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RABillLine = sequelize.define(
  'ra_bill_line',
  {
    raBillId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    workOrderLineId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    uomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    previousQty: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    },

    currentQty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    },

    totalQty: {
      type: DataTypes.DECIMAL(14, 3)
    },

    rate: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(16, 2)
    }
  },
  {
    indexes: [
      { fields: ['raBillId'] },
      { fields: ['workOrderLineId'] }
    ]
  }
);

/* 🔒 SAFE DERIVED FIELDS */
RABillLine.beforeSave((line) => {
  if (line.changed('previousQty') || line.changed('currentQty')) {
    line.totalQty =
      Number(line.previousQty || 0) + Number(line.currentQty || 0);
  }

  if (line.changed('currentQty') || line.changed('rate')) {
    line.amount =
      Number(line.currentQty || 0) * Number(line.rate || 0);
  }
});

module.exports = RABillLine;
