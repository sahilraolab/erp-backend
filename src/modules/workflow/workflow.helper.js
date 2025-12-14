const WorkflowInstance = require('./workflowInstance.model');

exports.ensureApproved = async (module, entity, recordId) => {
  const instance = await WorkflowInstance.findOne({
    where: { recordId }
  });

  if (!instance || instance.status !== 'APPROVED') {
    throw new Error(`${module} ${entity} not approved`);
  }
};
