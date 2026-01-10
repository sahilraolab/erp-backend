const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const service = require('./workflow.service');
const Instance = require('./workflowInstance.model');
const Action = require('./workflowAction.model');
const Workflow = require('./workflow.model');

router.post(
  '/action',
  auth('workflow.action'),
  async (req, res) => {
    const { instanceId, action, remarks } = req.body;

    await service.act({
      instanceId,
      userId: req.user.id,
      action,
      remarks
    });

    res.json({ success: true });
  }
);

router.get('/my-pending', auth('workflow.view'), async (req, res) => {
  const instances = await Instance.findAll({
    where: { status: 'PENDING' },
    include: [Workflow]
  });

  res.json(instances);
});

router.get('/instance/:id', auth('workflow.view'), async (req, res) => {
  const instance = await Instance.findByPk(req.params.id, {
    include: [Workflow, Action]
  });

  if (!instance) {
    return res.status(404).json({ message: 'Workflow not found' });
  }

  res.json(instance);
});

module.exports = router;
