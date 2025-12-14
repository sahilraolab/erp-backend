// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('PurchaseBill', {
//   supplierId: DataTypes.INTEGER,
//   total: DataTypes.DECIMAL,
//   status: DataTypes.STRING,
// });

// src/modules/purchase/purchaseBill.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseBill = sequelize.define('purchase_bill', {
  billNo: { type: DataTypes.STRING, unique: true },
  grnId: DataTypes.INTEGER,
  supplierId: DataTypes.INTEGER,
  billDate: DataTypes.DATE,
  basicAmount: DataTypes.FLOAT,
  taxAmount: DataTypes.FLOAT,
  totalAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'POSTED'),
    defaultValue: 'DRAFT'
  },
  indexes: [
  { fields: ['postedToAccounts'] },
  { fields: ['createdAt'] }
]
});

module.exports = PurchaseBill;
