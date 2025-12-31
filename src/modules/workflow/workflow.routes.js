const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const service = require('./workflow.service');

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

module.exports = router;
