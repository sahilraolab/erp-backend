const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');
const service = require('./engineering.service');
const BBS = require('./bbs.model');
const Estimate = require('./estimate.model');
const Budget = require('./budget.model');

/* ================= BUDGET ================= */

exports.createBudget = async (req, res) => {
  const budget = await service.createBudget(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_BUDGET',
    module: 'ENGINEERING',
    recordId: budget.id
  });

  res.json(budget);
};

exports.approveBudget = async (req, res) => {
  await service.approveBudget(req.params.id);

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
  const estimate = await withTx(async (t) => {
    return service.createEstimate(req.body, t);
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_ESTIMATE',
    module: 'ENGINEERING',
    recordId: estimate.id
  });

  res.json(estimate);
};

exports.addEstimateVersion = async (req, res) => {
  const version = await service.addEstimateVersion(req.body);

  await audit({
    userId: req.user.id,
    action: 'ADD_ESTIMATE_VERSION',
    module: 'ENGINEERING',
    recordId: version.id
  });

  res.json(version);
};

exports.approveEstimate = async (req, res) => {
  await service.approveEstimate(req.params.id);

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
  const bbs = await service.createBBS(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_BBS',
    module: 'ENGINEERING',
    recordId: bbs.id
  });

  res.json(bbs);
};

/* ================= DRAWINGS ================= */

exports.createDrawing = async (req, res) => {
  const drawing = await service.createDrawing(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_DRAWING',
    module: 'ENGINEERING',
    recordId: drawing.id
  });

  res.json(drawing);
};

exports.reviseDrawing = async (req, res) => {
  const revision = await service.reviseDrawing(req.body);

  await audit({
    userId: req.user.id,
    action: 'REVISE_DRAWING',
    module: 'ENGINEERING',
    recordId: revision.id
  });

  res.json(revision);
};

exports.approveDrawing = async (req, res) => {
  await service.approveDrawing(req.params.id);

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
  const compliance = await service.addCompliance(req.body);

  await audit({
    userId: req.user.id,
    action: 'ADD_COMPLIANCE',
    module: 'ENGINEERING',
    recordId: compliance.id
  });

  res.json(compliance);
};

exports.listBBS = async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({
      message: 'projectId query parameter is required'
    });
  }

  const bbs = await BBS.findAll({
    where: { projectId }
  });

  res.json(bbs);
};

exports.listEstimates = async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({
      message: 'projectId query parameter is required'
    });
  }

  const estimates = await Estimate.findAll({
    where: { projectId }
  });

  res.json(estimates);
};

exports.getBudget = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      message: 'projectId param is required'
    });
  }

  const budget = await Budget.findOne({
    where: { projectId }
  });

  res.json(budget);
};
