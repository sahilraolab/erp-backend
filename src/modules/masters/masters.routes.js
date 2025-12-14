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

module.exports = router;
