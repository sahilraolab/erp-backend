const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');

const GRN = require('./grn.model');
const GRNLine = require('./grnLine.model');
const Stock = require('./stock.model');
const StockLedger = require('./stockLedger.model');

const MaterialIssue = require('./materialIssue.model');
const MaterialIssueLine = require('./materialIssueLine.model');

const StockTransfer = require('./stockTransfer.model');
const StockTransferLine = require('./stockTransferLine.model');

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

    return header;
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_GRN',
    module: 'INVENTORY',
    recordId: grn.id
  });

  res.json(grn);
};

/* ================= APPROVE GRN ================= */

exports.approveGRN = async (req, res) => {
  const grnId = req.params.id;

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

      if (line.acceptedQty <= 0) {
        throw new Error('Accepted quantity must be greater than zero');
      }

      if (line.acceptedQty > line.receivedQty) {
        throw new Error('Accepted qty cannot exceed received qty');
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
    }

    await grn.update({ status: 'APPROVED' }, { transaction: t });
  });

  await audit({
    userId: req.user.id,
    action: 'APPROVE_GRN',
    module: 'INVENTORY',
    recordId: grnId
  });

  res.json({ success: true });
};

/* ================= ISSUE MATERIAL ================= */

exports.issueMaterial = async (req, res) => {
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
        status: 'APPROVED'
      },
      { transaction: t }
    );

    for (const l of lines) {
      const stock = await Stock.findOne({
        where: {
          projectId,
          locationId: fromLocationId,
          materialId: l.materialId
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!stock || stock.quantity < l.issuedQty) {
        throw new Error('Insufficient stock');
      }

      stock.quantity -= l.issuedQty;
      await stock.save({ transaction: t });

      await MaterialIssueLine.create(
        {
          issueId: header.id,
          materialId: l.materialId,
          issuedQty: l.issuedQty
        },
        { transaction: t }
      );

      await StockLedger.create(
        {
          projectId,
          locationId: fromLocationId,
          materialId: l.materialId,
          refType: 'ISSUE',
          refId: header.id,
          qtyOut: l.issuedQty,
          balanceQty: stock.quantity
        },
        { transaction: t }
      );
    }

    return header;
  });

  await audit({
    userId: req.user.id,
    action: 'ISSUE_MATERIAL',
    module: 'INVENTORY',
    recordId: issue.id
  });

  res.json(issue);
};

exports.transferStock = async (req, res) => {
  const { projectId, fromLocationId, toLocationId, lines } = req.body;

  const transfer = await withTx(async (t) => {
    const header = await StockTransfer.create(
      {
        transferNo: genNo('ST'),
        projectId,
        fromLocationId,
        toLocationId,
        requestedBy: req.user.id,
        approvedBy: req.user.id,
        status: 'APPROVED'
      },
      { transaction: t }
    );

    for (const l of lines) {
      const fromStock = await Stock.findOne({
        where: { projectId, locationId: fromLocationId, materialId: l.materialId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!fromStock || fromStock.quantity < l.transferQty) {
        throw new Error('Insufficient stock for transfer');
      }

      let toStock = await Stock.findOne({
        where: { projectId, locationId: toLocationId, materialId: l.materialId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!toStock) {
        toStock = await Stock.create(
          { projectId, locationId: toLocationId, materialId: l.materialId, quantity: 0 },
          { transaction: t }
        );
      }

      fromStock.quantity -= l.transferQty;
      toStock.quantity += l.transferQty;

      await fromStock.save({ transaction: t });
      await toStock.save({ transaction: t });

      await StockLedger.create({
        projectId,
        locationId: fromLocationId,
        materialId: l.materialId,
        refType: 'TRANSFER',
        refId: header.id,
        qtyOut: l.transferQty,
        balanceQty: fromStock.quantity
      }, { transaction: t });

      await StockLedger.create({
        projectId,
        locationId: toLocationId,
        materialId: l.materialId,
        refType: 'TRANSFER',
        refId: header.id,
        qtyIn: l.transferQty,
        balanceQty: toStock.quantity
      }, { transaction: t });

    }

    return header;
  });

  await audit({
    userId: req.user.id,
    action: 'TRANSFER_STOCK',
    module: 'INVENTORY',
    recordId: transfer.id
  });

  res.json(transfer);
};

/* ================= REPORTING ================= */

exports.getStock = async (req, res) => {
  res.json(await Stock.findAll());
};

exports.getLedger = async (req, res) => {
  res.json(
    await StockLedger.findAll({
      order: [['createdAt', 'DESC']]
    })
  );
};

// TODO: support QC_REJECTED and PARTIAL_APPROVED
