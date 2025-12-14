const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const report = require('./taxReport.service');

router.get('/gst-summary', auth, report.gstSummary);
router.get('/wct-summary', auth, report.wctSummary);

module.exports = router;
