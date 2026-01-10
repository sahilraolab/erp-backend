const { readExcel, writeExcel } = require('../../core/excel.helper');
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


exports.exportEstimateTemplate = async () => {
  return writeExcel([], ['projectId', 'name', 'baseAmount']);
};

exports.importEstimateExcel = async (file, t) => {
  const rows = readExcel(file.buffer);

  if (!rows.length) throw new Error('Empty Excel');

  const created = [];

  for (const r of rows) {
    if (!r.projectId || !r.baseAmount) {
      throw new Error('projectId and baseAmount required');
    }

    const est = await Estimate.create({
      projectId: r.projectId,
      name: r.name,
      baseAmount: r.baseAmount,
      status: 'DRAFT'
    }, { transaction: t });

    await EstimateVersion.create({
      estimateId: est.id,
      versionNo: 1,
      amount: r.baseAmount,
      isApproved: false
    }, { transaction: t });

    created.push(est);
  }

  return created;
};

exports.createEstimate = async (data, t) => {
  if (data.baseAmount == null) {
    throw new Error('Base amount is required');
  }

  const estimate = await Estimate.create(
    {
      projectId: data.projectId,
      name: data.name,
      baseAmount: data.baseAmount,
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

  const lastVersionNo = await EstimateVersion.max('versionNo', {
    where: { estimateId: estimate.id },
    transaction: t
  });

  const nextVersionNo = (lastVersionNo || 0) + 1;

  const version = await EstimateVersion.create(
    {
      estimateId: estimate.id,
      versionNo: nextVersionNo,
      amount: data.amount,
      isApproved: false
    },
    { transaction: t }
  );

  // 🔥 IMPORTANT: reset approval & update base
  await estimate.update(
    {
      baseAmount: data.amount,
      status: 'DRAFT',
      approvedVersionId: null
    },
    { transaction: t }
  );

  return version;
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

exports.exportBBSTemplate = async () => {
  return writeExcel([], [
    'projectId',
    'estimateId',
    'description',
    'quantity',
    'uomId',
    'rate'
  ]);
};

exports.importBBSExcel = async (file, t) => {
  const rows = readExcel(file.buffer);
  if (!rows.length) throw new Error('Empty BOQ Excel');

  const created = [];

  for (const r of rows) {
    if (!r.projectId || !r.estimateId || !r.quantity || !r.rate) {
      throw new Error('Invalid BOQ row');
    }

    const bbs = await BBS.create({
      projectId: r.projectId,
      estimateId: r.estimateId,
      description: r.description,
      quantity: r.quantity,
      uomId: r.uomId,
      rate: r.rate,
      status: 'DRAFT'
    }, { transaction: t });

    created.push(bbs);
  }

  return created;
};

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

  // 🔢 Get next drawing number per project
  const lastNo = await Drawing.max('drawingNo', {
    where: { projectId: data.projectId },
    transaction: t
  });

  const nextNo = lastNo ? Number(lastNo) + 1 : 1;

  return Drawing.create(
    {
      projectId: data.projectId,
      drawingNo: String(nextNo), // 🔥 REQUIRED
      title: data.title,
      discipline: data.discipline,
      status: 'DRAFT'
    },
    { transaction: t }
  );
};


exports.reviseDrawing = async (data, t) => {
  const drawing = await Drawing.findByPk(data.drawingId, { transaction: t });
  if (!drawing) throw new Error('Drawing not found');

  ensureEditable(
    drawing,
    ['APPROVED'],
    'Approved drawing cannot be revised'
  );

  const lastRevisionNo = await DrawingRevision.max('revisionNo', {
    where: { drawingId: data.drawingId },
    transaction: t
  });

  const nextRevisionNo = (lastRevisionNo || 0) + 1;

  return DrawingRevision.create(
    {
      drawingId: data.drawingId,
      revisionNo: nextRevisionNo,
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

exports.listDrawings = async (projectId) => {
  return Drawing.findAll({
    where: { projectId },
    order: [['createdAt', 'DESC']]
  });
};

/* =====================================================
   COMPLIANCE
===================================================== */

exports.addCompliance = async (data, t) => {
  if (!data.projectId || !data.type) {
    throw new Error('projectId and type are required');
  }

  return Compliance.create(
    {
      projectId: data.projectId,
      type: data.type,
      documentRef: data.documentRef || null,
      validTill: data.validTill || null,
      blocking:
        data.blocking !== undefined ? data.blocking : true,
      status: 'OPEN'
    },
    { transaction: t }
  );
};

exports.updateCompliance = async (id, data, t) => {
  const compliance = await Compliance.findByPk(id, {
    transaction: t
  });

  if (!compliance) {
    throw new Error('Compliance not found');
  }

  if (compliance.status === 'CLOSED') {
    throw new Error('Closed compliance cannot be modified');
  }

  return compliance.update(
    {
      type: data.type,
      documentRef: data.documentRef || null,
      validTill: data.validTill || null,
      blocking:
        data.blocking !== undefined
          ? data.blocking
          : compliance.blocking
    },
    { transaction: t }
  );
};

exports.closeCompliance = async (id, t) => {
  const compliance = await Compliance.findByPk(id, {
    transaction: t
  });

  if (!compliance) {
    throw new Error('Compliance not found');
  }

  if (compliance.status === 'CLOSED') {
    throw new Error('Compliance already closed');
  }

  return compliance.update(
    { status: 'CLOSED' },
    { transaction: t }
  );
};

exports.listCompliance = async (projectId) => {
  return Compliance.findAll({
    where: { projectId },
    order: [['createdAt', 'DESC']]
  });
};

exports.getComplianceById = async (id) => {
  return Compliance.findByPk(id);
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

exports.exportBudgetTemplate = async () => {
  return writeExcel([], [
    'projectId',
    'accountId',
    'limitAmount'
  ]);
};

exports.importBudgetExcel = async (file, t) => {
  const rows = readExcel(file.buffer);
  if (!rows.length) throw new Error('Empty Budget Excel');

  const budgets = {};

  for (const r of rows) {
    if (!r.projectId || !r.accountId || !r.limitAmount) {
      throw new Error('Invalid budget row');
    }

    if (!budgets[r.projectId]) {
      budgets[r.projectId].totalBudget =
        Number(budgets[r.projectId].totalBudget) + Number(r.limitAmount);

      await budgets[r.projectId].save({ transaction: t });
    }

    await BudgetAccountMap.create({
      budgetId: budgets[r.projectId].id,
      accountId: r.accountId,
      limitAmount: r.limitAmount
    }, { transaction: t });
  }

  return Object.values(budgets);
};

exports.ensureBudgetAvailable = async (
  { budgetHeadId, amount },
  t
) => {
  const map = await BudgetAccountMap.findOne({
    where: { accountId: budgetHeadId },
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
