const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./site.controller');

/* ================= SITE REQUISITION ================= */

router.post(
  '/requisitions',
  auth('site.create'),
  ctrl.createSiteReq
);

router.get(
  '/requisitions',
  auth('site.view'),
  ctrl.listSiteReqs
);

router.put(
  '/requisitions/:id/approve',
  auth('site.approve'),
  ctrl.approveSiteReq
);

router.put(
  '/requisitions/:id/submit',
  auth('site.create'),
  ctrl.submitSiteReq
);


/* ================= SITE GRN ================= */

router.post(
  '/grn',
  auth('site.create'),
  ctrl.receiveAtSite
);

router.get(
  '/grn',
  auth('site.view'),
  ctrl.listSiteGRN
);

router.put(
  '/grn/:id/approve',
  auth('site.approve'),
  ctrl.approveSiteGRN
);

/* ================= SITE STOCK ================= */

router.get(
  '/stock',
  auth('site.view'),
  ctrl.siteStock
);

/* ================= SITE ↔ INVENTORY / SITE TRANSFER ================= */

router.post(
  '/transfers',
  auth('site.create'),
  ctrl.createTransfer
);

router.get(
  '/transfers',
  auth('site.view'),
  ctrl.listTransfers
);

router.put(
  '/transfers/:id/approve',
  auth('site.approve'),
  ctrl.approveTransfer
);

/* ================= REPORTS ================= */

router.post(
  '/dpr',
  auth('site.create'),
  ctrl.createDPR
);

router.post(
  '/wpr',
  auth('site.create'),
  ctrl.createWPR
);

router.post(
  '/muster',
  auth('site.create'),
  ctrl.createMuster
);

module.exports = router;
