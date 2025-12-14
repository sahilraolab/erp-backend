const AuditLog = require('./audit.model');

module.exports = async ({
  userId,
  action,
  module,
  recordId = null,
  meta = {},
  transaction = null
}) => {
  if (!userId || !action || !module) {
    console.warn('Audit skipped: missing required fields');
    return;
  }

  try {
    await AuditLog.create(
      {
        userId,
        action,
        module,
        recordId,
        meta,
        createdAt: new Date()
      },
      transaction ? { transaction } : {}
    );
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};
