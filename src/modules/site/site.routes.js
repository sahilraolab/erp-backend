// const router = require('express').Router();

// router.get('/health', (req, res) => {
//   res.json({ module: 'site', status: 'ok' });
// });

// module.exports = router;

const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./site.controller');

// Site Material
router.post('/requisitions', auth('site.create'), ctrl.createSiteReq);
router.put('/requisitions/:id/approve', auth('site.approve'), ctrl.approveSiteReq);

// Site GRN
router.post('/grn', auth('site.create'), ctrl.receiveAtSite);

// Stock
router.post('/stock/update', auth('site.issue'), ctrl.updateSiteStock);
router.get('/stock', auth('site.view'), ctrl.siteStock);

// Transfer
router.post('/transfer', auth('site.create'), ctrl.transferMaterial);

// Reports
router.post('/dpr', auth('site.create'), ctrl.createDPR);
router.post('/wpr', auth('site.create'), ctrl.createWPR);
router.post('/muster', auth('site.create'), ctrl.createMuster);

module.exports = router;
