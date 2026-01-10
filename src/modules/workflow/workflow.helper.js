const WorkflowInstance = require('./workflowInstance.model');
const Workflow = require('./workflow.model');

exports.ensureApproved = async (module, entity, recordId) => {
  const instance = await WorkflowInstance.findOne({
    include: {
      model: Workflow,
      where: { module, entity }
    },
    where: { recordId }
  });

  if (!instance) {
    throw new Error(`Workflow instance not found for ${module}:${entity}`);
  }

  if (instance.status !== 'APPROVED') {
    throw new Error(`${module} ${entity} not approved`);
  }

  return true;
};
