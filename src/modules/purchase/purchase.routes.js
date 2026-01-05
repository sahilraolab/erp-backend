// src/modules/purchase/purchase.routes.js

const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const upload = require('../../core/upload.middleware');
const ctrl = require('./purchase.controller');

/* =====================================================
   MATERIAL REQUISITION (MR)
===================================================== */

router.post(
  '/requisitions',
  auth('purchase.create'),
  ctrl.createRequisition
);

router.put(
  '/requisitions/:id/submit',
  auth('purchase.create'),
  ctrl.submitRequisition
);

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
   RFQ (GLOBAL)
===================================================== */

router.post(
  '/rfqs',
  auth('purchase.create'),
  upload('rfq').single('file'),
  ctrl.createRFQ
);

router.get(
  '/rfqs',
  auth('purchase.view'),
  ctrl.listRFQs
);

/* =====================================================
   QUOTATION (MANUAL BY PURCHASE)
===================================================== */

router.post(
  '/quotations',
  auth('purchase.create'),
  upload('quotation').single('file'),
  ctrl.submitQuotation
);

router.put(
  '/quotations/:id/approve',
  auth('purchase.approve'),
  ctrl.approveQuotation
);

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

router.post(
  '/po',
  auth('purchase.approve'),
  upload('po').single('file'),
  ctrl.createPO
);

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

router.post(
  '/bills',
  auth('purchase.create'),
  upload('purchase-bill').single('file'),
  ctrl.createPurchaseBill
);

router.put(
  '/bills/:id/post',
  auth('purchase.approve'),
  ctrl.postPurchaseBill
);

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
