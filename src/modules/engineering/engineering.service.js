const Budget = require('./budget.model');
const BudgetAccountMap = require('./budgetAccountMap.model');
const Estimate = require('./estimate.model');
const EstimateVersion = require('./estimateVersion.model');
const BBS = require('./bbs.model');
const Drawing = require('./drawing.model');
const DrawingRevision = require('./drawingRevision.model');
const Compliance = require('./compliance.model');

/* =====================================================
   INTERNAL HELPERS
===================================================== */

const ensureEditable = (record, lockedStatuses, message) => {
  if (lockedStatuses.includes(record.status)) {
    throw new Error(message);
  }
};

/* =====================================================
   BUDGET
===================================================== */

exports.createBudget = async (data, t) => {
  return Budget.create(
    { ...data, status: 'DRAFT' },
    { transaction: t }
  );
};

exports.approveBudget = async (id, t) => {
  const budget = await Budget.findByPk(id, { transaction: t });
  if (!budget) throw new Error('Budget not found');

  ensureEditable(
    budget,
    ['APPROVED', 'LOCKED'],
    'Budget already approved'
  );

  // Lock previously approved budget for the same project
  await Budget.update(
    { status: 'LOCKED' },
    {
      where: {
        projectId: budget.projectId,
        status: 'APPROVED'
      },
      transaction: t
    }
  );

  return budget.update(
    { status: 'APPROVED' },
    { transaction: t }
  );
};

/* =====================================================
   ESTIMATE
===================================================== */

exports.createEstimate = async (data, t) => {
  const estimate = await Estimate.create(
    {
      projectId: data.projectId,
      name: data.name,
      status: 'DRAFT'
    },
    { transaction: t }
  );

  await EstimateVersion.create(
    {
      estimateId: estimate.id,
      versionNo: 1,
      amount: data.baseAmount,
      isApproved: false
    },
    { transaction: t }
  );

  return estimate;
};

exports.addEstimateVersion = async (data, t) => {
  const estimate = await Estimate.findByPk(data.estimateId, { transaction: t });
  if (!estimate) throw new Error('Estimate not found');

  ensureEditable(
    estimate,
    ['FINAL'],
    'Final estimate cannot be modified'
  );

  const last = await EstimateVersion.findOne({
    where: { estimateId: estimate.id },
    order: [['versionNo', 'DESC']],
    transaction: t
  });

  return EstimateVersion.create(
    {
      estimateId: estimate.id,
      versionNo: last.versionNo + 1,
      amount: data.amount,
      isApproved: false
    },
    { transaction: t }
  );
};

exports.approveEstimate = async (estimateId, t) => {
  const estimate = await Estimate.findByPk(estimateId, { transaction: t });
  if (!estimate) throw new Error('Estimate not found');

  const latestVersion = await EstimateVersion.findOne({
    where: { estimateId },
    order: [['versionNo', 'DESC']],
    transaction: t
  });

  if (!latestVersion) {
    throw new Error('No estimate version found');
  }

  // Reset previously approved versions
  await EstimateVersion.update(
    { isApproved: false },
    { where: { estimateId }, transaction: t }
  );

  await latestVersion.update(
    { isApproved: true },
    { transaction: t }
  );

  return estimate.update(
    {
      status: 'FINAL',
      approvedVersionId: latestVersion.id
    },
    { transaction: t }
  );
};

/* =====================================================
   BBS (BOQ)
===================================================== */

exports.createBBS = async (data, t) => {
  const estimate = await Estimate.findByPk(data.estimateId, { transaction: t });

  if (!estimate || estimate.status !== 'FINAL') {
    throw new Error('BBS can be created only from approved estimate');
  }

  return BBS.create(
    {
      projectId: data.projectId,
      estimateId: data.estimateId,
      code: data.code,
      description: data.description,
      quantity: data.quantity,
      uomId: data.uomId,
      rate: data.rate,
      status: 'DRAFT'
    },
    { transaction: t }
  );
};

exports.approveBBS = async (bbsId, t) => {
  const bbs = await BBS.findByPk(bbsId, { transaction: t });
  if (!bbs) throw new Error('BBS not found');

  ensureEditable(
    bbs,
    ['APPROVED', 'LOCKED'],
    'BBS already approved'
  );

  return bbs.update(
    { status: 'APPROVED' },
    { transaction: t }
  );
};

/**
 * 🔒 SINGLE SOURCE OF TRUTH FOR EXECUTION QUANTITY
 * Called ONLY by:
 * - WorkOrder
 * - RA Bill
 * - DPR
 */
exports.consumeBBSQty = async ({ bbsId, qty }, t) => {
  const bbs = await BBS.findByPk(bbsId, {
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  if (!bbs) throw new Error('BBS not found');
  if (bbs.status !== 'APPROVED') {
    throw new Error('BBS not approved for execution');
  }

  const newExecuted =
    Number(bbs.executedQty) + Number(qty);

  if (newExecuted > Number(bbs.quantity)) {
    throw new Error('BOQ quantity exceeded');
  }

  await bbs.update(
    { executedQty: newExecuted },
    { transaction: t }
  );
};

/* =====================================================
   DRAWINGS
===================================================== */

exports.createDrawing = async (data, t) => {
  return Drawing.create(data, { transaction: t });
};

exports.reviseDrawing = async (data, t) => {
  const drawing = await Drawing.findByPk(data.drawingId, { transaction: t });
  if (!drawing) throw new Error('Drawing not found');

  ensureEditable(
    drawing,
    ['APPROVED'],
    'Approved drawing cannot be revised'
  );

  return DrawingRevision.create(
    {
      drawingId: data.drawingId,
      revisionNo: data.revisionNo,
      changeNote: data.changeNote
    },
    { transaction: t }
  );
};

exports.approveDrawing = async (drawingId, t) => {
  return Drawing.update(
    { status: 'APPROVED' },
    { where: { id: drawingId }, transaction: t }
  );
};

/* =====================================================
   COMPLIANCE
===================================================== */

exports.addCompliance = async (data, t) => {
  return Compliance.create(data, { transaction: t });
};

/**
 * 🚫 HARD BLOCK CHECK
 */
exports.ensureComplianceClear = async (projectId, t) => {
  const blocking = await Compliance.findOne({
    where: {
      projectId,
      status: 'OPEN',
      blocking: true
    },
    transaction: t
  });

  if (blocking) {
    throw new Error(
      'Blocking compliance pending. Execution not allowed.'
    );
  }
};

/* =====================================================
   BUDGET CONTROL (Accounts Integration)
===================================================== */

exports.ensureBudgetAvailable = async (
  { budgetHeadId, amount },
  t
) => {
  const map = await BudgetAccountMap.findOne({
    where: { budgetHeadId },
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  if (!map) return; // No mapping = unrestricted

  const remaining =
    Number(map.limitAmount) - Number(map.consumedAmount);

  if (amount > remaining) {
    throw new Error('Budget limit exceeded');
  }

  await map.increment(
    { consumedAmount: amount },
    { transaction: t }
  );
};
