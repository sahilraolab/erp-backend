const GRN = require('./grn.model');
const GRNLine = require('./grnLine.model');

const MaterialIssue = require('./materialIssue.model');
const MaterialIssueLine = require('./materialIssueLine.model');

const StockTransfer = require('./stockTransfer.model');
const StockTransferLine = require('./stockTransferLine.model');

/* ================= GRN ================= */
GRN.hasMany(GRNLine, { foreignKey: 'grnId' });
GRNLine.belongsTo(GRN, { foreignKey: 'grnId' });

/* ================= MATERIAL ISSUE ================= */
MaterialIssue.hasMany(MaterialIssueLine, { foreignKey: 'issueId' });
MaterialIssueLine.belongsTo(MaterialIssue, { foreignKey: 'issueId' });

/* ================= STOCK TRANSFER ================= */
StockTransfer.hasMany(StockTransferLine, { foreignKey: 'transferId' });
StockTransferLine.belongsTo(StockTransfer, { foreignKey: 'transferId' });

module.exports = {};
