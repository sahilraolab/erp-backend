const Workflow = require('./workflow.model');
const Step = require('./workflowStep.model');
const Instance = require('./workflowInstance.model');
const Action = require('./workflowAction.model');

exports.start = async ({ module, entity, recordId }) => {
  const workflow = await Workflow.findOne({
    where: { module, entity, isActive: true }
  });

  if (!workflow) {
    // Explicitly allow auto-approve if workflow not configured
    return Instance.create({
      workflowId: null,
      recordId,
      status: 'APPROVED'
    });
  }

  const steps = await Step.findAll({
    where: { workflowId: workflow.id },
    order: [['stepOrder', 'ASC']]
  });

  return Instance.create({
    workflowId: workflow.id,
    recordId,
    currentStep: steps[0].stepOrder
  });
};

exports.act = async ({ instanceId, userId, action, remarks }) => {
  const instance = await Instance.findByPk(instanceId);
  if (!instance || instance.status !== 'PENDING') {
    throw new Error('Invalid workflow instance');
  }

  const step = await Step.findOne({
    where: {
      workflowId: instance.workflowId,
      stepOrder: instance.currentStep
    }
  });

  if (!step) {
    throw new Error('Workflow step not found');
  }

  // 🔐 ROLE CHECK (CRITICAL)
  if (step.roleId && step.roleId !== user.roleId) {
    throw new Error('You are not authorized to act on this step');
  }

  await Action.create({
    instanceId,
    stepOrder: instance.currentStep,
    userId,
    action,
    remarks
  });

  if (action === 'REJECT') {
    await instance.update({ status: 'REJECTED' });
    return;
  }

  const steps = await Step.findAll({
    where: { workflowId: instance.workflowId },
    order: [['stepOrder', 'ASC']]
  });

  const idx = steps.findIndex(s => s.stepOrder === instance.currentStep);

  if (idx === steps.length - 1) {
    await instance.update({ status: 'APPROVED' });
  } else {
    await instance.update({
      currentStep: steps[idx + 1].stepOrder
    });
  }
};
