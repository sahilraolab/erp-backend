const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./masters.controller');

const r = (name) => ctrl[name];

router.post('/projects', auth('masters.create'), r('project').create);
router.get('/projects', auth('masters.view'), r('project').list);
router.put('/projects/:id', auth('masters.update'), r('project').update);
router.delete('/projects/:id', auth('masters.delete'), r('project').remove);

router.post('/materials', auth('masters.create'), r('material').create);
router.get('/materials', auth('masters.view'), r('material').list);

router.put('/materials/:id', auth('masters.update'), r('material').update);
router.delete('/materials/:id', auth('masters.update'), r('material').remove);

router.post('/companies', auth('masters.create'), r('company').create);
router.get('/companies', auth('masters.view'), r('company').list);
router.put('/companies/:id', auth('masters.update'), r('company').update);
router.delete('/companies/:id', auth('masters.update'), r('company').remove);

router.post('/branches', auth('masters.create'), r('branch').create);
router.get('/branches', auth('masters.view'), r('branch').list);
router.put('/branches/:id', auth('masters.update'), r('branch').update);
router.delete('/branches/:id', auth('masters.update'), r('branch').remove);

router.post('/suppliers', auth('masters.create'), r('supplier').create);
router.get('/suppliers', auth('masters.view'), r('supplier').list);

router.post('/uoms', auth('masters.create'), r('uom').create);
router.get('/uoms', auth('masters.view'), r('uom').list);

router.post('/departments', auth('masters.create'), r('department').create);
router.get('/departments', auth('masters.view'), r('department').list);

router.post('/cost-centers', auth('masters.create'), r('costCenter').create);
router.get('/cost-centers', auth('masters.view'), r('costCenter').list);

router.post('/taxes', auth('masters.create'), r('tax').create);
router.get('/taxes', auth('masters.view'), r('tax').list);

// suppliers
router.put('/suppliers/:id', auth('masters.update'), r('supplier').update);
router.delete('/suppliers/:id', auth('masters.delete'), r('supplier').remove);

// uoms
router.put('/uoms/:id', auth('masters.update'), r('uom').update);
router.delete('/uoms/:id', auth('masters.delete'), r('uom').remove);

// departments
router.put('/departments/:id', auth('masters.update'), r('department').update);
router.delete('/departments/:id', auth('masters.delete'), r('department').remove);

// cost centers
router.put('/cost-centers/:id', auth('masters.update'), r('costCenter').update);
router.delete('/cost-centers/:id', auth('masters.delete'), r('costCenter').remove);

// taxes
router.put('/taxes/:id', auth('masters.update'), r('tax').update);
router.delete('/taxes/:id', auth('masters.delete'), r('tax').remove);


module.exports = router;
