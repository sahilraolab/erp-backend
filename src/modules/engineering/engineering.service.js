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
   HELPERS
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
  return Budget.create({ ...data, totalBudget: data.totalBudget || 0, status: 'DRAFT' }, { transaction: t });
};

exports.approveBudget = async (id, t) => {
  const budget = await Budget.findByPk(id, { transaction: t });
  if (!budget) throw new Error('Budget not found');

  ensureEditable(budget, ['APPROVED', 'LOCKED'], 'Budget already approved');

  await Budget.update(
    { status: 'LOCKED' },
    { where: { projectId: budget.projectId, status: 'APPROVED' }, transaction: t }
  );

  return budget.update({ status: 'APPROVED' }, { transaction: t });
};

/* =====================================================
   ESTIMATE
===================================================== */

exports.exportEstimateTemplate = async () =>
  writeExcel([], ['projectId', 'name', 'baseAmount']);

exports.importEstimateExcel = async (file, t) => {
  const rows = readExcel(file.buffer);
  if (!rows.length) throw new Error('Empty Excel');

  const created = [];
  for (const r of rows) {
    const estimate = await exports.createEstimate(r, t);
    created.push(estimate);
  }
  return created;
};

exports.createEstimate = async (data, t) => {
  if (data.baseAmount == null) throw new Error('Base amount is required');

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
      amount: data.baseAmount
    },
    { transaction: t }
  );

  return estimate;
};

exports.addEstimateVersion = async (data, t) => {
  const estimate = await Estimate.findByPk(data.estimateId, { transaction: t });
  if (!estimate) throw new Error('Estimate not found');

  ensureEditable(estimate, ['FINAL'], 'Final estimate cannot be modified');

  const versionNo =
    (await EstimateVersion.max('versionNo', {
      where: { estimateId: estimate.id },
      transaction: t
    })) + 1 || 1;

  const version = await EstimateVersion.create(
    { estimateId: estimate.id, versionNo, amount: data.amount },
    { transaction: t }
  );

  await estimate.update(
    { baseAmount: data.amount, status: 'DRAFT', approvedVersionId: null },
    { transaction: t }
  );

  return version;
};

exports.approveEstimate = async (estimateId, t) => {
  const estimate = await Estimate.findByPk(estimateId, { transaction: t });
  if (!estimate) throw new Error('Estimate not found');

  const version = await EstimateVersion.findOne({
    where: { estimateId },
    order: [['versionNo', 'DESC']],
    transaction: t
  });

  await EstimateVersion.update(
    { isApproved: false },
    { where: { estimateId }, transaction: t }
  );

  await version.update({ isApproved: true }, { transaction: t });

  return estimate.update(
    { status: 'FINAL', approvedVersionId: version.id },
    { transaction: t }
  );
};

/* =====================================================
   BBS
===================================================== */

exports.exportBBSTemplate = async () =>
  writeExcel([], ['projectId', 'estimateId', 'description', 'quantity', 'uomId', 'rate']);

exports.importBBSExcel = async (file, t) => {
  const rows = readExcel(file.buffer);
  const created = [];
  for (const r of rows) {
    created.push(await exports.createBBS(r, t));
  }
  return created;
};

exports.createBBS = async (data, t) => {
  const estimate = await Estimate.findByPk(data.estimateId, { transaction: t });
  if (!estimate || estimate.status !== 'FINAL') {
    throw new Error('BBS requires approved estimate');
  }

  return BBS.create({ ...data, status: 'DRAFT' }, { transaction: t });
};

exports.approveBBS = async (id, t) => {
  const bbs = await BBS.findByPk(id, { transaction: t });
  ensureEditable(bbs, ['APPROVED', 'LOCKED'], 'Already approved');
  return bbs.update({ status: 'APPROVED' }, { transaction: t });
};

exports.consumeBBSQty = async ({ bbsId, qty }, t) => {
  const bbs = await BBS.findByPk(bbsId, { transaction: t, lock: t.LOCK.UPDATE });
  const used = Number(bbs.executedQty) + Number(qty);
  if (used > bbs.quantity) throw new Error('BOQ exceeded');

  await bbs.update(
    { executedQty: used, status: used === bbs.quantity ? 'LOCKED' : bbs.status },
    { transaction: t }
  );
};

