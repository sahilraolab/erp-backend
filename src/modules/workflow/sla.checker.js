// workflow/sla.checker.js
const Instance = require('./workflowInstance.model');
const Step = require('./workflowStep.model');

exports.checkSLA = async () => {
  const pending = await Instance.findAll({
    where: { status: 'PENDING' }
  });

  for (const i of pending) {
    const step = await Step.findOne({
      where: {
        workflowId: i.workflowId,
        stepOrder: i.currentStep
      }
    });

    // Compare createdAt + SLA
    // Trigger alert (email / notification hook)
  }
};
