const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');

const GRN = require('./grn.model');
const Stock = require('./stock.model');
const StockLedger = require('./stockLedger.model');
const { ensureApproved } = require('../workflow/workflow.helper');

const genNo = (p) => `${p}-${Date.now()}`;

/* ================= CREATE GRN ================= */

exports.createGRN = async (req, res) => {
  await ensureApproved('PURCHASE', 'PO', req.body.poId);

  const grn = await GRN.create({
    grnNo: genNo('GRN'),
    poId: req.body.poId,
    receivedBy: req.user.id,
    status: 'QC_PENDING'
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
  const { materialId, qty, location } = req.body;
  const grnId = req.params.id;

  await withTx(async (t) => {
    const grn = await GRN.findByPk(grnId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!grn || grn.status === 'APPROVED') {
      throw new Error('Invalid or already approved GRN');
    }

    let stock = await Stock.findOne({
      where: { materialId, location },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!stock) {
      stock = await Stock.create(
        { materialId, location, quantity: 0 },
        { transaction: t }
      );
    }

    stock.quantity += qty;
    await stock.save({ transaction: t });

    await StockLedger.create(
      {
        materialId,
        refType: 'GRN',
        refId: grnId,
        qtyIn: qty,
        balanceQty: stock.quantity
      },
      { transaction: t }
    );

    await grn.update(
      { status: 'APPROVED' },
      { transaction: t }
    );
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
  const { materialId, qty, location } = req.body;

  await withTx(async (t) => {
    const stock = await Stock.findOne({
      where: { materialId, location },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!stock || stock.quantity < qty) {
      throw new Error('Insufficient stock');
    }

    stock.quantity -= qty;
    await stock.save({ transaction: t });

    await StockLedger.create(
      {
        materialId,
        refType: 'ISSUE',
        refId: materialId,
        qtyOut: qty,
        balanceQty: stock.quantity
      },
      { transaction: t }
    );
  });

  await audit({
    userId: req.user.id,
    action: 'ISSUE_MATERIAL',
    module: 'INVENTORY',
    recordId: materialId
  });

  res.json({ success: true });
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
