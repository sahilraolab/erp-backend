const ApprovalRequest = require('../modules/approvals/approvalRequest.model');
const ApprovalLevel = require('../modules/approvals/approvalLevel.model');

module.exports = async function checkApprovalAuthority({
  userId,
  companyId,
  documentType,
  documentId,
  roleId
}) {
  // Fetch active approval request
  const approval = await ApprovalRequest.findOne({
    where: {
      documentType,
      documentId,
      companyId,
      status: 'PENDING'
    }
  });

  if (!approval) {
    throw new Error('No pending approval found for document');
  }

  // Fetch current approval level
  const level = await ApprovalLevel.findOne({
    where: {
      documentType,
      companyId,
      levelNo: approval.currentLevel,
      roleId
    }
  });

  if (!level) {
    throw new Error('User is not authorized for this approval level');
  }

  return {
    approvalId: approval.id,
    levelNo: approval.currentLevel
  };
};