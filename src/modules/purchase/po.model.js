// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('PurchaseOrder', {
//   supplierId: DataTypes.INTEGER,
//   projectId: DataTypes.INTEGER,
//   status: DataTypes.STRING,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseOrder = sequelize.define('purchase_order', {
  poNo: { type: DataTypes.STRING, unique: true },
  quotationId: DataTypes.INTEGER,
  totalAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('CREATED', 'APPROVED'),
    defaultValue: 'CREATED'
  }
});

module.exports = PurchaseOrder;
