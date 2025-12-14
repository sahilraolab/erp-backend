const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./report.controller');

router.get('/pl', auth('accounts.report'), ctrl.pl);
router.get('/bs', auth('accounts.report'), ctrl.bs);
router.get('/cash-flow', auth('accounts.report'), ctrl.cashFlow);

module.exports = router;
