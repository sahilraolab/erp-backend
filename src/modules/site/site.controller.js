const audit = require('../../core/audit');
const SiteReq = require('./siteRequisition.model');
const SiteGRN = require('./siteGrn.model');
const SiteStock = require('./siteStock.model');
const Transfer = require('./materialTransfer.model');
const DPR = require('./dpr.model');
const WPR = require('./wpr.model');
const Muster = require('./muster.model');

const genNo = (p) => `${p}-${Date.now()}`;

/* ================= SITE REQUISITION ================= */

exports.createSiteReq = async (req, res) => {
  const sr = await SiteReq.create({
    srNo: genNo('SR'),
    ...req.body,
    requestedBy: req.user.id
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_SR',
    module: 'SITE',
    recordId: sr.id
  });

  res.json(sr);
};

exports.approveSiteReq = async (req, res) => {
  await SiteReq.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_SR',
    module: 'SITE',
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= SITE GRN ================= */

exports.receiveAtSite = async (req, res) => {
  const grn = await SiteGRN.create({
    siteGrnNo: genNo('SGRN'),
    ...req.body
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_SITE_GRN',
    module: 'SITE',
    recordId: grn.id
  });

  res.json(grn);
};

exports.approveSiteGRN = async (req, res) => {
  await SiteGRN.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_SITE_GRN',
    module: 'SITE',
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= SITE STOCK ================= */

exports.updateSiteStock = async (req, res) => {
  const { siteId, materialId, qty } = req.body;

  let stock = await SiteStock.findOne({ where: { siteId, materialId } });
  if (!stock) {
    stock = await SiteStock.create({ siteId, materialId, quantity: 0 });
  }

  stock.quantity += qty;
  await stock.save();

  await audit({
    userId: req.user.id,
    action: 'UPDATE_SITE_STOCK',
    module: 'SITE',
    recordId: stock.id
  });

  res.json(stock);
};

/* ================= TRANSFER ================= */

exports.transferMaterial = async (req, res) => {
  const t = await Transfer.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'TRANSFER_MATERIAL',
    module: 'SITE',
    recordId: t.id
  });

  res.json(t);
};

/* ================= REPORTS ================= */

exports.createDPR = async (req, res) => {
  const dpr = await DPR.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_DPR',
    module: 'SITE',
    recordId: dpr.id
  });

  res.json(dpr);
};

exports.createWPR = async (req, res) => {
  const wpr = await WPR.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_WPR',
    module: 'SITE',
    recordId: wpr.id
  });

  res.json(wpr);
};

exports.createMuster = async (req, res) => {
  const m = await Muster.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_MUSTER',
    module: 'SITE',
    recordId: m.id
  });

  res.json(m);
};

exports.siteStock = async (req, res) => {
  res.json(await SiteStock.findAll());
};
