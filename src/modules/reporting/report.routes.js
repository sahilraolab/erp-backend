const router = require('express').Router();
const engine = require('./report.engine');
const fs = require('fs');
const path = require('path');

router.get('/:name', async (req,res)=>{
  const tpl = JSON.parse(
    fs.readFileSync(path.join(__dirname,'templates',`${req.params.name}.json`))
  );
  res.json(await engine.run(tpl));
});

module.exports = router;
