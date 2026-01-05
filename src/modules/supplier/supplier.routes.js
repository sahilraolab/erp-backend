const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./supplier.controller');

/* =====================================================
   SUPPLIER RFQs
===================================================== */

router.get(
  '/rfqs',
  auth('supplier.rfq.view'),
  ctrl.listSupplierRFQs
);

/* =====================================================
   SUPPLIER QUOTATIONS
===================================================== */

// submit quotation against RFQ
router.post(
  '/quotations',
  auth('supplier.quotation.create'),
  ctrl.submitSupplierQuotation
);

// quotation history (list)
router.get(
  '/quotations',
  auth('supplier.quotation.view'),
  ctrl.listSupplierQuotations
);

// quotation detail (read-only)
router.get(
  '/quotations/:id',
  auth('supplier.quotation.view'),
  ctrl.getSupplierQuotation
);

module.exports = router;
