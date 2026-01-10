const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./accounts.controller');

// COA
router.post('/accounts', auth('accounts.create'), ctrl.createAccount);

// Vouchers
router.post('/vouchers', auth('accounts.create'), ctrl.createVoucher);
router.put('/vouchers/:id/post', auth('accounts.post'), ctrl.postVoucher);

// Reports
router.get('/trial-balance', auth('accounts.report'), ctrl.trialBalance);

router.post(
  '/accounts/schedule',
  auth('accounts.create'),
  ctrl.mapAccountSchedule
);

router.post(
  '/depreciation/:id/run',
  auth('accounts.post'),
  ctrl.runDepreciation
);

router.post(
  '/interest/:id/run',
  auth('accounts.post'),
  ctrl.runInterest
);


module.exports = router;
