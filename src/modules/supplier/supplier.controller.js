// src/modules/supplier/supplier.controller.js

const RFQ = require('../purchase/rfq.model');
const Requisition = require('../purchase/requisition.model');
const Project = require('../masters/project.model');

const Quotation = require('../purchase/quotation.model');
const QuotationLine = require('../purchase/quotationLine.model');
const Material = require('../masters/material.model');

const audit = require('../../core/audit');

/* =====================================================
   SUPPLIER RFQs (GLOBAL OPEN RFQs)
===================================================== */

exports.listSupplierRFQs = async (req, res) => {
  const rfqs = await RFQ.findAll({
    where: { status: 'OPEN' },
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

  res.json(
    rfqs.map(rfq => ({
      id: rfq.id,
      rfqNo: rfq.rfqNo,
      rfqDate: rfq.rfqDate,
      closingDate: rfq.closingDate,
      status: rfq.status,
      project: rfq.requisition.project,
      requisition: {
        id: rfq.requisition.id,
        reqNo: rfq.requisition.reqNo
      },
      budgetId: rfq.requisition.budgetId,
      estimateId: rfq.requisition.estimateId
    }))
  );
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

  if (!rfqId || !items.length) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const rfq = await RFQ.findOne({
    where: { id: rfqId, status: 'OPEN' },
    include: [{ model: Requisition }]
  });

  if (!rfq) {
    return res.status(400).json({ message: 'RFQ not available' });
  }

  const existing = await Quotation.findOne({
    where: { rfqId, supplierId }
  });

  if (existing) {
    return res.status(400).json({
      message: 'Quotation already submitted for this RFQ'
    });
  }

  const quotation = await Quotation.create({
    rfqId,
    supplierId,
    projectId: rfq.requisition.projectId,
    budgetId: rfq.requisition.budgetId,
    estimateId: rfq.requisition.estimateId,
    validTill,
    totalAmount: 0,
    attachmentPath: req.file ? req.file.path : null
  });
  

  let totalAmount = 0;

  for (const line of items) {
    if (line.qty <= 0 || line.rate <= 0) {
      return res.status(400).json({
        message: 'Invalid qty or rate'
      });
    }; 

    await QuotationLine.create({
      quotationId: quotation.id,
      projectId: rfq.requisition.projectId,
      materialId: line.materialId,
      qty: line.qty,
      rate: line.rate,
      taxPercent: line.taxPercent || 0
    });

    totalAmount +=
      line.qty * line.rate +
      (line.qty * line.rate * (line.taxPercent || 0)) / 100;
  }

  await quotation.update({ totalAmount });

  await audit({
    userId: req.user.id,
    action: 'SUPPLIER_SUBMIT_QUOTATION',
    module: 'SUPPLIER',
    recordId: quotation.id
  });

  res.json({ quotationId: quotation.id, totalAmount });
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
