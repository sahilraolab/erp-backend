const RFQ = require('../purchase/rfq.model');
const Requisition = require('../purchase/requisition.model');
const Project = require('../masters/project.model');

const Quotation = require('../purchase/quotation.model');
const QuotationLine = require('../purchase/quotationLine.model');
const Material = require('../masters/material.model');

const audit = require('../../core/audit');

/* =====================================================
   SUPPLIER RFQs (ENRICHED + LOCKED CONTEXT)
===================================================== */

exports.listSupplierRFQs = async (req, res) => {
  const supplierId = req.user.supplierId;

  if (!supplierId) {
    return res.status(400).json({ message: 'Supplier context missing' });
  }

  const rfqs = await RFQ.findAll({
    where: {
      supplierId,
      status: 'OPEN'
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Requisition,
        attributes: ['id', 'reqNo', 'budgetId', 'estimateId'],
        include: [
          {
            model: Project,
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });

  const response = rfqs.map(rfq => ({
    id: rfq.id,
    rfqNo: rfq.rfqNo,
    rfqDate: rfq.rfqDate,
    closingDate: rfq.closingDate,
    status: rfq.status,

    project: {
      id: rfq.requisition.project.id,
      name: rfq.requisition.project.name
    },

    requisition: {
      id: rfq.requisition.id,
      reqNo: rfq.requisition.reqNo
    },

    // 🔒 ENGINEERING CONTEXT (READ-ONLY)
    budgetId: rfq.requisition.budgetId,
    estimateId: rfq.requisition.estimateId
  }));

  res.json(response);
};

/* =====================================================
   SUPPLIER QUOTATION SUBMISSION
===================================================== */

exports.submitSupplierQuotation = async (req, res) => {
  const supplierId = req.user.supplierId;

  if (!supplierId) {
    return res.status(400).json({ message: 'Supplier context missing' });
  }

  const { rfqId, validTill, items = [] } = req.body;

  if (!rfqId) {
    return res.status(400).json({ message: 'rfqId is required' });
  }

  if (!items.length) {
    return res.status(400).json({
      message: 'At least one quotation line item is required'
    });
  }

  /* ================= FETCH RFQ + CONTEXT ================= */

  const rfq = await RFQ.findOne({
    where: { id: rfqId, supplierId, status: 'OPEN' },
    include: [
      {
        model: Requisition,
        attributes: ['projectId', 'budgetId', 'estimateId']
      }
    ]
  });

  if (!rfq) {
    return res.status(400).json({
      message: 'RFQ not found or already closed'
    });
  }

  // Prevent duplicate quotation submission
  const existing = await Quotation.findOne({
    where: { rfqId, supplierId }
  });

  if (existing) {
    return res.status(400).json({
      message: 'Quotation already submitted for this RFQ'
    });
  }

  const { projectId, budgetId, estimateId } = rfq.requisition;

  /* ================= CREATE QUOTATION ================= */

  const quotation = await Quotation.create({
    rfqId,
    supplierId,
    projectId,
    budgetId,
    estimateId,
    validTill,
    totalAmount: 0
  });

  /* ================= LINE ITEMS ================= */

  let totalAmount = 0;

  for (const line of items) {
    const qty = Number(line.qty || 0);
    const rate = Number(line.rate || 0);
    const taxPct = Number(line.taxPercent || 0);

    if (qty <= 0 || rate <= 0) {
      return res.status(400).json({
        message: 'Invalid qty or rate in quotation lines'
      });
    }

    const amount = qty * rate;
    const taxAmount = (amount * taxPct) / 100;
    const totalLineAmount = amount + taxAmount;

    totalAmount += totalLineAmount;

    await QuotationLine.create({
      quotationId: quotation.id,
      projectId,
      materialId: line.materialId,
      qty,
      rate,
      amount,
      taxPercent: taxPct,
      taxAmount,
      totalAmount: totalLineAmount
    });
  }

  await quotation.update({ totalAmount });

  /* ================= AUDIT ================= */

  await audit({
    userId: req.user.id,
    action: 'SUPPLIER_SUBMIT_QUOTATION',
    module: 'SUPPLIER',
    recordId: quotation.id
  });

  res.json({
    quotationId: quotation.id,
    totalAmount
  });
};

/* =====================================================
   SUPPLIER QUOTATION HISTORY (LIST)
===================================================== */

exports.listSupplierQuotations = async (req, res) => {
  const supplierId = req.user.supplierId;

  if (!supplierId) {
    return res.status(400).json({ message: 'Supplier context missing' });
  }

  const quotations = await Quotation.findAll({
    where: { supplierId },
    order: [['createdAt', 'DESC']],
    attributes: [
      'id',
      'rfqId',
      'totalAmount',
      'validTill',
      'status',
      'createdAt'
    ]
  });

  res.json(quotations);
};

/* =====================================================
   SUPPLIER QUOTATION DETAIL (READ ONLY)
===================================================== */

exports.getSupplierQuotation = async (req, res) => {
  const supplierId = req.user.supplierId;
  const quotationId = req.params.id;

  if (!supplierId) {
    return res.status(400).json({ message: 'Supplier context missing' });
  }

  const quotation = await Quotation.findOne({
    where: {
      id: quotationId,
      supplierId
    },
    include: [
      {
        model: QuotationLine,
        include: [
          {
            model: Material,
            attributes: ['id', 'name', 'category']
          }
        ]
      }
    ]
  });

  if (!quotation) {
    return res.status(404).json({ message: 'Quotation not found' });
  }

  res.json(quotation);
};
