const PurchaseBill = require('../purchase/purchaseBill.model');
const { postJournal } = require('./postingEngine.service');

/**
 * Post approved purchase bill into accounts
 */
async function postPurchaseBill({
  billId,
  companyId,
  userId,
  accounts   // { expenseAccountId, gstAccountId, supplierAccountId }
}) {
  const bill = await PurchaseBill.findByPk(billId);

  if (!bill) {
    throw new Error('Purchase Bill not found');
  }

  if (bill.status !== 'APPROVED') {
    throw new Error('Bill must be approved before posting');
  }

  if (bill.postedToAccounts) {
    throw new Error('Bill already posted');
  }

  const lines = [
    {
      accountId: accounts.expenseAccountId,
      debit: bill.basicAmount,
      credit: 0,
      projectId: bill.projectId
    },
    {
      accountId: accounts.gstAccountId,
      debit: bill.taxAmount,
      credit: 0,
      projectId: bill.projectId
    },
    {
      accountId: accounts.supplierAccountId,
      debit: 0,
      credit: bill.totalAmount,
      projectId: bill.projectId
    }
  ];

  const voucher = await postJournal({
    companyId,
    voucherType: 'PV',
    date: bill.billDate,
    narration: `Purchase Bill ${bill.billNo}`,
    sourceType: 'PURCHASE_BILL',
    sourceId: bill.id,
    createdBy: userId,
    lines
  });

  bill.postedToAccounts = true;
  bill.status = 'POSTED';
  await bill.save();

  return voucher;
}

module.exports = {
  postPurchaseBill
};