// const router = require('express').Router();

// router.get('/health', (req, res) => {
//   res.json({ module: 'contracts', status: 'ok' });
// });

// module.exports = router;

const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./contracts.controller');

// Contractor
router.post('/contractors', auth('contracts.create'), ctrl.createContractor);

// Labour
router.post('/labour-rates', auth('contracts.create'), ctrl.addLabourRate);

// Work Orders
router.post('/work-orders', auth('contracts.create'), ctrl.createWO);
router.put('/work-orders/:id/approve', auth('contracts.approve'), ctrl.approveWO);
router.post('/work-orders/revise', auth('contracts.update'), ctrl.reviseWO);

// RA Bills
router.post('/ra-bills', auth('contracts.create'), ctrl.createRABill);
router.put('/ra-bills/:id/approve', auth('contracts.approve'), ctrl.approveRABill);

// Advances
router.post('/advances', auth('contracts.create'), ctrl.createAdvance);

// Debit / Credit
router.post('/dc-notes', auth('contracts.create'), ctrl.createDCNote);

module.exports = router;
