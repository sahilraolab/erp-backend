const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');
const workflow = require('../workflow/workflow.service');

const GRN = require('./grn.model');
const GRNLine = require('./grnLine.model');
const Stock = require('./stock.model');
const StockLedger = require('./stockLedger.model');

const MaterialIssue = require('./materialIssue.model');
const MaterialIssueLine = require('./materialIssueLine.model');

const StockTransfer = require('./stockTransfer.model');
const StockTransferLine = require('./stockTransferLine.model');

const POLine = require('../purchase/poLine.model');

const { ensureApproved } = require('../workflow/workflow.helper');

const genNo = (p) => `${p}-${Date.now()}`;

/* ================= CREATE GRN ================= */

exports.createGRN = async (req, res) => {
  const { projectId, locationId, poId, lines } = req.body;

  await ensureApproved('PURCHASE', 'PO', poId);

  const grn = await withTx(async (t) => {
    const header = await GRN.create(
      {
        grnNo: genNo('GRN'),
        projectId,
        locationId,
        poId,
        receivedBy: req.user.id,
        status: 'QC_PENDING'
      },
      { transaction: t }
    );

    for (const l of lines) {
      if (l.acceptedQty <= 0) {
        throw new Error('Accepted qty must be > 0');
      }

      await GRNLine.create(
        {
          grnId: header.id,
          poLineId: l.poLineId,
          materialId: l.materialId,
          orderedQty: l.orderedQty,
          receivedQty: l.receivedQty,
          acceptedQty: l.acceptedQty,
          rejectedQty: l.rejectedQty || 0
        },
        { transaction: t }
      );
    }

    await workflow.start(
      {
        module: 'INVENTORY',
        entity: 'GRN',
        recordId: header.id
      },
      t
    );

    return header;
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_GRN',
    module: 'INVENTORY',
    recordId: grn.id,
    meta: { projectId }
  });

  res.json(grn);
};

/* ================= APPROVE GRN ================= */

