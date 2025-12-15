const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');

const Requisition = require('./requisition.model');
const RFQ = require('./rfq.model');
const Quotation = require('./quotation.model');
const PO = require('./po.model');
const PurchaseBill = require('./purchaseBill.model');

const GRN = require('../inventory/grn.model');
const workflow = require('../workflow/workflow.service');
const posting = require('../accounts/posting.service');

const genNo = (p) => `${p}-${Date.now()}`;

/* ================= REQUISITION ================= */

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

/* ================= RFQ / QUOTATION ================= */

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

/* ================= PO ================= */

exports.createPO = async (req, res) => {
  const existing = await PO.findOne({
    where: { quotationId: req.body.quotationId }
  });

  if (existing) {
    return res.status(400).json({
      message: 'PO already exists for this quotation'
    });
  }

  const po = await PO.create({
    poNo: genNo('PO'),
    quotationId: req.body.quotationId,
    totalAmount: req.body.totalAmount
  });

  await workflow.start({
    module: 'PURCHASE',
    entity: 'PO',
    recordId: po.id
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_PO',
    module: 'PURCHASE',
    recordId: po.id
  });

  res.json({
    po,
    message: 'PO created and sent for approval'
  });
};

/* ================= PURCHASE BILL ================= */

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
    totalAmount: basicAmount + taxAmount,
    postedToAccounts: false
  });

  grn.billed = true;
  await grn.save();

  await workflow.start({
    module: 'PURCHASE',
    entity: 'PURCHASE_BILL',
    recordId: bill.id
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_PURCHASE_BILL',
    module: 'PURCHASE',
    recordId: bill.id
  });

  res.json({
    bill,
    message: 'Purchase Bill created and sent for approval'
  });
};

/* ================= POST TO ACCOUNTS ================= */

exports.postPurchaseBill = async (req, res) => {
  const billId = req.params.id;

  await withTx(async (t) => {
    await workflow.ensureApproved(
      'PURCHASE',
      'PURCHASE_BILL',
      billId
    );

    const bill = await PurchaseBill.findByPk(billId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (bill.postedToAccounts) {
      throw new Error('Purchase Bill already posted');
    }

    await posting.postVoucher({
      type: 'JV',
      narration: `Purchase Bill ${bill.billNo}`,
      debitAccountCode: 'PURCHASE_EXP',
      creditAccountCode: 'SUPPLIER_PAYABLE',
      amount: bill.totalAmount,
      userId: req.user.id,
      reference: `PURCHASE_BILL:${bill.id}`,
      transaction: t
    });

    await bill.update(
      { postedToAccounts: true },
      { transaction: t }
    );
  });

  await audit({
    userId: req.user.id,
    action: 'POST_PURCHASE_BILL',
    module: 'PURCHASE',
    recordId: billId
  });

  res.json({ success: true, message: 'Posted to accounts' });
};
