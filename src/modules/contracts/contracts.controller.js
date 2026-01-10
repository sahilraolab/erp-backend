const audit = require('../../core/audit');

const Contractor = require('./contractor.model');
const LabourRate = require('./labourRate.model');

const WorkOrder = require('./workOrder.model');
const WorkOrderLine = require('./workOrderLine.model');
const WorkOrderRevision = require('./workOrderRevision.model');

const RABill = require('./raBill.model');
const RABillLine = require('./raBillLine.model');

const Advance = require('./advance.model');
const DCNote = require('./debitCreditNote.model');

const workflow = require('../workflow/workflow.service');
const { ensureApproved } = require('../workflow/workflow.helper');
const posting = require('../accounts/posting.service');

const engineeringService = require('../engineering/engineering.service');

const withTx = require('../../core/withTransaction');


const genNo = (p) => `${p}-${Date.now()}`;

/* ================= CONTRACTOR ================= */

exports.createContractor = async (req, res) => {
  const c = await Contractor.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_CONTRACTOR',
    module: 'CONTRACTS',
    recordId: c.id
  });

  res.json(c);
};

/* ================= LABOUR ================= */

exports.addLabourRate = async (req, res) => {
  res.json(await LabourRate.create(req.body));
};

/* ================= WORK ORDER ================= */

exports.createWO = async (req, res) => {
  const { lines, ...header } = req.body;

  const wo = await WorkOrder.create({
    woNo: genNo('WO'),
    ...header
  });

  for (const l of lines) {
    await WorkOrderLine.create({
      workOrderId: wo.id,
      ...l
    });
  }

  await workflow.start({
    module: 'CONTRACTS',
    entity: 'WORK_ORDER',
    recordId: wo.id
  });

  res.json({
    wo,
    message: 'Work Order sent for approval'
  });
};

exports.approveWO = async (req, res) => {

  await ensureApproved('CONTRACTS', 'WORK_ORDER', req.params.id);

  await WorkOrder.update(
    { status: 'APPROVED', locked: true },
    { where: { id: req.params.id } }
  );

  res.json({ success: true });
};

exports.reviseWO = async (req, res) => {
  const { workOrderId, revisedValue, reason } = req.body;

  const wo = await WorkOrder.findByPk(workOrderId);
  if (!wo) throw new Error('Work Order not found');
  if (wo.status !== 'APPROVED') {
    throw new Error('Only approved Work Orders can be revised');
  }

  const lastRev = await WorkOrderRevision.findOne({
    where: { workOrderId },
    order: [['revisionNo', 'DESC']]
  });

  const revisionNo = lastRev ? lastRev.revisionNo + 1 : 1;

  const rev = await WorkOrderRevision.create({
    workOrderId,
    revisionNo,
    revisedValue,
    reason
  });

  await wo.update({ totalValue: revisedValue });

  await audit({
    userId: req.user.id,
    action: 'REVISE_WORK_ORDER',
    module: 'CONTRACTS',
    recordId: rev.id
  });

  res.json(rev);
};

/* ================= RA BILL ================= */

exports.createRABill = async (req, res) => {
  const { lines, ...header } = req.body;

  const existing = await RABill.findOne({
    where: {
      workOrderId: header.workOrderId,
      status: ['DRAFT', 'APPROVED']
    }
  });

  if (existing) {
    throw new Error('Pending RA Bill already exists for this Work Order');
  }

  const bill = await withTx(async (t) => {
    const bill = await RABill.create({
      billNo: genNo('RA'),
      billDate: new Date(),
      ...header
    }, { transaction: t });

    let gross = 0;

    for (const l of lines) {
      const wol = await WorkOrderLine.findByPk(l.workOrderLineId, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      if (!wol) throw new Error('Invalid WO line');

      // 🔒 SINGLE SOURCE OF TRUTH
      await engineeringService.consumeBBSQty({
        bbsId: wol.bbsId,
        qty: l.currentQty
      }, t);

      const newExecuted = Number(wol.executedQty) + Number(l.currentQty);
      if (newExecuted > Number(wol.qty)) {
        throw new Error(`Over-billing detected for WO line ${wol.id}`);
      }

      const line = await RABillLine.create({
        raBillId: bill.id,
        workOrderLineId: wol.id,
        previousQty: l.previousQty || wol.executedQty,
        currentQty: l.currentQty,
        rate: wol.rate
      }, { transaction: t });

      await wol.update({ executedQty: newExecuted }, { transaction: t });

      gross += Number(line.amount);
    }

    await bill.update({ grossAmount: gross }, { transaction: t });

    await workflow.start({
      module: 'CONTRACTS',
      entity: 'RA_BILL',
      recordId: bill.id
    });

    return bill;
  });

  res.json({ bill, message: 'RA Bill sent for approval' });
};

exports.approveRABill = async (req, res) => {
  await ensureApproved('CONTRACTS', 'RA_BILL', req.params.id);

  await RABill.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );

  res.json({ success: true });
};

