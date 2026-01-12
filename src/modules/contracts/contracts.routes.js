// src/modules/contracts/contracts.routes.js

const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./contracts.controller');

/* =====================================================
   CONTRACTORS
===================================================== */

router.post(
  '/contractors',
  auth('contracts.create'),
  ctrl.createContractor
);

router.get(
  '/contractors',
  auth('contracts.view'),
  ctrl.listContractors
);

/* =====================================================
   LABOUR RATES
===================================================== */

router.post(
  '/labour-rates',
  auth('contracts.create'),
  ctrl.addLabourRate
);

// (Optional later)
// router.get('/labour-rates', auth('contracts.view'), ctrl.listLabourRates);

/* =====================================================
   WORK ORDERS
===================================================== */

router.post(
  '/work-orders',
  auth('contracts.create'),
  ctrl.createWO
);

router.put(
  '/work-orders/:id/approve',
  auth('contracts.approve'),
  ctrl.approveWO
);

router.post(
  '/work-orders/:id/revise',
  auth('contracts.update'),
  ctrl.reviseWO
);

router.get(
  '/work-orders',
  auth('contracts.view'),
  ctrl.listWOs
);

router.get(
  '/work-orders/:id',
  auth('contracts.view'),
  ctrl.getWO
);

/* =====================================================
   RUNNING ACCOUNT (RA) BILLS
===================================================== */

router.post(
  '/ra-bills',
  auth('contracts.create'),
  ctrl.createRABill
);

router.put(
  '/ra-bills/:id/approve',
  auth('contracts.approve'),
  ctrl.approveRABill
);

router.put(
  '/ra-bills/:id/post',
  auth('contracts.approve'),
  ctrl.postRABill
);

router.get(
  '/ra-bills',
  auth('contracts.view'),
  ctrl.listRABills
);

router.get(
  '/ra-bills/:id',
  auth('contracts.view'),
  ctrl.getRABill
);

/* =====================================================
   ADVANCES
===================================================== */

router.post(
  '/advances',
  auth('contracts.create'),
  ctrl.createAdvance
);

router.get(
  '/advances',
  auth('contracts.view'),
  ctrl.listAdvances
);

/* =====================================================
   DEBIT / CREDIT NOTES
===================================================== */

router.post(
  '/dc-notes',
  auth('contracts.create'),
  ctrl.createDCNote
);

router.put(
  '/dc-notes/:id/post',
  auth('contracts.approve'),
  ctrl.postDCNote
);

router.get(
  '/dc-notes',
  auth('contracts.view'),
  ctrl.listDCNotes
);

router.get(
  '/dc-notes/:id',
  auth('contracts.view'),
  ctrl.getDCNote
);

module.exports = router;
