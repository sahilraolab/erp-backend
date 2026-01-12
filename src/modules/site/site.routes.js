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

// Site GRN
router.get(
  '/grn/:id',
  auth('site.view'),
  ctrl.getSiteGRN
);

// Site Transfer
router.get(
  '/transfers/:id',
  auth('site.view'),
  ctrl.getTransfer
);

// DPR
router.get(
  '/dpr',
  auth('site.view'),
  ctrl.listDPR
);

router.get(
  '/dpr/:id',
  auth('site.view'),
  ctrl.getDPR
);

// WPR
router.get(
  '/wpr',
  auth('site.view'),
  ctrl.listWPR
);

router.get(
  '/wpr/:id',
  auth('site.view'),
  ctrl.getWPR
);

// Muster
router.get(
  '/muster',
  auth('site.view'),
  ctrl.listMuster
);

router.get(
  '/muster/:id',
  auth('site.view'),
  ctrl.getMuster
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
