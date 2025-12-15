const Budget = require('./budget.model');
const Estimate = require('./estimate.model');
const EstimateVersion = require('./estimateVersion.model');
const BBS = require('./bbs.model');
const Drawing = require('./drawing.model');
const DrawingRevision = require('./drawingRevision.model');
const Compliance = require('./compliance.model');

/* ================= BUDGET ================= */

exports.createBudget = async (data, t) => {
  return Budget.create(
    { ...data, status: 'DRAFT' },
    t ? { transaction: t } : undefined
  );
};

exports.approveBudget = async (id, t) => {
  return Budget.update(
    { status: 'APPROVED' },
    { where: { id }, transaction: t }
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
  return EstimateVersion.create(data, { transaction: t });
};

exports.approveEstimate = async (id, t) => {
  return Estimate.update(
    { status: 'FINAL' },
    { where: { id }, transaction: t }
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
