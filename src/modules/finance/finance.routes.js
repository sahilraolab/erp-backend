const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ module: 'finance', status: 'ok' });
});

module.exports = router;
