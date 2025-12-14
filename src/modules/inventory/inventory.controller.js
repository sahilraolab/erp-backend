const audit = require('../../core/audit');
const GRN = require('./grn.model');
const Stock = require('./stock.model');
const Ledger = require('./stockLedger.model');
const { ensureApproved } = require('../workflow/workflow.helper');
const withTx = require('../../core/withTransaction');

const genNo = (p) => `${p}-${Date.now()}`;

exports.createGRN = async (req, res) => {
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

exports.approveGRN = async (req, res) => {
  const { materialId, qty, location } = req.body;

  let stock = await Stock.findOne({ where: { materialId, location } });
  if (!stock) {
    stock = await Stock.create({ materialId, location, quantity: 0 });
  }

  stock.quantity += qty;
  await stock.save();

  await Ledger.create({
    materialId,
    refType: 'GRN',
    refId: req.params.id,
    qtyIn: qty,
    balanceQty: stock.quantity
  });

  await GRN.update(
    { status: 'APPROVED' },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_GRN',
    module: 'INVENTORY',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.issueMaterial = async (req, res) => {
  const { materialId, qty, location } = req.body;

  const stock = await Stock.findOne({ where: { materialId, location } });
  if (!stock || stock.quantity < qty) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  stock.quantity -= qty;
  await stock.save();

  await Ledger.create({
    materialId,
    refType: 'ISSUE',
    qtyOut: qty,
    balanceQty: stock.quantity
  });

  await audit({
    userId: req.user.id,
    action: 'ISSUE_MATERIAL',
    module: 'INVENTORY',
    recordId: materialId
  });

  res.json({ success: true });
};

exports.getStock = async (req, res) => {
  res.json(await Stock.findAll());
};

exports.getLedger = async (req, res) => {
  res.json(await Ledger.findAll({
    order: [['createdAt', 'DESC']]
  }));
};

exports.createGRN = async (req, res) => {
  await ensureApproved('PURCHASE', 'PO', req.body.poId);

  const grn = await GRN.create(req.body);
  res.json(grn);
};

exports.createGRN = async (req, res) => {
  const result = await withTx(async (t) => {
    const grn = await GRN.create(req.body, { transaction: t });

    await StockLedger.create({
      materialId: grn.materialId,
      qty: grn.qty,
      type: 'IN'
    }, { transaction: t });

    return grn;
  });

  res.json(result);
};
