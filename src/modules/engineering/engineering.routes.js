const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./engineering.controller');
const upload = require('./engineering.upload');

/* =====================================================
   BUDGET
===================================================== */

router.post(
  '/budget',
  auth('engineering.create'),
  ctrl.createBudget
);

router.put(
  '/budget/:id/approve',
  auth('engineering.approve'),
  ctrl.approveBudget
);

router.get(
  '/budget',
  auth('engineering.view'),
  ctrl.listBudgets
);

router.get(
  '/budget/template',
  auth('engineering.view'),
  ctrl.exportBudgetTemplate
);

router.post(
  '/budget/import',
  auth('engineering.create'),
  upload.single('file'),
  ctrl.importBudgetExcel
);

router.get(
  '/budget/export',
  auth('engineering.view'),
  ctrl.exportBudgetData
);

router.get(
  '/budget/:projectId',
  auth('engineering.view'),
  ctrl.getBudget
);

/* =====================================================
   ESTIMATE
===================================================== */

router.post(
  '/estimate',
  auth('engineering.create'),
  ctrl.createEstimate
);

router.post(
  '/estimate/version',
  auth('engineering.update'),
  ctrl.addEstimateVersion
);

router.put(
  '/estimate/:id/approve',
  auth('engineering.approve'),
  ctrl.approveEstimate
);

router.get(
  '/estimate',
  auth('engineering.view'),
  ctrl.listEstimates
);

router.get(
  '/estimate/template',
  auth('engineering.view'),
  ctrl.exportEstimateTemplate
);

router.post(
  '/estimate/import',
  auth('engineering.create'),
  upload.single('file'),
  ctrl.importEstimateExcel
);

router.get(
  '/estimate/export',
  auth('engineering.view'),
  ctrl.exportEstimateData
);

/* =====================================================
   BBS / BOQ
===================================================== */

router.post(
  '/bbs',
  auth('engineering.create'),
  ctrl.createBBS
);

router.put(
  '/bbs/:id/approve',
  auth('engineering.approve'),
  ctrl.approveBBS
);

router.get(
  '/bbs',
  auth('engineering.view'),
  ctrl.listBBS
);

router.get(
  '/bbs/template',
  auth('engineering.view'),
  ctrl.exportBBSTemplate
);

router.post(
  '/bbs/import',
  auth('engineering.create'),
  upload.single('file'),
  ctrl.importBBSExcel
);

router.get(
  '/bbs/export',
  auth('engineering.view'),
  ctrl.exportBBSData
);

/* =====================================================
   DRAWINGS
===================================================== */

router.post(
  '/drawings',
  auth('engineering.create'),
  upload.single('file'),
  ctrl.createDrawing
);

router.post(
  '/drawings/revision',
  auth('engineering.update'),
  ctrl.reviseDrawing
);

router.put(
  '/drawings/:id/approve',
  auth('engineering.approve'),
  ctrl.approveDrawing
);

router.put(
  '/drawings/revision/:id/approve',
  auth('engineering.approve'),
  ctrl.approveDrawingRevision
);

router.get(
  '/drawings',
  auth('engineering.view'),
  ctrl.listDrawings
);

/* =====================================================
   COMPLIANCE
===================================================== */

router.post(
  '/compliance',
  upload.single('file'),
  auth('engineering.create'),
  ctrl.addCompliance
);

router.put(
  '/compliance/:id',
  auth('engineering.update'),
  ctrl.updateCompliance
);

router.put(
  '/compliance/:id/close',
  auth('engineering.approve'),
  ctrl.closeCompliance
);

router.get(
  '/compliance',
  auth('engineering.view'),
  ctrl.listCompliance
);

router.get(
  '/compliance/:id',
  auth('engineering.view'),
  ctrl.getCompliance
);

/* =====================================================
   EXPORT
===================================================== */
/*
  NOTE:
  - All exports are controller-based
  - No service usage inside routes
  - No anonymous async handlers
*/

module.exports = router;
