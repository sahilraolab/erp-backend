const Budget = require('./budget.model');
const Estimate = require('./estimate.model');
const EstimateVersion = require('./estimateVersion.model');
const BBS = require('./bbs.model');
const Drawing = require('./drawing.model');
const DrawingRevision = require('./drawingRevision.model');
const Compliance = require('./compliance.model');


const ensureEditable = (record, lockedStatus, message) => {
  if (record.status === lockedStatus) {
    throw new Error(message);
  }
};

/* ================= BUDGET ================= */

exports.createBudget = async (data, t) => {
  return Budget.create({ ...data, status: 'DRAFT' }, { transaction: t });
};

exports.approveBudget = async (id, t) => {
  const budget = await Budget.findByPk(id);
  if (!budget) throw new Error('Budget not found');

  ensureEditable(budget, 'APPROVED', 'Approved budget cannot be modified');

  return budget.update(
    { status: 'APPROVED' },
    { transaction: t }
  );
};

/* ================= ESTIMATE ================= */

exports.createEstimate = async (data, t) => {
  const estimate = await Estimate.create(
    { ...data, status: 'DRAFT' },
    { transaction: t }
  );

  await EstimateVersion.create(
    {
      estimateId: estimate.id,
      versionNo: 1,
      amount: estimate.baseAmount
    },
    { transaction: t }
  );

  return estimate;
};

exports.addEstimateVersion = async (data, t) => {
  const estimate = await Estimate.findByPk(data.estimateId);
  if (!estimate) throw new Error('Estimate not found');

  ensureEditable(
    estimate,
    'FINAL',
    'Finalized estimate cannot be modified'
  );

  return EstimateVersion.create(data, { transaction: t });
};

exports.approveEstimate = async (id, t) => {
  const estimate = await Estimate.findByPk(id);
  if (!estimate) throw new Error('Estimate not found');

  return estimate.update(
    { status: 'FINAL' },
    { transaction: t }
  );
};

/* ================= BBS ================= */

exports.createBBS = async (data, t) => {
  return BBS.create(data, { transaction: t });
};

/* ================= DRAWINGS ================= */

exports.createDrawing = async (data, t) => {
  return Drawing.create(data, { transaction: t });
};

exports.reviseDrawing = async (data, t) => {
  const drawing = await Drawing.findByPk(data.drawingId);
  if (!drawing) throw new Error('Drawing not found');

  ensureEditable(
    drawing,
    'APPROVED',
    'Approved drawing cannot be revised'
  );

  return DrawingRevision.create(data, { transaction: t });
};

exports.approveDrawing = async (id, t) => {
  return Drawing.update(
    { status: 'APPROVED' },
    { where: { id }, transaction: t }
  );
};

/* ================= COMPLIANCE ================= */

exports.addCompliance = async (data, t) => {
  return Compliance.create(data, { transaction: t });
};