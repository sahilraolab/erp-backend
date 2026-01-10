const Instance = require('./workflowInstance.model');
const Step = require('./workflowStep.model');

exports.checkSLA = async () => {
  const pending = await Instance.findAll({
    where: { status: 'PENDING' }
  });

  const now = new Date();

  for (const i of pending) {
    const step = await Step.findOne({
      where: {
        workflowId: i.workflowId,
        stepOrder: i.currentStep
      }
    });

    if (!step || !step.slaHours) continue;

    const deadline = new Date(i.createdAt);
    deadline.setHours(deadline.getHours() + step.slaHours);

    if (now > deadline) {
      // 🔔 hook for notification / email / escalation
      console.warn(`SLA breached for workflow instance ${i.id}`);
    }
  }
};
