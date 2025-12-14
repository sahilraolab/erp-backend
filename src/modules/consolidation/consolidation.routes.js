const router = require('express').Router();
const svc = require('./consolidation.service');

router.post('/pl', async (req,res)=>{
  res.json(await svc.consolidatedPL(req.body.companyIds));
});

module.exports = router;
