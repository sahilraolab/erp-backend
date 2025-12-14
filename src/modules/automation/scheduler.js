const cron = require('node-cron');
const { escalatePending } = require('./escalation.service');

cron.schedule('0 */6 * * *', async () => {
  await escalatePending();
});
