const router = require('express').Router();
const service = require('./dashboard.service');

router.get('/summary', async (req, res) => {
  res.json(await service.projectSummary());
});

module.exports = router;
