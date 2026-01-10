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
router.put('/ra-bills/:id/post', auth('contracts.approve'), ctrl.postRABill);

// Advances
router.post('/advances', auth('contracts.create'), ctrl.createAdvance);

// Debit / Credit
router.post('/dc-notes', auth('contracts.create'), ctrl.createDCNote);

router.put(
    '/dc-notes/:id/post',
    auth('contracts.approve'),
    ctrl.postDCNote
);

// Contractors
router.get('/contractors', auth('contracts.view'), async (req, res) => {
  res.json(await Contractor.findAll());
});

// Work Orders
router.get('/work-orders', auth('contracts.view'), async (req, res) => {
  res.json(await WorkOrder.findAll({ include: [WorkOrderLine] }));
});

// RA Bills
router.get('/ra-bills', auth('contracts.view'), async (req, res) => {
  res.json(await RABill.findAll({ include: [RABillLine] }));
});



module.exports = router;
