const audit = require('../../core/audit');

const Contractor = require('./contractor.model');
const LabourRate = require('./labourRate.model');
const WorkOrder = require('./workOrder.model');
const WorkOrderRevision = require('./workOrderRevision.model');
const RABill = require('./raBill.model');
const Advance = require('./advance.model');
const DCNote = require('./debitCreditNote.model');

const workflow = require('../workflow/workflow.service');
const { ensureApproved } = require('../workflow/workflow.helper');
const posting = require('../accounts/posting.service');

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
  const wo = await WorkOrder.create({
    woNo: genNo('WO'),
    ...req.body
  });

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
  await WorkOrder.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );
  res.json({ success: true });
};

exports.reviseWO = async (req, res) => {
  res.json(await WorkOrderRevision.create(req.body));
};

/* ================= RA BILL ================= */

exports.createRABill = async (req, res) => {
  const bill = await RABill.create({
    billNo: genNo('RA'),
    billDate: new Date(),
    ...req.body
  });

  await workflow.start({
    module: 'CONTRACTS',
    entity: 'RA_BILL',
    recordId: bill.id
  });

  res.json({
    bill,
    message: 'RA Bill sent for approval'
  });
};

exports.approveRABill = async (req, res) => {
  await RABill.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );
  res.json({ success: true });
};

exports.postRABill = async (req, res) => {
  const raId = req.params.id;

  await ensureApproved('CONTRACTS', 'RA_BILL', raId);

  const ra = await RABill.findByPk(raId);

  await posting.postVoucher({
    type: 'JV',
    narration: `RA Bill ${ra.billNo}`,
    debitAccountCode: 'CONSTRUCTION_WIP',
    creditAccountCode: 'CONTRACTOR_PAYABLE',
    amount: ra.grossAmount,
    userId: req.user.id,
    reference: `RA_BILL:${ra.id}`
  });

  await ra.update({
    postedToAccounts: true,
    status: 'POSTED'
  });

  res.json({ success: true, message: 'RA Bill posted to accounts' });
};

/* ================= ADVANCE ================= */

exports.createAdvance = async (req, res) => {
  res.json(await Advance.create(req.body));
};

/* ================= DEBIT / CREDIT ================= */

exports.createDCNote = async (req, res) => {
  res.json(await DCNote.create(req.body));
};
