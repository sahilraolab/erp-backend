const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./engineering.controller');

// Budget
router.post('/budget', auth('engineering.create'), ctrl.createBudget);
router.put('/budget/:id/approve', auth('engineering.approve'), ctrl.approveBudget);

// Estimate
router.post('/estimate', auth('engineering.create'), ctrl.createEstimate);
router.post('/estimate/version', auth('engineering.update'), ctrl.addEstimateVersion);

// BBS
router.post('/bbs', auth('engineering.create'), ctrl.createBBS);

// Drawings
router.post('/drawings', auth('engineering.create'), ctrl.createDrawing);
router.post('/drawings/revision', auth('engineering.update'), ctrl.reviseDrawing);
router.put('/drawings/:id/approve', auth('engineering.approve'), ctrl.approveDrawing);

// Compliance
router.post('/compliance', auth('engineering.create'), ctrl.addCompliance);

module.exports = router;
