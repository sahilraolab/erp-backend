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

const Budget = require('../engineering/budget.model');
const Estimate = require('../engineering/estimate.model');
const {
  ensureComplianceClear,
  ensureBudgetAvailable
} = require('../engineering/engineering.service');

const genNo = (p) => `${p}-${Date.now()}`;

/* =====================================================
   REQUISITION
===================================================== */

exports.createRequisition = async (req, res) => {
  const { projectId, budgetId, estimateId } = req.body;

  const budget = await Budget.findOne({
    where: { id: budgetId, projectId, status: 'APPROVED' }
  });
  if (!budget) {
    return res.status(400).json({ message: 'Approved budget required' });
  }

  const estimate = await Estimate.findOne({
    where: { id: estimateId, projectId, status: 'FINAL' }
  });
  if (!estimate) {
    return res.status(400).json({ message: 'Final estimate required' });
  }

  const rec = await Requisition.create({
    reqNo: genNo('MR'),
    projectId,
    budgetId,
    estimateId,
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
    { status: 'SUBMITTED', submittedAt: new Date() },
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

exports.listRequisitions = async (req, res) => {
  const { projectId } = req.query;
  res.json(
    await Requisition.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']]
    })
  );
};

exports.getRequisition = async (req, res) => {
  const rec = await Requisition.findByPk(req.params.id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  res.json(rec);
};

/* =====================================================
   RFQ
===================================================== */

exports.createRFQ = async (req, res) => {
  const rfq = await RFQ.create({
    rfqNo: genNo('RFQ'),
    requisitionId: req.body.requisitionId,
    supplierId: req.body.supplierId
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_RFQ',
    module: 'PURCHASE',
    recordId: rfq.id
  });

  res.json(rfq);
};

exports.listRFQs = async (req, res) => {
  const { requisitionId } = req.query;
  res.json(
    await RFQ.findAll({
      where: { requisitionId },
      order: [['createdAt', 'DESC']]
    })
  );
};

/* =====================================================
   QUOTATION
===================================================== */

exports.submitQuotation = async (req, res) => {
  const quotation = await Quotation.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'SUBMIT_QUOTATION',
    module: 'PURCHASE',
    recordId: quotation.id
  });

  res.json(quotation);
};

exports.approveQuotation = async (req, res) => {
  const quotation = await Quotation.findByPk(req.params.id);
  if (!quotation) {
    return res.status(404).json({ message: 'Quotation not found' });
  }

  await quotation.update({
    status: 'APPROVED',
    approvedAt: new Date(),
    approvedBy: req.user.id
  });

  await RFQ.update(
    { status: 'CLOSED' },
    { where: { id: quotation.rfqId } }
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_QUOTATION',
    module: 'PURCHASE',
    recordId: quotation.id
  });

  res.json({ success: true });
};

exports.listQuotations = async (req, res) => {
  const { rfqId } = req.query;
  res.json(
    await Quotation.findAll({
      where: { rfqId },
      order: [['createdAt', 'DESC']]
    })
  );
};

exports.getQuotation = async (req, res) => {
  const q = await Quotation.findByPk(req.params.id);
  if (!q) return res.status(404).json({ message: 'Not found' });
  res.json(q);
};

/* =====================================================
   PURCHASE ORDER (PO)
===================================================== */

exports.createPO = async (req, res) => {
  const existing = await PO.findOne({
    where: { quotationId: req.body.quotationId }
  });
  if (existing) {
    return res.status(400).json({
      message: 'PO already exists for this quotation'
    });
  }

  const quotation = await Quotation.findByPk(req.body.quotationId);
  if (!quotation || quotation.status !== 'APPROVED') {
    return res.status(400).json({ message: 'Approved quotation required' });
  }

  await ensureComplianceClear(quotation.projectId);

  const po = await PO.create({
    poNo: genNo('PO'),
    projectId: quotation.projectId,
    budgetId: quotation.budgetId,
    estimateId: quotation.estimateId,
    quotationId: quotation.id,
    supplierId: quotation.supplierId,
    totalAmount: quotation.totalAmount
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

  res.json({ po });
};

exports.listPOs = async (req, res) => {
  const { projectId } = req.query;
  res.json(
    await PO.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']]
    })
  );
};

exports.getPO = async (req, res) => {
  const po = await PO.findByPk(req.params.id);
  if (!po) return res.status(404).json({ message: 'Not found' });
  res.json(po);
};

/* =====================================================
   PURCHASE BILL
===================================================== */

exports.createPurchaseBill = async (req, res) => {
  const { grnId, basicAmount, taxAmount } = req.body;

  const grn = await GRN.findByPk(grnId);
  if (!grn || grn.status !== 'APPROVED') {
    return res.status(400).json({ message: 'GRN not approved' });
  }

  if (grn.billed) {
    return res.status(400).json({ message: 'GRN already billed' });
  }

  const po = await PO.findByPk(req.body.poId);
  if (!po || po.status !== 'APPROVED') {
    return res.status(400).json({ message: 'Approved PO required' });
  }

  await ensureComplianceClear(po.projectId);

  const bill = await PurchaseBill.create({
    billNo: genNo('PB'),
    projectId: po.projectId,
    budgetId: po.budgetId,
    estimateId: po.estimateId,
    poId: po.id,
    grnId,
    supplierId: po.supplierId,
    billDate: new Date(),
    basicAmount,
    taxAmount,
    totalAmount: basicAmount + taxAmount
  });

  await grn.update({ billed: true });

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

  res.json({ bill });
};

exports.listPurchaseBills = async (req, res) => {
  const { projectId } = req.query;
  res.json(
    await PurchaseBill.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']]
    })
  );
};

exports.getPurchaseBill = async (req, res) => {
  const bill = await PurchaseBill.findByPk(req.params.id);
  if (!bill) return res.status(404).json({ message: 'Not found' });
  res.json(bill);
};

/* =====================================================
   POST TO ACCOUNTS
===================================================== */

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

    await ensureBudgetAvailable(
      { budgetHeadId: bill.budgetId, amount: bill.totalAmount },
      t
    );

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
      { postedToAccounts: true, status: 'POSTED' },
      { transaction: t }
    );
  });

  await audit({
    userId: req.user.id,
    action: 'POST_PURCHASE_BILL',
    module: 'PURCHASE',
    recordId: billId
  });

  res.json({ success: true });
};
