const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./mis.controller');
const budgetCtrl = require('./misBudget.controller');

router.get('/dashboard', auth, ctrl.dashboard);
router.get('/budget-vs-actual', auth, budgetCtrl.budgetVsActual);


module.exports = router;
