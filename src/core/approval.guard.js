// src/core/approval.guard.js
const ApprovalRequest = require('../modules/approvals/approvalRequest.model');
const ApprovalLevel = require('../modules/approvals/approvalLevel.model');

module.exports = async function checkApprovalAuthority({
  user,
  companyId,
  documentType,
  documentId
}) {
  if (!user || !user.role) {
    throw new Error('Invalid user context');
  }

  const approval = await ApprovalRequest.findOne({
    where: {
      documentType,
      documentId,
      companyId
    }
  });

  if (!approval) {
    throw new Error('Approval record not found');
  }

  if (approval.status !== 'PENDING') {
    throw new Error(`Approval already ${approval.status}`);
  }

  const level = await ApprovalLevel.findOne({
    where: {
      documentType,
      companyId,
      levelNo: approval.currentLevel,
      roleId: user.roleId
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