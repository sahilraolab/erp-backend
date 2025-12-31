const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./dashboard.service');

router.get(
  '/summary',
  auth,
  async (req, res) => {
    const data = await ctrl.summary({
      role: req.user.role?.name || 'ADMIN',
      projectId: req.query.projectId || null
    });
    res.json(data);
  }
);

module.exports = router;
