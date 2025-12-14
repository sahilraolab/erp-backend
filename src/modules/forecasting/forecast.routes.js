const router = require('express').Router();
const svc = require('./forecast.service');

router.get('/overrun/:projectId', async (req,res)=>{
  res.json(await svc.projectOverrunForecast(req.params.projectId));
});

module.exports = router;
