const router = require('express').Router();
const ai = require('./ai.features');
const forecast = require('../forecasting/forecast.service');

router.get('/project-health/:projectId', async (req,res)=>{
  const f = await forecast.projectOverrunForecast(req.params.projectId);
  res.json(ai.projectHealth(f));
});

module.exports = router;
