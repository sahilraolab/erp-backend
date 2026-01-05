const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./purchase.controller');

/* =====================================================
   MATERIAL REQUISITION (MR)
===================================================== */

// CREATE
router.post(
  '/requisitions',
  auth('purchase.create'),
  ctrl.createRequisition
);

// SUBMIT
router.put(
  '/requisitions/:id/submit',
  auth('purchase.create'),
  ctrl.submitRequisition
);

// READ
router.get(
  '/requisitions',
  auth('purchase.view'),
  ctrl.listRequisitions
);

router.get(
  '/requisitions/:id',
  auth('purchase.view'),
  ctrl.getRequisition
);

/* =====================================================
   RFQ
===================================================== */

// CREATE
router.post(
  '/rfqs',
  auth('purchase.create'),
  ctrl.createRFQ
);

// READ
router.get(
  '/rfqs',
  auth('purchase.view'),
  ctrl.listRFQs
);

/* =====================================================
   QUOTATION
===================================================== */

// CREATE (Supplier submits quotation)
router.post(
  '/quotations',
  auth('purchase.create'),
  ctrl.submitQuotation
);

// APPROVE
router.put(
  '/quotations/:id/approve',
  auth('purchase.approve'),
  ctrl.approveQuotation
);

// READ
router.get(
  '/quotations',
  auth('purchase.view'),
  ctrl.listQuotations
);

router.get(
  '/quotations/:id',
  auth('purchase.view'),
  ctrl.getQuotation
);

/* =====================================================
   PURCHASE ORDER (PO)
===================================================== */

// CREATE
router.post(
  '/po',
  auth('purchase.approve'),
  ctrl.createPO
);

// READ
router.get(
  '/po',
  auth('purchase.view'),
  ctrl.listPOs
);

router.get(
  '/po/:id',
  auth('purchase.view'),
  ctrl.getPO
);

/* =====================================================
   PURCHASE BILL
===================================================== */

// CREATE
router.post(
  '/bills',
  auth('purchase.create'),
  ctrl.createPurchaseBill
);

// POST TO ACCOUNTS
router.put(
  '/bills/:id/post',
  auth('purchase.approve'),
  ctrl.postPurchaseBill
);

// READ
router.get(
  '/bills',
  auth('purchase.view'),
  ctrl.listPurchaseBills
);

router.get(
  '/bills/:id',
  auth('purchase.view'),
  ctrl.getPurchaseBill
);

module.exports = router;
