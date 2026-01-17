const ApprovalRequest = require('../modules/approvals/approvalRequest.model');

module.exports = async function checkPostingAuthority({
  user,
  companyId,
  documentType,
  documentId,
  role
}) {
  /* ================= PERMISSION CHECK ================= */

  const permissions = role.permissions || [];

  const postingPermissionKey = `${documentType}.post`;

  const hasPostPermission = permissions.some(
    p => p.key === postingPermissionKey
  );

  if (!hasPostPermission) {
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

  if (approval && approval.status !== 'APPROVED') {
    throw new Error('Document is not fully approved');
  }

  return true;
};