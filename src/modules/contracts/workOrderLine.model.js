const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrderLine = sequelize.define('work_order_line', {
  workOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bbsId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  itemCode: DataTypes.STRING,
  description: DataTypes.STRING,
  unit: DataTypes.STRING,
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
});

WorkOrderLine.beforeSave(line => {
  line.amount = Number(line.qty) * Number(line.rate);
});

module.exports = WorkOrderLine;