/* =====================================================
   DRAWINGS
===================================================== */

exports.createDrawing = async (data, t) => {
  const no = (await Drawing.max('drawingNo', { where: { projectId: data.projectId }, transaction: t })) || 0;
  return Drawing.create(
    { ...data, drawingNo: String(no + 1), status: 'DRAFT' },
    { transaction: t }
  );
};

exports.reviseDrawing = async (data, t) => {
  const revNo =
    (await DrawingRevision.max('revisionNo', {
      where: { drawingId: data.drawingId },
      transaction: t
    })) || 0;

  await Drawing.update(
    { status: 'DRAFT' },
    { where: { id: data.drawingId }, transaction: t }
  );

  return DrawingRevision.create(
    { drawingId: data.drawingId, revisionNo: revNo + 1, changeNote: data.changeNote },
    { transaction: t }
  );
};

exports.approveDrawing = async (id, t) =>
  Drawing.update({ status: 'APPROVED' }, { where: { id }, transaction: t });

exports.approveDrawingRevision = async (id, t) => {
  const rev = await DrawingRevision.findByPk(id, { transaction: t });
  await rev.update({ status: 'APPROVED' }, { transaction: t });
  await Drawing.update({ status: 'APPROVED' }, { where: { id: rev.drawingId }, transaction: t });
  return rev;
};

exports.listDrawings = async projectId =>
  Drawing.findAll({ where: { projectId }, order: [['createdAt', 'DESC']] });

/* =====================================================
   COMPLIANCE
===================================================== */

exports.addCompliance = async (data, t) =>
  Compliance.create({ ...data, status: 'OPEN' }, { transaction: t });

exports.updateCompliance = async (id, data, t) => {
  const c = await Compliance.findByPk(id, { transaction: t });
  if (c.status === 'CLOSED') throw new Error('Closed');
  return c.update(data, { transaction: t });
};

exports.closeCompliance = async (id, t) =>
  Compliance.update({ status: 'CLOSED' }, { where: { id }, transaction: t });

exports.listCompliance = async projectId =>
  Compliance.findAll({ where: { projectId }, order: [['createdAt', 'DESC']] });

exports.getComplianceById = async id =>
  Compliance.findByPk(id);

/* =====================================================
   BUDGET CONTROL
===================================================== */

exports.exportBudgetTemplate = async () =>
  writeExcel([], ['projectId', 'accountId', 'limitAmount']);

exports.importBudgetExcel = async (file, t) => {
  const rows = readExcel(file.buffer);
  const budgets = {};

  for (const r of rows) {
    if (!budgets[r.projectId]) {
      budgets[r.projectId] = await Budget.create(
        { projectId: r.projectId, totalBudget: 0, status: 'DRAFT' },
        { transaction: t }
      );
    }

    budgets[r.projectId].totalBudget += Number(r.limitAmount);
    await budgets[r.projectId].save({ transaction: t });

    await BudgetAccountMap.create(
      { budgetId: budgets[r.projectId].id, accountId: r.accountId, limitAmount: r.limitAmount },
      { transaction: t }
    );
  }

  return Object.values(budgets);
};

exports.ensureBudgetAvailable = async ({ accountId, amount }, t) => {
  const map = await BudgetAccountMap.findOne({ where: { accountId }, transaction: t, lock: t.LOCK.UPDATE });
  if (!map) return;
  if (map.consumedAmount + amount > map.limitAmount) {
    throw new Error('Budget exceeded');
  }
  await map.increment({ consumedAmount: amount }, { transaction: t });
};

/* =====================================================
   EXPORT DATA
===================================================== */

exports.exportEstimateData = async projectId =>
  writeExcel((await Estimate.findAll({ where: { projectId } })).map(e => e.toJSON()));

exports.exportBBSData = async projectId =>
  writeExcel((await BBS.findAll({ where: { projectId } })).map(b => b.toJSON()));

exports.exportBudgetData = async projectId => {
  const budget = await Budget.findOne({ where: { projectId }, include: [BudgetAccountMap] });
  if (!budget) return writeExcel([]);
  return writeExcel(
    budget.budget_account_maps.map(m => ({
      projectId,
      accountId: m.accountId,
      limitAmount: m.limitAmount,
      consumedAmount: m.consumedAmount
    }))
  );
};
