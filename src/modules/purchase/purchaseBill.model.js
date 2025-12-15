const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseBill = sequelize.define(
  'purchase_bill',
  {
    billNo: { type: DataTypes.STRING, unique: true },
    grnId: DataTypes.INTEGER,
    supplierId: DataTypes.INTEGER,
    billDate: DataTypes.DATE,

    basicAmount: DataTypes.FLOAT,
    taxAmount: DataTypes.FLOAT,
    totalAmount: DataTypes.FLOAT,

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'),
      defaultValue: 'DRAFT'
    },

    postedToAccounts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    indexes: [
      { fields: ['postedToAccounts'] },
      { fields: ['createdAt'] },
      { fields: ['supplierId'] }
    ]
  }
);

module.exports = PurchaseBill;

// ❌ indexes placed inside attributes – INVALID
// ✅ move indexes to model options
// const PurchaseBill = sequelize.define('purchase_bill', {
//   billNo: { type: DataTypes.STRING, unique: true },
//   grnId: DataTypes.INTEGER,
//   supplierId: DataTypes.INTEGER,
//   billDate: DataTypes.DATE,
//   basicAmount: DataTypes.FLOAT,
//   taxAmount: DataTypes.FLOAT,
//   totalAmount: DataTypes.FLOAT,
//   postedToAccounts: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   }
// }, {
//   indexes: [
//     { fields: ['postedToAccounts'] },
//     { fields: ['createdAt'] }
//   ]
// });
