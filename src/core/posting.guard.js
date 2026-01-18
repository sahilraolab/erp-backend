// src/core/posting.guard.js
const ApprovalRequest = require('../modules/approvals/approvalRequest.model');

module.exports = async function checkPostingAuthority({
  user,
  companyId,
  documentType,
  documentId
}) {
  if (!user || !user.role) {
    throw new Error('Invalid user context');
  }

  /* ================= COMPANY SCOPE CHECK ================= */
  if (user.companyId && user.companyId !== companyId) {
    throw new Error('User not authorized for this company');
  }

  /* ================= PERMISSION CHECK ================= */
  const permissions = user.role.permissions || [];

  const permissionKey = `${documentType.toLowerCase()}.post`;

  const hasPermission = permissions.some(
    p => p.key === permissionKey
  );

  if (!hasPermission) {
    throw new Error('User does not have posting permission');
  }

  /* ================= APPROVAL CHECK ================= */
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

  if (approval.status !== 'APPROVED') {
    throw new Error('Document is not fully approved');
  }

  return true;
};