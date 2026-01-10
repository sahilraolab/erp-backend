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

exports.listBudgets = async (req, res) => {
  const { projectId, status } = req.query;

  const where = {};

  if (projectId) {
    where.projectId = projectId;
  }

  if (status) {
    where.status = status;
  }

  const budgets = await Budget.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  res.json(budgets);
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
    service.createDrawing(
      {
        projectId: req.body.projectId,
        title: req.body.title,
        discipline: req.body.discipline
      },
      t
    )
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

/* ================= DRAWINGS (READ) ================= */

exports.listDrawings = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    return res.status(400).json({ message: 'projectId required' });
  }

  res.json(await service.listDrawings(projectId));
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
  const { projectId } = req.query;

  if (!projectId) {
    return res
      .status(400)
      .json({ message: 'projectId required' });
  }

  res.json(await service.listCompliance(projectId));
};

exports.getCompliance = async (req, res) => {
  const compliance = await service.getComplianceById(req.params.id);
  if (!compliance) {
    return res.status(404).json({ message: 'Compliance not found' });
  }
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

// if (req.file) {
//   req.body.documentRef = `/uploads/compliance/${req.file.originalname}`;
// }


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

exports.exportBudgetTemplate = async (req, res) => {
  res.send(await service.exportBudgetTemplate());
};

exports.exportBudgetData = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) throw new Error('projectId required');
  res.send(await service.exportBudgetData(projectId));
};

exports.exportEstimateData = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) throw new Error('projectId required');
  res.send(await service.exportEstimateData(projectId));
};

exports.exportBBSData = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) throw new Error('projectId required');
  res.send(await service.exportBBSData(projectId));
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
