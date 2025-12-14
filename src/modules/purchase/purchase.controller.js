const audit = require('../../core/audit');
const Requisition = require('./requisition.model');
const RFQ = require('./rfq.model');
const Quotation = require('./quotation.model');
const PO = require('./po.model');
const GRN = require('../inventory/grn.model');
const PurchaseBill = require('./purchaseBill.model');
const workflow = require('../workflow/workflow.service');
const workflow = require('../workflow/workflow.helper');
const posting = require('../accounts/posting.service');
const withTx = require('../../core/withTransaction');
const posting = require('../accounts/posting.service');

const genNo = (p) => `${p}-${Date.now()}`;

// const genNo = (prefix) =>
//   `${prefix}-${Date.now()}`;

exports.createRequisition = async (req, res) => {
  const rec = await Requisition.create({
    reqNo: genNo('MR'),
    projectId: req.body.projectId,
    requestedBy: req.user.id
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_MR',
    module: 'PURCHASE',
    recordId: rec.id
  });

  res.json(rec);
};

exports.submitRequisition = async (req, res) => {
  await Requisition.update(
    { status: 'SUBMITTED' },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'SUBMIT_MR',
    module: 'PURCHASE',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.createRFQ = async (req, res) => {
  const rfq = await RFQ.create({
    rfqNo: genNo('RFQ'),
    requisitionId: req.body.requisitionId
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_RFQ',
    module: 'PURCHASE',
    recordId: rfq.id
  });

  res.json(rfq);
};

exports.submitQuotation = async (req, res) => {
  const q = await Quotation.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'SUBMIT_QUOTATION',
    module: 'PURCHASE',
    recordId: q.id
  });

  res.json(q);
};

exports.approveQuotation = async (req, res) => {
  await Quotation.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_QUOTATION',
    module: 'PURCHASE',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.createPO = async (req, res) => {
  const po = await PO.create({
    poNo: genNo('PO'),
    quotationId: req.body.quotationId,
    totalAmount: req.body.totalAmount
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_PO',
    module: 'PURCHASE',
    recordId: po.id
  });

  res.json(po);
};

exports.createPurchaseBill = async (req, res) => {
  const { grnId, supplierId, basicAmount, taxAmount } = req.body;

  const grn = await GRN.findByPk(grnId);
  if (!grn || grn.status !== 'APPROVED') {
    return res.status(400).json({ message: 'GRN not approved' });
  }

  if (grn.billed) {
    return res.status(400).json({ message: 'GRN already billed' });
  }

  const bill = await PurchaseBill.create({
    billNo: genNo('PB'),
    grnId,
    supplierId,
    billDate: new Date(),
    basicAmount,
    taxAmount,
    totalAmount: basicAmount + taxAmount
  });

  grn.billed = true;
  await grn.save();

  await audit({
    userId: req.user.id,
    action: 'CREATE_PURCHASE_BILL',
    module: 'PURCHASE',
    recordId: bill.id
  });

  res.json(bill);
};

exports.postPurchaseBill = async (req, res) => {
  await PurchaseBill.update(
    { status: 'POSTED' },
    { where: { id: req.params.id } }
  );

  // 🔌 Accounts integration will hook here later

  await audit({
    userId: req.user.id,
    action: 'POST_PURCHASE_BILL',
    module: 'PURCHASE',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.postPurchaseBill = async (req, res) => {
  await withTx(async (t) => {
    const bill = await PurchaseBill.findByPk(req.params.id, { transaction: t });

    if (bill.postedToAccounts) throw new Error('Already posted');

    await posting.postVoucher({
      type: 'JV',
      narration: `Purchase Bill ${bill.billNo}`,
      debitAccountCode: 'PURCHASE_EXP',
      creditAccountCode: 'SUPPLIER_PAYABLE',
      amount: bill.totalAmount,
      userId: req.user.id,
      reference: `PB:${bill.id}`,
      transaction: t   // 🔑 pass transaction
    });

    await bill.update({ postedToAccounts: true }, { transaction: t });
  });

  res.json({ success: true });
};


exports.createPO = async (req, res) => {
  const po = await PO.create(req.body);

  await workflow.start({
    module: 'PURCHASE',
    entity: 'PO',
    recordId: po.id
  });

  res.json({
    po,
    message: 'PO created and sent for approval'
  });
};

exports.approvePurchaseBill = async (req, res) => {
  const billId = req.params.id;

  await workflow.ensureApproved('PURCHASE', 'PURCHASE_BILL', billId);

  const bill = await PurchaseBill.findByPk(billId);

  await posting.postVoucher({
    type: 'JV',
    narration: `Purchase Bill ${bill.billNo}`,
    debitAccountCode: 'PURCHASE_EXP',
    creditAccountCode: 'SUPPLIER_PAYABLE',
    amount: bill.totalAmount,
    userId: req.user.id,
    reference: `PURCHASE_BILL:${bill.id}`
  });

  await bill.update({ postedToAccounts: true });

  res.json({ success: true, message: 'Posted to accounts' });
};
