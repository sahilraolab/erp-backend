const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./masters.controller');

const protect = {
  create: auth('masters.create'),
  view: auth('masters.view'),
  update: auth('masters.update'),
  delete: auth('masters.delete')
};

/* -----------------------------
 * Companies
 * ----------------------------- */
router.post('/companies', protect.create, ctrl.company.create);
router.get('/companies', protect.view, ctrl.company.list);
router.get('/companies/:id', protect.view, ctrl.company.getById);
router.put('/companies/:id', protect.update, ctrl.company.update);
// router.delete('/companies/:id', protect.delete, ctrl.company.remove);

/* -----------------------------
 * Projects
 * ----------------------------- */
router.post('/projects', protect.create, ctrl.project.create);
router.get('/projects', protect.view, ctrl.project.list);
router.get('/projects/:id', protect.view, ctrl.project.getById);
router.put('/projects/:id', protect.update, ctrl.project.update);
// router.delete('/projects/:id', protect.delete, ctrl.project.remove);

/* -----------------------------
 * Materials
 * ----------------------------- */
router.post('/materials', protect.create, ctrl.material.create);
router.get('/materials', protect.view, ctrl.material.list);
router.get('/materials/:id', protect.view, ctrl.material.getById);
router.put('/materials/:id', protect.update, ctrl.material.update);
// router.delete('/materials/:id', protect.delete, ctrl.material.remove);

/* -----------------------------
 * Suppliers
 * ----------------------------- */
router.post('/suppliers', protect.create, ctrl.supplier.create);
router.get('/suppliers', protect.view, ctrl.supplier.list);
router.get('/suppliers/:id', protect.view, ctrl.supplier.getById);
router.put('/suppliers/:id', protect.update, ctrl.supplier.update);
router.delete('/suppliers/:id', protect.delete, ctrl.supplier.remove);

/* -----------------------------
 * UOM
 * ----------------------------- */
router.post('/uoms', protect.create, ctrl.uom.create);
router.get('/uoms', protect.view, ctrl.uom.list);
router.get('/uoms/:id', protect.view, ctrl.uom.getById);
router.put('/uoms/:id', protect.update, ctrl.uom.update);
// router.delete('/uoms/:id', protect.delete, ctrl.uom.remove);

/* -----------------------------
 * Departments
 * ----------------------------- */
router.post('/departments', protect.create, ctrl.department.create);
router.get('/departments', protect.view, ctrl.department.list);
router.get('/departments/:id', protect.view, ctrl.department.getById);
router.put('/departments/:id', protect.update, ctrl.department.update);
// router.delete('/departments/:id', protect.delete, ctrl.department.remove);

/* -----------------------------
 * Cost Centers
 * ----------------------------- */
router.post('/cost-centers', protect.create, ctrl.costCenter.create);
router.get('/cost-centers', protect.view, ctrl.costCenter.list);
router.get('/cost-centers/:id', protect.view, ctrl.costCenter.getById);
router.put('/cost-centers/:id', protect.update, ctrl.costCenter.update);
// router.delete('/cost-centers/:id', protect.delete, ctrl.costCenter.remove);

/* -----------------------------
 * Taxes
 * ----------------------------- */
router.post('/taxes', protect.create, ctrl.tax.create);
router.get('/taxes', protect.view, ctrl.tax.list);
router.get('/taxes/:id', protect.view, ctrl.tax.getById);
router.put('/taxes/:id', protect.update, ctrl.tax.update);
// router.delete('/taxes/:id', protect.delete, ctrl.tax.remove);

module.exports = router;
