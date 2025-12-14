const router = require('express').Router();
const service = require('./analytics.service');

router.get('/cost-vs-budget/:projectId', async (req,res)=>{
  res.json(await service.costVsBudget(req.params.projectId));
});

router.get('/vendor-performance', async (req,res)=>{
  res.json(await service.vendorPerformance());
});

module.exports = router;
