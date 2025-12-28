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

/* ================= SITE ↔ STOCK ================= */

Site.hasMany(SiteStock, {
  foreignKey: 'siteId',
  as: 'stocks'
});

SiteStock.belongsTo(Site, {
  foreignKey: 'siteId',
  as: 'site'
});

Site.hasMany(SiteStockLedger, {
  foreignKey: 'siteId',
  as: 'stockLedger'
});
SiteStockLedger.belongsTo(Site, {
  foreignKey: 'siteId',
  as: 'site'
});

/* ================= SITE GRN ================= */

SiteGRN.hasMany(SiteGRNLine, { foreignKey: 'siteGrnId' });
SiteGRNLine.belongsTo(SiteGRN, { foreignKey: 'siteGrnId' });

Site.hasMany(SiteGRN, { foreignKey: 'siteId' });
SiteGRN.belongsTo(Site, { foreignKey: 'siteId' });

/* ================= SITE REQUISITION ================= */

SiteRequisition.hasMany(SiteRequisitionLine, {
  foreignKey: 'requisitionId'
});
SiteRequisitionLine.belongsTo(SiteRequisition, {
  foreignKey: 'requisitionId'
});

Site.hasMany(SiteRequisition, { foreignKey: 'siteId' });
SiteRequisition.belongsTo(Site, { foreignKey: 'siteId' });

/* ================= SITE TRANSFER ================= */

SiteTransfer.hasMany(SiteTransferLine, {
  foreignKey: 'transferId'
});
SiteTransferLine.belongsTo(SiteTransfer, {
  foreignKey: 'transferId'
});

/* from-site */
Site.hasMany(SiteTransfer, {
  foreignKey: 'fromSiteId',
  as: 'OutgoingTransfers'
});

/* to-site */
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
