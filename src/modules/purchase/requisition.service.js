const Requisition = require('./requisition.model');
const { initiateApproval } = require('../approvals/approval.service');

async function submitRequisition({
  requisitionId,
  userId,
  companyId
}) {
  const req = await Requisition.findByPk(requisitionId);

  if (!req || req.status !== 'DRAFT') {
    throw new Error('Only DRAFT requisitions can be submitted');
  }

  // 1️⃣ Lock requisition
  req.status = 'SUBMITTED';
  req.submittedAt = new Date();
  await req.save();

  // 2️⃣ Initiate approval
  await initiateApproval({
    companyId,
    documentType: 'PURCHASE_REQUISITION',
    documentId: req.id,
    initiatedBy: userId
  });

  return req;
}

function assertRequisitionEditable(req) {
  if (req.status !== 'DRAFT') {
    throw new Error('Requisition cannot be modified after submission');
  }
}

module.exports = {
  submitRequisition,
  assertRequisitionEditable
};
