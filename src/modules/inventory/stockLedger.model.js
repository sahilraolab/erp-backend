// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('StockLedger', {
//   materialId: DataTypes.INTEGER,
//   projectId: DataTypes.INTEGER,
//   qtyIn: DataTypes.DECIMAL,
//   qtyOut: DataTypes.DECIMAL,
//   rate: DataTypes.DECIMAL,
//   referenceType: DataTypes.STRING,
//   referenceId: DataTypes.INTEGER,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const StockLedger = sequelize.define('stock_ledger', {
  materialId: DataTypes.INTEGER,
  refType: DataTypes.STRING, // GRN / ISSUE
  refId: DataTypes.INTEGER,
  qtyIn: { type: DataTypes.FLOAT, defaultValue: 0 },
  qtyOut: { type: DataTypes.FLOAT, defaultValue: 0 },
  balanceQty: DataTypes.FLOAT,
  indexes: [
  { fields: ['materialId'] },
  { fields: ['siteId'] },
  { fields: ['createdAt'] }
]
});

module.exports = StockLedger;
