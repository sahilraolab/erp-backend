const PurchaseOrder = require('./purchaseOrder.model');
const { initiateApproval } = require('../approvals/approval.service');

async function submitPurchaseOrder({
  poId,
  userId,
  companyId
}) {
  const po = await PurchaseOrder.findByPk(poId);

  if (!po || po.status !== 'CREATED') {
    throw new Error('Only CREATED POs can be submitted');
  }

  po.status = 'SUBMITTED';
  await po.save();

  await initiateApproval({
    companyId,
    documentType: 'PURCHASE_PO',
    documentId: po.id,
    initiatedBy: userId
  });

  return po;
}

function assertPOEditable(po) {
  if (po.status !== 'CREATED') {
    throw new Error('PO cannot be modified after submission');
  }
}

module.exports = {
  submitPurchaseOrder,
  assertPOEditable
};