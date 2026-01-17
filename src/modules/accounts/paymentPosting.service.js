const Payment = require('./payment.model');
const PurchaseBill = require('../purchase/purchaseBill.model');
const { postJournal } = require('./postingEngine.service');

/**
 * Post supplier payment into accounts
 */
async function postSupplierPayment({
  paymentId,
  companyId,
  userId,
  accounts
  /*
    accounts = {
      supplierAccountId,
      bankAccountId,
      tdsPayableAccountId,
      bankChargesAccountId (optional)
    }
  */
}) {
  const payment = await Payment.findByPk(paymentId);

  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'APPROVED') {
    throw new Error('Payment must be approved before posting');
  }

  if (payment.postedToAccounts) {
    throw new Error('Payment already posted');
  }

  const bill = await PurchaseBill.findByPk(payment.billId);
  if (!bill) {
    throw new Error('Linked purchase bill not found');
  }

  const lines = [];

  /* Supplier DR */
  lines.push({
    accountId: accounts.supplierAccountId,
    debit: payment.grossAmount,
    credit: 0,
    projectId: bill.projectId
  });

  /* Bank CR (net paid) */
  lines.push({
    accountId: accounts.bankAccountId,
    debit: 0,
    credit: payment.netPaidAmount,
    projectId: bill.projectId
  });

  /* TDS Payable CR */
  if (payment.tdsAmount > 0) {
    lines.push({
      accountId: accounts.tdsPayableAccountId,
      debit: 0,
      credit: payment.tdsAmount,
      projectId: bill.projectId
    });
  }

  /* Bank Charges DR */
  if (payment.bankChargeAmount > 0 && accounts.bankChargesAccountId) {
    lines.push({
      accountId: accounts.bankChargesAccountId,
      debit: payment.bankChargeAmount,
      credit: 0,
      projectId: bill.projectId
    });
  }

  const voucher = await postJournal({
    companyId,
    voucherType: 'PV',
    date: payment.paymentDate,
    narration: `Supplier Payment ${payment.paymentNo}`,
    sourceType: 'SUPPLIER_PAYMENT',
    sourceId: payment.id,
    createdBy: userId,
    lines
  });

  payment.postedToAccounts = true;
  payment.status = 'POSTED';
  await payment.save();

  return voucher;
}

module.exports = {
  postSupplierPayment
};