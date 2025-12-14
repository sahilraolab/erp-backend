const PurchaseOrder = require('./po.model');
const GRN = require('./grn.model');
const PurchaseBill = require('./purchaseBill.model');
const StockLedger = require('../inventory/stockLedger.model');
const { createVoucher } = require('../accounts/accounts.service');

exports.createPO = async (req, res) => {
  const po = await PurchaseOrder.create({
    supplierId: req.body.supplierId,
    projectId: req.body.projectId,
    status: 'CREATED'
  });
  res.json(po);
};

exports.approveGRN = async (req, res) => {
  const { grnId, items } = req.body;

  for (const i of items) {
    await StockLedger.create({
      materialId: i.materialId,
      projectId: i.projectId,
      qtyIn: i.qty,
      qtyOut: 0,
      rate: i.rate,
      referenceType: 'GRN',
      referenceId: grnId
    });
  }

  await GRN.update({ status: 'APPROVED' }, { where: { id: grnId } });
  res.json({ message: 'GRN Approved' });
};

exports.approvePurchaseBill = async (req, res) => {
  const bill = await PurchaseBill.create(req.body);

  await createVoucher(
    [
      { accountId: 4, debit: bill.total, credit: 0 },
      { accountId: 2, debit: 0, credit: bill.total }
    ],
    {
      voucherType: 'PURCHASE',
      referenceType: 'PURCHASE_BILL',
      referenceId: bill.id,
      date: new Date()
    }
  );

  res.json({ message: 'Bill Approved & Posted' });
};
