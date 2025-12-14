const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./inventory.controller');

// GRN
router.post('/grn', auth('inventory.create'), ctrl.createGRN);
router.put('/grn/:id/approve', auth('inventory.approve'), ctrl.approveGRN);

// Inventory
router.post('/issue', auth('inventory.issue'), ctrl.issueMaterial);
router.get('/stock', auth('inventory.view'), ctrl.getStock);
router.get('/ledger', auth('inventory.view'), ctrl.getLedger);

module.exports = router;
