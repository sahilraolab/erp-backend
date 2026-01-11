const Site = require('./site.model');

const SiteStock = require('./siteStock.model');
const SiteStockLedger = require('./siteStockLedger.model');

const SiteGRN = require('./siteGrn.model');
const SiteGRNLine = require('./siteGrnLine.model');

const SiteRequisition = require('./siteRequisition.model');
const SiteRequisitionLine = require('./siteRequisitionLine.model');

const SiteTransfer = require('./siteTransfer.model');
const SiteTransferLine = require('./siteTransferLine.model');

const DPR = require('./dpr.model');
const WPR = require('./wpr.model');
const Muster = require('./muster.model');

const Material = require('../masters/material.model');
const UOM = require('../masters/uom.model');

/* ================= SITE ↔ STOCK ================= */

Site.hasMany(SiteStock, { foreignKey: 'siteId' });
SiteStock.belongsTo(Site, { foreignKey: 'siteId' });

Site.hasMany(SiteStockLedger, { foreignKey: 'siteId' });
SiteStockLedger.belongsTo(Site, { foreignKey: 'siteId' });

SiteStock.belongsTo(Material, { foreignKey: 'materialId' });
SiteStock.belongsTo(UOM, { foreignKey: 'uomId' });

SiteStockLedger.belongsTo(Material, { foreignKey: 'materialId' });
SiteStockLedger.belongsTo(UOM, { foreignKey: 'uomId' });

/* ================= SITE GRN ================= */

Site.hasMany(SiteGRN, { foreignKey: 'siteId' });
SiteGRN.belongsTo(Site, { foreignKey: 'siteId' });

SiteGRN.hasMany(SiteGRNLine, { foreignKey: 'siteGrnId' });
SiteGRNLine.belongsTo(SiteGRN, { foreignKey: 'siteGrnId' });

SiteGRNLine.belongsTo(Material, { foreignKey: 'materialId' });
SiteGRNLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* ================= SITE REQUISITION ================= */

Site.hasMany(SiteRequisition, { foreignKey: 'siteId' });
SiteRequisition.belongsTo(Site, { foreignKey: 'siteId' });

SiteRequisition.hasMany(SiteRequisitionLine, {
  foreignKey: 'requisitionId'
});
SiteRequisitionLine.belongsTo(SiteRequisition, {
  foreignKey: 'requisitionId'
});

SiteRequisitionLine.belongsTo(Material, { foreignKey: 'materialId' });
SiteRequisitionLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* ================= SITE TRANSFER ================= */

SiteTransfer.hasMany(SiteTransferLine, {
  foreignKey: 'transferId'
});
SiteTransferLine.belongsTo(SiteTransfer, {
  foreignKey: 'transferId'
});

SiteTransferLine.belongsTo(Material, { foreignKey: 'materialId' });
SiteTransferLine.belongsTo(UOM, { foreignKey: 'uomId' });

Site.hasMany(SiteTransfer, {
  foreignKey: 'fromSiteId',
  as: 'OutgoingTransfers'
});
Site.hasMany(SiteTransfer, {
  foreignKey: 'toSiteId',
  as: 'IncomingTransfers'
});

SiteTransfer.belongsTo(Site, {
  foreignKey: 'fromSiteId',
  as: 'fromSite'
});
SiteTransfer.belongsTo(Site, {
  foreignKey: 'toSiteId',
  as: 'toSite'
});

/* ================= REPORTING ================= */

Site.hasMany(DPR, { foreignKey: 'siteId' });
DPR.belongsTo(Site, { foreignKey: 'siteId' });

Site.hasMany(WPR, { foreignKey: 'siteId' });
WPR.belongsTo(Site, { foreignKey: 'siteId' });

Site.hasMany(Muster, { foreignKey: 'siteId' });
Muster.belongsTo(Site, { foreignKey: 'siteId' });

module.exports = {};
