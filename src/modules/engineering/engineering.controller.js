const audit = require('../../core/audit');
const Budget = require('./budget.model');
const Estimate = require('./estimate.model');
const Version = require('./estimateVersion.model');
const BBS = require('./bbs.model');
const Drawing = require('./drawing.model');
const Revision = require('./drawingRevision.model');
const Compliance = require('./compliance.model');

exports.createBudget = async (req, res) => {
  const b = await Budget.create(req.body);
  await audit({ userId: req.user.id, action: 'CREATE_BUDGET', module: 'ENGINEERING', recordId: b.id });
  res.json(b);
};

exports.approveBudget = async (req, res) => {
  await Budget.update({ status: 'APPROVED' }, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.createEstimate = async (req, res) => {
  const e = await Estimate.create(req.body);
  await Version.create({ estimateId: e.id, versionNo: 1, amount: e.baseAmount });
  res.json(e);
};

exports.addEstimateVersion = async (req, res) => {
  const v = await Version.create(req.body);
  res.json(v);
};

exports.createBBS = async (req, res) => {
  const bbs = await BBS.create(req.body);
  res.json(bbs);
};

exports.createDrawing = async (req, res) => {
  const d = await Drawing.create(req.body);
  res.json(d);
};

exports.reviseDrawing = async (req, res) => {
  const r = await Revision.create(req.body);
  res.json(r);
};

exports.approveDrawing = async (req, res) => {
  await Drawing.update({ status: 'APPROVED' }, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.addCompliance = async (req, res) => {
  const c = await Compliance.create(req.body);
  res.json(c);
};
