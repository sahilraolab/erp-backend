const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./engineering.controller');

/* ================= BUDGET ================= */
router.post('/budget', auth('engineering.create'), ctrl.createBudget);
router.put('/budget/:id/approve', auth('engineering.approve'), ctrl.approveBudget);
router.get('/budget', auth('engineering.view'), ctrl.listBudgets);

/* ================= ESTIMATE ================= */
router.post('/estimate', auth('engineering.create'), ctrl.createEstimate);
router.post('/estimate/version', auth('engineering.update'), ctrl.addEstimateVersion);
router.put('/estimate/:id/approve', auth('engineering.approve'), ctrl.approveEstimate);

/* ================= BBS ================= */
router.post('/bbs', auth('engineering.create'), ctrl.createBBS);
router.put('/bbs/:id/approve', auth('engineering.approve'), ctrl.approveBBS);

/* ================= DRAWINGS ================= */
router.post('/drawings', auth('engineering.create'), ctrl.createDrawing);
router.post('/drawings/revision', auth('engineering.update'), ctrl.reviseDrawing);
router.put('/drawings/:id/approve', auth('engineering.approve'), ctrl.approveDrawing);
router.get('/drawings', auth('engineering.view'), ctrl.listDrawings);

/* ================= COMPLIANCE ================= */
router.post('/compliance', auth('engineering.create'), ctrl.addCompliance);
router.put('/compliance/:id', auth('engineering.update'), ctrl.updateCompliance);
router.put('/compliance/:id/close', auth('engineering.approve'), ctrl.closeCompliance);
router.get('/compliance', auth('engineering.view'), ctrl.listCompliance);
router.get('/compliance/:id', auth('engineering.view'), ctrl.getCompliance);


/* ================= READ ================= */
router.get('/bbs', auth('engineering.view'), ctrl.listBBS);
router.get('/estimate', auth('engineering.view'), ctrl.listEstimates);
router.get('/budget/:projectId', auth('engineering.view'), ctrl.getBudget);

module.exports = router;
