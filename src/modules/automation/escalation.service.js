const Approval = require('../workflow/approval.model');

exports.escalatePending = async () => {
  return Approval.update(
    { status: 'ESCALATED' },
    {
      where: {
        status: 'PENDING',
        createdAt: { $lt: new Date(Date.now() - 48*60*60*1000) }
      }
    }
  );
};
