// const Approval = require('./approval.model');

// exports.requestApproval = async (module, recordId) => {
//   return Approval.create({
//     module,
//     recordId,
//     status: 'PENDING'
//   });
// };

// exports.approve = async (id, userId) => {
//   return Approval.update(
//     { status: 'APPROVED', approvedBy: userId },
//     { where: { id } }
//   );
// };

const Workflow = require('./workflow.model');
const Step = require('./workflowStep.model');
const Instance = require('./workflowInstance.model');
const Action = require('./workflowAction.model');

exports.start = async ({ module, entity, recordId }) => {
  const workflow = await Workflow.findOne({
    where: { module, entity, isActive: true }
  });

  if (!workflow) return null;

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
  if (!instance || instance.status !== 'PENDING') return;

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
