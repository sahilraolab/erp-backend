const AuditLog = require('./audit.model');

module.exports = async ({ userId, action, module, recordId, meta = {} }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      module,
      recordId,
      meta
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};
