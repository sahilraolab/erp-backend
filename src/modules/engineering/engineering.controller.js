const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');
const service = require('./engineering.service');
const BBS = require('./bbs.model');
const Estimate = require('./estimate.model');
const Budget = require('./budget.model');

/* =====================================================
   BUDGET
===================================================== */

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

exports.listBudgets = async (req, res) => {
  const { projectId, status } = req.query;
  const where = {};

  if (projectId) where.projectId = projectId;
  if (status) where.status = status;

  res.json(
    await Budget.findAll({
      where,
      order: [['createdAt', 'DESC']]
    })
  );
};

exports.getBudget = async (req, res) => {
  res.json(
    await Budget.findOne({ where: { projectId: req.params.projectId } })
  );
};

/* =====================================================
   ESTIMATE
===================================================== */

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

exports.listEstimates = async (req, res) => {
  res.json(
    await Estimate.findAll({ where: { projectId: req.query.projectId } })
  );
};

/* =====================================================
   BBS
===================================================== */

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

exports.listBBS = async (req, res) => {
  res.json(
    await BBS.findAll({ where: { projectId: req.query.projectId } })
  );
};

/* =====================================================
   DRAWINGS
===================================================== */

exports.createDrawing = async (req, res) => {

  if (req.file) {
    req.body.documentName = req.file.originalname;
    req.body.documentMime = req.file.mimetype;
    req.body.documentSize = req.file.size;
    req.body.documentData = req.file.buffer;
  }

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

exports.approveDrawingRevision = async (req, res) => {
  const revision = await withTx(t =>
    service.approveDrawingRevision(req.params.id, t)
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_DRAWING_REVISION',
    module: 'ENGINEERING',
    recordId: req.params.id
  });

  res.json(revision);
};

exports.listDrawings = async (req, res) => {
  res.json(await service.listDrawings(req.query.projectId));
};

/* =====================================================
   COMPLIANCE
===================================================== */

exports.addCompliance = async (req, res) => {

  if (req.file) {
    req.body.documentName = req.file.originalname;
    req.body.documentMime = req.file.mimetype;
    req.body.documentSize = req.file.size;
    req.body.documentData = req.file.buffer;
  }

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

exports.updateCompliance = async (req, res) => {
  const compliance = await withTx(t =>
    service.updateCompliance(req.params.id, req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'UPDATE_COMPLIANCE',
    module: 'ENGINEERING',
    recordId: compliance.id
  });

  res.json(compliance);
};

exports.closeCompliance = async (req, res) => {
  await withTx(t =>
    service.closeCompliance(req.params.id, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CLOSE_COMPLIANCE',
    module: 'ENGINEERING',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.listCompliance = async (req, res) => {
  res.json(await service.listCompliance(req.query.projectId));
};

exports.getCompliance = async (req, res) => {
  const compliance = await service.getComplianceById(req.params.id);
  if (!compliance) {
    return res.status(404).json({ message: 'Compliance not found' });
  }
  res.json(compliance);
};

/* =====================================================
   IMPORT / EXPORT
===================================================== */

exports.importEstimateExcel = async (req, res) => {
  res.json(await withTx(t =>
    service.importEstimateExcel(req.file, t)
  ));
};

exports.importBBSExcel = async (req, res) => {
  res.json(await withTx(t =>
    service.importBBSExcel(req.file, t)
  ));
};

exports.importBudgetExcel = async (req, res) => {
  res.json(await withTx(t =>
    service.importBudgetExcel(req.file, t)
  ));
};

exports.exportBudgetTemplate = async (_, res) => {
  res.send(await service.exportBudgetTemplate());
};

exports.exportBudgetData = async (req, res) => {
  res.send(await service.exportBudgetData(req.query.projectId));
};

exports.exportEstimateData = async (req, res) => {
  res.send(await service.exportEstimateData(req.query.projectId));
};

exports.exportBBSData = async (req, res) => {
  res.send(await service.exportBBSData(req.query.projectId));
};

exports.exportEstimateTemplate = async (_, res) => {
  res.send(await service.exportEstimateTemplate());
};

exports.exportBBSTemplate = async (_, res) => {
  res.send(await service.exportBBSTemplate());
};
