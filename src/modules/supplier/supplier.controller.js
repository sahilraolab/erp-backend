// src/modules/supplier/supplier.controller.js

const { Op } = require('sequelize');
const withTx = require('../../core/withTransaction');

const RFQ = require('../purchase/rfq.model');
const RFQSupplier = require('../purchase/rfqSupplier.model');
const Requisition = require('../purchase/requisition.model');
const Project = require('../masters/project.model');

const Quotation = require('../purchase/quotation.model');
const QuotationLine = require('../purchase/quotationLine.model');
const Material = require('../masters/material.model');

const audit = require('../../core/audit');

/* =====================================================
   SUPPLIER RFQs (INVITED RFQs ONLY)
===================================================== */

exports.listSupplierRFQs = async (req, res) => {
  const supplierId = req.user.supplierId;

  if (!supplierId) {
    return res.status(400).json({ message: 'Supplier context missing' });
  }

  const rfqs = await RFQ.findAll({
    where: { status: 'OPEN' },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: RFQSupplier,
        where: { supplierId },
        attributes: []
      },
      {
        model: Requisition,
        attributes: ['id', 'reqNo', 'budgetId', 'estimateId', 'projectId'],
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

  const quotation = await withTx(async (t) => {
    const rfq = await RFQ.findOne({
      where: { id: rfqId, status: 'OPEN' },
      include: [{ model: Requisition }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!rfq) {
      throw new Error('RFQ not available');
    }

    if (
      rfq.closingDate &&
      new Date(rfq.closingDate).getTime() < Date.now()
    ) {
      throw new Error('RFQ has expired');
    }

    const invited = await RFQSupplier.findOne({
      where: { rfqId, supplierId },
      transaction: t
    });

    if (!invited) {
      throw new Error('Supplier not invited for this RFQ');
    }

    const existing = await Quotation.findOne({
      where: { rfqId, supplierId },
      transaction: t
    });

    if (existing) {
      throw new Error('Quotation already submitted for this RFQ');
    }

    const quotation = await Quotation.create(
      {
        rfqId,
        supplierId,
        projectId: rfq.requisition.projectId,
        budgetId: rfq.requisition.budgetId,
        estimateId: rfq.requisition.estimateId,
        validTill,
        totalAmount: 0,
        status: 'SUBMITTED',
        attachmentPath: req.file ? req.file.path : null
      },
      { transaction: t }
    );

    let totalAmount = 0;

    for (const line of items) {
      if (line.qty <= 0 || line.rate <= 0) {
        throw new Error('Invalid qty or rate');
      }

      const material = await Material.findByPk(line.materialId, {
        transaction: t
      });

      if (!material) {
        throw new Error('Invalid material');
      }

      await QuotationLine.create(
        {
          quotationId: quotation.id,
          projectId: rfq.requisition.projectId,
          materialId: line.materialId,
          qty: line.qty,
          rate: line.rate,
          taxPercent: line.taxPercent || 0
        },
        { transaction: t }
      );

      totalAmount +=
        line.qty * line.rate +
        (line.qty * line.rate * (line.taxPercent || 0)) / 100;
    }

    await quotation.update(
      { totalAmount },
      { transaction: t }
    );

    await audit({
      userId: req.user.id,
      action: 'SUPPLIER_SUBMIT_QUOTATION',
      module: 'SUPPLIER',
      recordId: quotation.id,
      meta: { projectId: rfq.requisition.projectId }
    });

    return quotation;
  });

  res.json({
    quotationId: quotation.id,
    totalAmount: quotation.totalAmount
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
