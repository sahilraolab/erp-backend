const GRN = require('./grn.model');
const GRNLine = require('./grnLine.model');

const MaterialIssue = require('./materialIssue.model');
const MaterialIssueLine = require('./materialIssueLine.model');

const StockTransfer = require('./stockTransfer.model');
const StockTransferLine = require('./stockTransferLine.model');

const PurchaseOrder = require('../purchase/po.model');
const Material = require('../masters/material.model');
const UOM = require('../masters/uom.model');

/* ================= GRN ================= */

GRN.hasMany(GRNLine, { foreignKey: 'grnId', onDelete: 'RESTRICT' });
GRNLine.belongsTo(GRN, { foreignKey: 'grnId' });

GRN.belongsTo(PurchaseOrder, { foreignKey: 'poId' });

GRNLine.belongsTo(Material, { foreignKey: 'materialId' });
GRNLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* ================= MATERIAL ISSUE ================= */

MaterialIssue.hasMany(MaterialIssueLine, {
  foreignKey: 'issueId',
  onDelete: 'RESTRICT'
});
MaterialIssueLine.belongsTo(MaterialIssue, { foreignKey: 'issueId' });

MaterialIssueLine.belongsTo(Material, { foreignKey: 'materialId' });
MaterialIssueLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* ================= STOCK TRANSFER ================= */

StockTransfer.hasMany(StockTransferLine, {
  foreignKey: 'transferId',
  onDelete: 'RESTRICT'
});
StockTransferLine.belongsTo(StockTransfer, { foreignKey: 'transferId' });

StockTransferLine.belongsTo(Material, { foreignKey: 'materialId' });
StockTransferLine.belongsTo(UOM, { foreignKey: 'uomId' });

module.exports = {};
