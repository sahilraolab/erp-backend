const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrderLine = sequelize.define(
  'work_order_line',
  {
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    bbsId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    itemCode: {
      type: DataTypes.STRING
    },

    description: {
      type: DataTypes.STRING
    },

    uomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    qty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    },

    rate: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(16, 2)
    },

    executedQty: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    }
  },
  {
    indexes: [
      { fields: ['workOrderId'] },
      { fields: ['bbsId'] }
    ]
  }
);

/* 🔒 SAFE DERIVED AMOUNT */
WorkOrderLine.beforeSave((line) => {
  if (line.changed('qty') || line.changed('rate')) {
    line.amount = Number(line.qty) * Number(line.rate);
  }
});

module.exports = WorkOrderLine;
