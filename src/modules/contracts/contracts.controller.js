const audit = require('../../core/audit');
const Contractor = require('./contractor.model');
const LabourRate = require('./labourRate.model');
const WO = require('./workOrder.model');
const WORev = require('./workOrderRevision.model');
const RABill = require('./raBill.model');
const Advance = require('./advance.model');
const DCNote = require('./debitCreditNote.model');
const workflow = require('../workflow/workflow.service');
const { ensureApproved } = require('../workflow/workflow.helper');
const workflow = require('../workflow/workflow.helper');
const posting = require('../accounts/posting.service');

const genNo = (p) => `${p}-${Date.now()}`;

// Contractor
exports.createContractor = async (req, res) => {
  const c = await Contractor.create(req.body);
  await audit({ userId: req.user.id, action: 'CREATE_CONTRACTOR', module: 'CONTRACTS', recordId: c.id });
  res.json(c);
};

// Labour Rates
exports.addLabourRate = async (req, res) => {
  res.json(await LabourRate.create(req.body));
};

// Work Order
exports.createWO = async (req, res) => {
  const wo = await WO.create({ woNo: genNo('WO'), ...req.body });
  res.json(wo);
};

exports.approveWO = async (req, res) => {
  await WO.update({ status: 'APPROVED' }, { where: { id: req.params.id } });
  res.json({ success: true });
};

// Revision
exports.reviseWO = async (req, res) => {
  const rev = await WORev.create(req.body);
  res.json(rev);
};

// RA Bill
// exports.createRABill = async (req, res) => {
//   const bill = await RABill.create({
//     billNo: genNo('RA'),
//     billDate: new Date(),
//     ...req.body
//   });
//   res.json(bill);
// };
exports.createRABill = async (req, res) => {
  const bill = await RABill.create(req.body);

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
  await RABill.update({ status: 'APPROVED' }, { where: { id: req.params.id } });
  res.json({ success: true });
};

// Advances
exports.createAdvance = async (req, res) => {
  res.json(await Advance.create(req.body));
};

// Debit / Credit
exports.createDCNote = async (req, res) => {
  res.json(await DCNote.create(req.body));
};

exports.createWO = async (req, res) => {
  const wo = await WorkOrder.create(req.body);

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

exports.postRABillToAccounts = async (req, res) => {
  await ensureApproved('CONTRACTS', 'RA_BILL', req.params.id);

  // create accounting voucher here (next phase)
  res.json({ success: true });
};

exports.postRABill = async (req, res) => {
  const raId = req.params.id;

  await workflow.ensureApproved('CONTRACTS', 'RA_BILL', raId);

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

  await ra.update({ postedToAccounts: true });

  res.json({ success: true, message: 'RA Bill posted to accounts' });
};
