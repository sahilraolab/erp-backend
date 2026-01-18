// src/core/audit.js
const AuditLog = require('./audit.model');

module.exports = async ({
  userId,
  companyId,
  action,
  module,
  recordId = null,
  meta = {},
  transaction = null
}) => {
  if (!userId || !companyId || !action || !module) {
    throw new Error('Audit log requires userId, companyId, action and module');
  }

  try {
    await AuditLog.create(
      {
        userId,
        companyId,
        action: action.toUpperCase(),
        module: module.toUpperCase(),
        recordId,
        meta
      },
      transaction ? { transaction } : {}
    );
  } catch (err) {
    // Audit must NEVER break main flow
    console.error('Audit log failed:', err.message);
  }
};