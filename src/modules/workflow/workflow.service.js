const Workflow = require('./workflow.model');
const Step = require('./workflowStep.model');
const Instance = require('./workflowInstance.model');
const Action = require('./workflowAction.model');
const User = require('../admin/user.model'); // adjust path if needed

exports.start = async ({ module, entity, recordId }) => {
  // Prevent duplicate instances
  const existing = await Instance.findOne({
    where: { recordId, status: 'PENDING' }
  });

  if (existing) return existing;

  const workflow = await Workflow.findOne({
    where: { module, entity, isActive: true }
  });

  // Auto-approve if no workflow configured
  if (!workflow) {
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

  if (!steps.length) {
    return Instance.create({
      workflowId: workflow.id,
      recordId,
      status: 'APPROVED'
    });
  }

  return Instance.create({
    workflowId: workflow.id,
    recordId,
    currentStep: steps[0].stepOrder,
    status: 'PENDING'
  });
};

exports.act = async ({ instanceId, userId, action, remarks }) => {
  const instance = await Instance.findByPk(instanceId);
  if (!instance) throw new Error('Workflow instance not found');

  if (instance.status !== 'PENDING') {
    throw new Error('Workflow already completed');
  }

  const step = await Step.findOne({
    where: {
      workflowId: instance.workflowId,
      stepOrder: instance.currentStep
    }
  });

  if (!step) throw new Error('Workflow step not found');

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // 🔐 Role enforcement
  if (step.roleId && step.roleId !== user.roleId) {
    throw new Error('Not authorized for this approval step');
  }

  // Prevent duplicate action
  const alreadyActed = await Action.findOne({
    where: {
      instanceId,
      stepOrder: instance.currentStep
    }
  });

  if (alreadyActed) {
    throw new Error('Action already taken on this step');
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