exports.postRABill = async (req, res) => {
  const raId = req.params.id;

  await ensureApproved('CONTRACTS', 'RA_BILL', raId);

  const ra = await RABill.findByPk(raId, {
    include: [{ model: WorkOrder }]
  });

  if (!ra || ra.postedToAccounts) {
    throw new Error('Invalid or already posted RA Bill');
  }

  const wo = ra.work_order;

  /* Advances */
  const advances = await Advance.findAll({
    where: { workOrderId: wo.id }
  });

  /* Retention */
  let retention =
    (Number(ra.grossAmount) * Number(wo.retentionPercent)) / 100;

  /* Advance Recovery */
  let recovery = 0;

  for (const a of advances) {
    if (a.balanceAmount <= 0) continue;

    const adj = Math.min(a.balanceAmount, ra.grossAmount * 0.1);
    a.adjustedAmount += adj;
    await a.save();
    recovery += adj;
  }

  /* Final Bill Logic */
  if (ra.isFinalBill) {
    retention = 0;

    for (const a of advances) {
      a.adjustedAmount = a.amount;
      await a.save();
    }

    await wo.update({ status: 'CLOSED' });
  }

  const net = ra.grossAmount - retention - recovery;

  await posting.postVoucher({
    type: 'JV',
    narration: `RA Bill ${ra.billNo}`,
    debitAccountCode: 'CONSTRUCTION_WIP',
    creditAccountCode: 'CONTRACTOR_PAYABLE',
    amount: net,
    userId: req.user.id,
    reference: `RA_BILL:${ra.id}`
  });

  await ra.update({
    retentionAmount: retention,
    advanceRecovery: recovery,
    netPayable: net,
    postedToAccounts: true,
    status: 'POSTED'
  });

  res.json({ success: true });
};

/* ================= ADVANCE ================= */

exports.createAdvance = async (req, res) => {
  const wo = await WorkOrder.findByPk(req.body.workOrderId);
  if (!wo || wo.status !== 'APPROVED') {
    throw new Error('Advance allowed only for approved Work Orders');
  }

  res.json(await Advance.create(req.body));
};

/* ================= DEBIT / CREDIT ================= */

exports.createDCNote = async (req, res) => {
  const note = await DCNote.create({
    noteNo: genNo('DC'),
    createdBy: req.user.id,
    ...req.body
  });

  await workflow.start({
    module: 'CONTRACTS',
    entity: 'DC_NOTE',
    recordId: note.id
  });

  res.json(note);
};

exports.postDCNote = async (req, res) => {
  const note = await DCNote.findByPk(req.params.id);

  if (!note || note.postedToAccounts) {
    throw new Error('Invalid or already posted DC Note');
  }

  await ensureApproved('CONTRACTS', 'DC_NOTE', note.id);

  await posting.postVoucher({
    type: 'JV',
    narration: `${note.type} Note ${note.noteNo}`,
    debitAccountCode:
      note.type === 'DEBIT'
        ? 'CONTRACTOR_EXPENSE'
        : 'CONTRACTOR_PAYABLE',
    creditAccountCode:
      note.type === 'DEBIT'
        ? 'CONTRACTOR_PAYABLE'
        : 'CONTRACTOR_EXPENSE',
    amount: note.amount,
    userId: req.user.id,
    reference: `DC_NOTE:${note.id}`
  });

  await note.update({
    status: 'POSTED',
    postedToAccounts: true
  });

  res.json({ success: true });
};
