const { Op } = require('sequelize');
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
    requestedBy: req.user.id,
    status: 'DRAFT'
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_MR',
    module: 'PURCHASE',
    recordId: rec.id,
    meta: { projectId }
  });

  res.json(rec);
};

exports.submitRequisition = async (req, res) => {
  await withTx(async (t) => {
    const rec = await Requisition.findByPk(req.params.id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!rec || rec.status !== 'DRAFT') {
      throw new Error('Only DRAFT requisition can be submitted');
    }

    await rec.update(
      { status: 'SUBMITTED', submittedAt: new Date() },
      { transaction: t }
    );

    await workflow.start(
      {
        module: 'PURCHASE',
        entity: 'MR',
        recordId: rec.id
      },
      t
    );

    await audit({
      userId: req.user.id,
      action: 'SUBMIT_MR',
      module: 'PURCHASE',
      recordId: rec.id,
      meta: { projectId: rec.projectId }
    });
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
  const rfq = await withTx(async (t) => {
    const mr = await Requisition.findByPk(req.body.requisitionId, {
      transaction: t
    });

    if (!mr || mr.status !== 'APPROVED') {
      throw new Error('Approved requisition required');
    }

    const rfq = await RFQ.create(
      {
        rfqNo: genNo('RFQ'),
        requisitionId: mr.id,
        projectId: mr.projectId,
        closingDate: req.body.closingDate,
        status: 'OPEN',
        attachmentPath: req.file ? req.file.path : null
      },
      { transaction: t }
    );

    await audit({
      userId: req.user.id,
      action: 'CREATE_RFQ',
      module: 'PURCHASE',
      recordId: rfq.id,
      meta: { projectId: mr.projectId }
    });

    return rfq;
  });

  res.json(rfq);
};

exports.listRFQs = async (req, res) => {
  const { requisitionId } = req.query;
  res.json(
    await RFQ.findAll({
      where: requisitionId ? { requisitionId } : {},
      order: [['createdAt', 'DESC']]
    })
  );
};

/* =====================================================
   QUOTATION
===================================================== */

exports.submitQuotation = async (req, res) => {
  const quotation = await withTx(async (t) => {
    const rfq = await RFQ.findByPk(req.body.rfqId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!rfq || rfq.status !== 'OPEN') {
      throw new Error('RFQ is closed');
    }

    if (req.user.supplierId !== req.body.supplierId) {
      throw new Error('Invalid supplier');
    }

    const quotation = await Quotation.create(
      {
        ...req.body,
        status: 'SUBMITTED',
        attachmentPath: req.file ? req.file.path : null
      },
      { transaction: t }
    );

    await audit({
      userId: req.user.id,
      action: 'SUBMIT_QUOTATION',
      module: 'PURCHASE',
      recordId: quotation.id,
      meta: { projectId: rfq.projectId }
    });

    return quotation;
  });

  res.json(quotation);
};

exports.approveQuotation = async (req, res) => {
  await withTx(async (t) => {
    const quotation = await Quotation.findByPk(req.params.id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    await quotation.update(
      {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: req.user.id
      },
      { transaction: t }
    );

    await Quotation.update(
      { status: 'REJECTED' },
      {
        where: {
          rfqId: quotation.rfqId,
          id: { [Op.ne]: quotation.id }
        },
        transaction: t
      }
    );

    await RFQ.update(
      { status: 'CLOSED' },
      { where: { id: quotation.rfqId }, transaction: t }
    );

    await audit({
      userId: req.user.id,
      action: 'APPROVE_QUOTATION',
      module: 'PURCHASE',
      recordId: quotation.id,
      meta: { projectId: quotation.projectId }
    });
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
   PURCHASE ORDER
===================================================== */

exports.createPO = async (req, res) => {
  const po = await withTx(async (t) => {
    const quotation = await Quotation.findByPk(req.body.quotationId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!quotation || quotation.status !== 'APPROVED') {
      throw new Error('Approved quotation required');
    }

    const existing = await PO.findOne({
      where: { quotationId: quotation.id },
      transaction: t
    });

    if (existing) {
      throw new Error('PO already exists for this quotation');
    }

    await ensureComplianceClear(quotation.projectId);
    await ensureBudgetAvailable(
      { budgetHeadId: quotation.budgetId, amount: quotation.totalAmount },
      t
    );

    const po = await PO.create(
      {
        poNo: genNo('PO'),
        projectId: quotation.projectId,
        budgetId: quotation.budgetId,
        estimateId: quotation.estimateId,
        quotationId: quotation.id,
        supplierId: quotation.supplierId,
        totalAmount: quotation.totalAmount,
        attachmentPath: req.file ? req.file.path : null
      },
      { transaction: t }
    );

    await workflow.start(
      {
        module: 'PURCHASE',
        entity: 'PO',
        recordId: po.id
      },
      t
    );

    await audit({
      userId: req.user.id,
      action: 'CREATE_PO',
      module: 'PURCHASE',
      recordId: po.id,
      meta: { projectId: po.projectId }
    });

    return po;
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
  const bill = await withTx(async (t) => {
    const { grnId, poId, basicAmount, taxAmount } = req.body;
    const totalAmount = basicAmount + taxAmount;

    const grn = await GRN.findByPk(grnId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!grn || grn.status !== 'APPROVED' || grn.billed) {
      throw new Error('Invalid GRN');
    }

    const po = await PO.findByPk(poId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!po || po.status !== 'APPROVED') {
      throw new Error('Approved PO required');
    }

    const billed = await PurchaseBill.sum('totalAmount', {
      where: { poId: po.id },
      transaction: t
    });

    if ((billed || 0) + totalAmount > po.totalAmount) {
      throw new Error('Billing exceeds PO value');
    }

    await ensureComplianceClear(po.projectId);

    const bill = await PurchaseBill.create(
      {
        billNo: genNo('PB'),
        projectId: po.projectId,
        budgetId: po.budgetId,
        estimateId: po.estimateId,
        poId: po.id,
        grnId,
        supplierId: po.supplierId,
        basicAmount,
        taxAmount,
        totalAmount,
        attachmentPath: req.file ? req.file.path : null
      },
      { transaction: t }
    );

    await grn.update({ billed: true }, { transaction: t });

    await workflow.start(
      {
        module: 'PURCHASE',
        entity: 'PURCHASE_BILL',
        recordId: bill.id
      },
      t
    );

    await audit({
      userId: req.user.id,
      action: 'CREATE_PURCHASE_BILL',
      module: 'PURCHASE',
      recordId: bill.id,
      meta: { projectId: po.projectId }
    });

    return bill;
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
    recordId: billId,
    meta: {}
  });

  res.json({ success: true });
};
