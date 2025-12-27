const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./purchase.controller');

// MR
router.post('/requisitions', auth('purchase.create'), ctrl.createRequisition);
router.put('/requisitions/:id/submit', auth('purchase.create'), ctrl.submitRequisition);

// RFQ
router.post('/rfqs', auth('purchase.create'), ctrl.createRFQ);

// Quotation
router.post('/quotations', auth('purchase.create'), ctrl.submitQuotation);
router.put('/quotations/:id/approve', auth('purchase.approve'), ctrl.approveQuotation);

// PO
router.post('/po', auth('purchase.approve'), ctrl.createPO);

// Purchase Bills
router.post(
  '/bills',
  auth('purchase.create'),
  ctrl.createPurchaseBill
);

router.put(
  '/bills/:id/post',
  auth('purchase.approve'),
  ctrl.postPurchaseBill
);


module.exports = router;
