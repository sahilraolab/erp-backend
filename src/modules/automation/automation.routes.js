const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ module: 'automation', status: 'ok' });
});

module.exports = router;
