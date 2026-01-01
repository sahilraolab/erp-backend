const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');
const service = require('./engineering.service');
const BBS = require('./bbs.model');
const Estimate = require('./estimate.model');
const Budget = require('./budget.model');

/* ================= BUDGET ================= */

exports.createBudget = async (req, res) => {
  const budget = await withTx(t =>
    service.createBudget(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CREATE_BUDGET',
    module: 'ENGINEERING',
    recordId: budget.id
  });

  res.json(budget);
};

exports.approveBudget = async (req, res) => {
  await withTx(t =>
    service.approveBudget(req.params.id, t)
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_BUDGET',
    module: 'ENGINEERING',
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= ESTIMATE ================= */

exports.createEstimate = async (req, res) => {
  const estimate = await withTx(t =>
    service.createEstimate(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CREATE_ESTIMATE',
    module: 'ENGINEERING',
    recordId: estimate.id
  });

  res.json(estimate);
};

exports.addEstimateVersion = async (req, res) => {
  const version = await withTx(t =>
    service.addEstimateVersion(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'ADD_ESTIMATE_VERSION',
    module: 'ENGINEERING',
    recordId: version.id
  });

  res.json(version);
};

exports.approveEstimate = async (req, res) => {
  await withTx(t =>
    service.approveEstimate(req.params.id, t)
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_ESTIMATE',
    module: 'ENGINEERING',
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= BBS ================= */

exports.createBBS = async (req, res) => {
  const bbs = await withTx(t =>
    service.createBBS(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CREATE_BBS',
    module: 'ENGINEERING',
    recordId: bbs.id
  });

  res.json(bbs);
};

exports.approveBBS = async (req, res) => {
  await withTx(t =>
    service.approveBBS(req.params.id, t)
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_BBS',
    module: 'ENGINEERING',
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= DRAWINGS ================= */

exports.createDrawing = async (req, res) => {
  const drawing = await withTx(t =>
    service.createDrawing(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CREATE_DRAWING',
    module: 'ENGINEERING',
    recordId: drawing.id
  });

  res.json(drawing);
};

exports.reviseDrawing = async (req, res) => {
  const revision = await withTx(t =>
    service.reviseDrawing(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'REVISE_DRAWING',
    module: 'ENGINEERING',
    recordId: revision.id
  });

  res.json(revision);
};

exports.approveDrawing = async (req, res) => {
  await withTx(t =>
    service.approveDrawing(req.params.id, t)
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_DRAWING',
    module: 'ENGINEERING',
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= COMPLIANCE ================= */

exports.addCompliance = async (req, res) => {
  const compliance = await withTx(t =>
    service.addCompliance(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'ADD_COMPLIANCE',
    module: 'ENGINEERING',
    recordId: compliance.id
  });

  res.json(compliance);
};

/* ================= READ ================= */

exports.listBBS = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  res.json(
    await BBS.findAll({ where: { projectId } })
  );
};

exports.listEstimates = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  res.json(
    await Estimate.findAll({ where: { projectId } })
  );
};

exports.getBudget = async (req, res) => {
  const { projectId } = req.params;

  res.json(
    await Budget.findOne({ where: { projectId } })
  );
};
