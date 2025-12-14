const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const gstr = require('./gstr.service');
const sch = require('./schedule2.service');

router.get('/gstr1', auth, gstr.gstr1Summary);
router.get('/schedule-bs', auth, sch.balanceSheetSchedule);

module.exports = router;
