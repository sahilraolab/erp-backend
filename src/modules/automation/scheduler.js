const cron = require('node-cron');
const { escalatePending } = require('./escalation.service');
const misService = require('../modules/mis/mis.service');

cron.schedule('0 */6 * * *', async () => {
  await escalatePending();
});

await misService.generateDailySnapshot({
  date: new Date().toISOString().slice(0, 10),
  projectId: 1
});
