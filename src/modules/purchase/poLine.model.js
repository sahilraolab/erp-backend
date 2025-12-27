const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseOrderLine = sequelize.define(
  'purchase_order_line',
  {
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    }
  },
  {
    indexes: [
      { fields: ['purchaseOrderId'] },
      { fields: ['materialId'] }
    ]
  }
);

PurchaseOrderLine.beforeSave((line) => {
  line.amount = Number(line.qty) * Number(line.rate);
});

module.exports = PurchaseOrderLine;
