const router = require('express').Router();
const ctrl = require('./approval.controller');

/* ERP-SAFE AUTH (COMPANY SCOPED) */
const authCompany = require('../../core/auth.company.middleware');

/* ================= INITIATE ================= */
router.post(
  '/initiate',
  authCompany('approval.initiate'),
  ctrl.initiate
);

/* ================= APPROVE ================= */
router.post(
  '/approve',
  authCompany('approval.approve'),
  ctrl.approve
);

/* ================= REJECT ================= */
router.post(
  '/reject',
  authCompany('approval.reject'),
  ctrl.reject
);

module.exports = router;