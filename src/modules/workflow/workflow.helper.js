const WorkflowInstance = require('./workflowInstance.model');

exports.ensureApproved = async (module, entity, recordId) => {
  const instance = await WorkflowInstance.findOne({
    include: {
      model: Workflow,
      where: { module, entity }
    },
    where: { recordId }
  });

  if (!instance || instance.status !== 'APPROVED') {
    throw new Error(`${module} ${entity} not approved`);
  }
};
