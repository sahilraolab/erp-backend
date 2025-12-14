// const router = require('express').Router();

// router.get('/health', (req, res) => {
//   res.json({ module: 'qaqc', status: 'ok' });
// });

// module.exports = router;

const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./qaqc.controller');

// Material Tests
router.post('/tests', auth('qaqc.create'), ctrl.createTestReport);

// RMC
router.post('/rmc-batches', auth('qaqc.create'), ctrl.createRMCBatch);

// Pour Cards
router.post('/pour-cards', auth('qaqc.create'), ctrl.createPourCard);
router.put('/pour-cards/:id/approve', auth('qaqc.approve'), ctrl.approvePourCard);

// Snags
router.post('/snags', auth('qaqc.create'), ctrl.createSnag);
router.put('/snags/:id/close', auth('qaqc.approve'), ctrl.closeSnag);
router.get('/snags', auth('qaqc.view'), ctrl.listSnags);

module.exports = router;
