const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');
const service = require('./engineering.service');

const BBS = require('./bbs.model');
const Estimate = require('./estimate.model');
const Budget = require('./budget.model');
const Compliance = require('./compliance.model');

/* =====================================================
   HELPERS (MANDATORY GUARDS)
===================================================== */

const assertEditable = (entity, name) => {
  if (!entity) {
    throw new Error(`${name} not found`);
  }
  if (entity.status === 'APPROVED' || entity.status === 'LOCKED') {
    throw new Error(`${name} is locked and cannot be modified`);
  }
};

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
    recordId: budget.id,
    meta: { projectId: budget.projectId }
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

  if (!projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  const where = { projectId };
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
    recordId: estimate.id,
    meta: { projectId: estimate.projectId }
  });

  res.json(estimate);
};

exports.addEstimateVersion = async (req, res) => {
  const estimate = await Estimate.findByPk(req.body.estimateId);
  assertEditable(estimate, 'Estimate');

  const version = await withTx(t =>
    service.addEstimateVersion(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'ADD_ESTIMATE_VERSION',
    module: 'ENGINEERING',
    recordId: version.id,
    meta: { projectId: estimate.projectId }
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
  if (!req.query.projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  res.json(
    await Estimate.findAll({
      where: { projectId: req.query.projectId },
      order: [['createdAt', 'DESC']]
    })
  );
};

/* =====================================================
   BBS
===================================================== */

exports.createBBS = async (req, res) => {
  const estimate = await Estimate.findByPk(req.body.estimateId);
  assertEditable(estimate, 'Estimate');

  const bbs = await withTx(t =>
    service.createBBS(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CREATE_BBS',
    module: 'ENGINEERING',
    recordId: bbs.id,
    meta: { projectId: bbs.projectId }
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
  if (!req.query.projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  res.json(
    await BBS.findAll({
      where: { projectId: req.query.projectId },
      order: [['createdAt', 'DESC']]
    })
  );
};

/* =====================================================
   DRAWINGS
===================================================== */

exports.createDrawing = async (req, res) => {
  if (req.file) {
    req.body.fileName = req.file.originalname;
    req.body.fileMime = req.file.mimetype;
    req.body.fileSize = req.file.size;
    req.body.fileData = req.file.buffer;
  }

  const drawing = await withTx(t =>
    service.createDrawing(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'CREATE_DRAWING',
    module: 'ENGINEERING',
    recordId: drawing.id,
    meta: { projectId: drawing.projectId }
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
  if (!req.query.projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  res.json(await service.listDrawings(req.query.projectId));
};

/* =====================================================
   COMPLIANCE
===================================================== */

exports.addCompliance = async (req, res) => {
  if (req.file) {
    req.body.fileName = req.file.originalname;
    req.body.fileMime = req.file.mimetype;
    req.body.fileSize = req.file.size;
    req.body.fileData = req.file.buffer;
  }

  const compliance = await withTx(t =>
    service.addCompliance(req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'ADD_COMPLIANCE',
    module: 'ENGINEERING',
    recordId: compliance.id,
    meta: { projectId: compliance.projectId }
  });

  res.json(compliance);
};

exports.updateCompliance = async (req, res) => {
  const compliance = await Compliance.findByPk(req.params.id);
  if (!compliance) {
    return res.status(404).json({ message: 'Compliance not found' });
  }
  if (compliance.status === 'CLOSED') {
    return res.status(400).json({ message: 'Closed compliance cannot be modified' });
  }

  const updated = await withTx(t =>
    service.updateCompliance(req.params.id, req.body, t)
  );

  await audit({
    userId: req.user.id,
    action: 'UPDATE_COMPLIANCE',
    module: 'ENGINEERING',
    recordId: updated.id,
    meta: { projectId: updated.projectId }
  });

  res.json(updated);
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
  if (!req.query.projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

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
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file required' });
  }

  res.json(await withTx(t =>
    service.importEstimateExcel(req.file, t)
  ));
};

exports.importBBSExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file required' });
  }

  res.json(await withTx(t =>
    service.importBBSExcel(req.file, t)
  ));
};

exports.importBudgetExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file required' });
  }

  res.json(await withTx(t =>
    service.importBudgetExcel(req.file, t)
  ));
};

const sendExcel = (res, buffer, filename) => {
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.send(buffer);
};

exports.exportBudgetTemplate = async (_, res) => {
  sendExcel(res, await service.exportBudgetTemplate(), 'budget_template.xlsx');
};

exports.exportBudgetData = async (req, res) => {
  sendExcel(res, await service.exportBudgetData(req.query.projectId), 'budget.xlsx');
};

exports.exportEstimateData = async (req, res) => {
  sendExcel(res, await service.exportEstimateData(req.query.projectId), 'estimate.xlsx');
};

exports.exportBBSData = async (req, res) => {
  sendExcel(res, await service.exportBBSData(req.query.projectId), 'bbs.xlsx');
};

exports.exportEstimateTemplate = async (_, res) => {
  sendExcel(res, await service.exportEstimateTemplate(), 'estimate_template.xlsx');
};

exports.exportBBSTemplate = async (_, res) => {
  sendExcel(res, await service.exportBBSTemplate(), 'bbs_template.xlsx');
};