exports.approveGRN = async (req, res) => {
  let fullyAccepted = true;
  const grnId = req.params.id;

  await ensureApproved('INVENTORY', 'GRN', grnId);

  await withTx(async (t) => {
    const grn = await GRN.findByPk(grnId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!grn || grn.status === 'APPROVED') {
      throw new Error('Invalid or already approved GRN');
    }

    const lines = await GRNLine.findAll({
      where: { grnId },
      transaction: t
    });

    for (const line of lines) {
      if (line.acceptedQty <= 0) {
        throw new Error('Accepted qty must be > 0');
      }

      if (Number(line.acceptedQty) > Number(line.receivedQty)) {
        throw new Error('Accepted qty cannot exceed received qty');
      }

      const totalReceived = await GRNLine.sum('acceptedQty', {
        where: { poLineId: line.poLineId },
        transaction: t
      });

      const cumulativeAccepted =
        Number(totalReceived || 0) + Number(line.acceptedQty);

      if (cumulativeAccepted > Number(line.orderedQty)) {
        throw new Error('GRN exceeds ordered PO quantity');
      }

      if (cumulativeAccepted < Number(line.orderedQty)) {
        fullyAccepted = false;
      }

      let stock = await Stock.findOne({
        where: {
          projectId: grn.projectId,
          locationId: grn.locationId,
          materialId: line.materialId
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!stock) {
        stock = await Stock.create(
          {
            projectId: grn.projectId,
            locationId: grn.locationId,
            materialId: line.materialId,
            quantity: 0
          },
          { transaction: t }
        );
      }

      stock.quantity += Number(line.acceptedQty);
      await stock.save({ transaction: t });

      await StockLedger.create(
        {
          projectId: grn.projectId,
          locationId: grn.locationId,
          materialId: line.materialId,
          refType: 'GRN',
          refId: grn.id,
          qtyIn: line.acceptedQty,
          balanceQty: stock.quantity
        },
        { transaction: t }
      );

      await POLine.increment(
        { receivedQty: line.acceptedQty },
        { where: { id: line.poLineId }, transaction: t }
      );
    }

    await grn.update(
      { status: fullyAccepted ? 'APPROVED' : 'PARTIAL_APPROVED' },
      { transaction: t }
    );
  });

  const grn = await GRN.findByPk(grnId);

  await audit({
    userId: req.user.id,
    action: 'APPROVE_GRN',
    module: 'INVENTORY',
    recordId: grnId,
    meta: { projectId: grn.projectId }
  });

  res.json({ success: true });
};

/* ================= ISSUE MATERIAL ================= */

exports.createMaterialIssue = async (req, res) => {
  const { projectId, fromLocationId, purpose, lines } = req.body;

  const issue = await withTx(async (t) => {
    const header = await MaterialIssue.create(
      {
        issueNo: genNo('MI'),
        projectId,
        fromLocationId,
        issuedBy: req.user.id,
        issuedTo: req.user.id,
        purpose,
        status: 'DRAFT'
      },
      { transaction: t }
    );

    for (const l of lines) {
      if (l.issuedQty <= 0) {
        throw new Error('Issued qty must be > 0');
      }

      await MaterialIssueLine.create(
        {
          issueId: header.id,
          materialId: l.materialId,
          issuedQty: l.issuedQty
        },
        { transaction: t }
      );
    }

    await workflow.start(
      {
        module: 'INVENTORY',
        entity: 'ISSUE',
        recordId: header.id
      },
      t
    );

    return header;
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_MATERIAL_ISSUE',
    module: 'INVENTORY',
    recordId: issue.id,
    meta: { projectId }
  });

  res.json(issue);
};

/* ================= TRANSFER STOCK ================= */

exports.createStockTransfer = async (req, res) => {
  const { projectId, fromLocationId, toLocationId, lines } = req.body;

  if (fromLocationId === toLocationId) {
    throw new Error('From and To location cannot be same');
  }

  const transfer = await withTx(async (t) => {
    const header = await StockTransfer.create(
      {
        transferNo: genNo('ST'),
        projectId,
        fromLocationId,
        toLocationId,
        requestedBy: req.user.id,
        status: 'DRAFT'
      },
      { transaction: t }
    );

    for (const l of lines) {
      if (l.transferQty <= 0) {
        throw new Error('Transfer qty must be > 0');
      }

      await StockTransferLine.create(
        {
          transferId: header.id,
          materialId: l.materialId,
          transferQty: l.transferQty
        },
        { transaction: t }
      );
    }

    await workflow.start(
      {
        module: 'INVENTORY',
        entity: 'TRANSFER',
        recordId: header.id
      },
      t
    );

    return header;
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_STOCK_TRANSFER',
    module: 'INVENTORY',
    recordId: transfer.id,
    meta: { projectId }
  });

  res.json(transfer);
};

/* ================= CANCEL MATERIAL ISSUE ================= */

exports.cancelMaterialIssue = async (req, res) => {
  const issueId = req.params.id;

  await withTx(async (t) => {
    const issue = await MaterialIssue.findByPk(issueId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!issue || issue.status !== 'APPROVED') {
      throw new Error('Only approved issues can be cancelled');
    }

    const lines = await MaterialIssueLine.findAll({
      where: { issueId },
      transaction: t
    });

    for (const line of lines) {
      let stock = await Stock.findOne({
        where: {
          projectId: issue.projectId,
          locationId: issue.fromLocationId,
          materialId: line.materialId
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!stock) {
        stock = await Stock.create(
          {
            projectId: issue.projectId,
            locationId: issue.fromLocationId,
            materialId: line.materialId,
            quantity: 0
          },
          { transaction: t }
        );
      }

      stock.quantity += Number(line.issuedQty);
      await stock.save({ transaction: t });

      await StockLedger.create(
        {
          projectId: issue.projectId,
          locationId: issue.fromLocationId,
          materialId: line.materialId,
          refType: 'ISSUE_CANCEL',
          refId: issue.id,
          qtyIn: line.issuedQty,
          balanceQty: stock.quantity
        },
        { transaction: t }
      );
    }

    await issue.update({ status: 'CANCELLED' }, { transaction: t });
  });

  const issue = await MaterialIssue.findByPk(issueId);

  await audit({
    userId: req.user.id,
    action: 'CANCEL_MATERIAL_ISSUE',
    module: 'INVENTORY',
    recordId: issueId,
    meta: { projectId: issue.projectId }
  });

  res.json({ success: true });
};

/* ================= REPORTING ================= */

exports.getStock = async (req, res) => {
  const where = {};
  if (req.query.projectId) where.projectId = req.query.projectId;
  if (req.query.locationId) where.locationId = req.query.locationId;
  if (req.query.materialId) where.materialId = req.query.materialId;

  res.json(await Stock.findAll({ where }));
};

exports.getLedger = async (req, res) => {
  const where = {};
  if (req.query.projectId) where.projectId = req.query.projectId;
  if (req.query.locationId) where.locationId = req.query.locationId;
  if (req.query.materialId) where.materialId = req.query.materialId;
  if (req.query.refType) where.refType = req.query.refType;

  res.json(
    await StockLedger.findAll({
      where,
      order: [['createdAt', 'ASC']]
    })
  );
};
