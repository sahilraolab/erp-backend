const PurchaseBill = require('./purchaseBill.model');
const { initiateApproval } = require('../approvals/approval.service');

async function submitPurchaseBill({
  billId,
  userId,
  companyId
}) {
  const bill = await PurchaseBill.findByPk(billId);

  if (!bill || bill.status !== 'DRAFT') {
    throw new Error('Only DRAFT bills can be submitted');
  }

  bill.status = 'SUBMITTED';
  await bill.save();

  await initiateApproval({
    companyId,
    documentType: 'PURCHASE_BILL',
    documentId: bill.id,
    initiatedBy: userId
  });

  return bill;
}

function assertBillEditable(bill) {
  if (bill.status !== 'DRAFT') {
    throw new Error('Purchase Bill cannot be modified after submission');
  }
}

async function assertBillPostable(bill) {
  if (bill.status !== 'APPROVED') {
    throw new Error('Bill must be approved before posting');
  }

  if (bill.postedToAccounts) {
    throw new Error('Bill already posted');
  }
}

module.exports = {
  submitPurchaseBill,
  assertBillEditable,
  assertBillPostable
};