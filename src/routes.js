// module.exports = (app) => {
//   app.use('/admin', require('./modules/admin/admin.routes'));
//   app.use('/masters', require('./modules/masters/masters.routes'));
//   app.use('/purchase', require('./modules/purchase/purchase.routes'));
//   app.use('/inventory', require('./modules/inventory/inventory.routes'));
//   app.use('/accounts', require('./modules/accounts/accounts.routes'));
//   app.use('/contracts', require('./modules/contracts/contracts.routes'));
//   app.use('/engineering', require('./modules/engineering/engineering.routes'));
//   app.use('/site', require('./modules/site/site.routes'));
//   app.use('/qaqc', require('./modules/qaqc/qaqc.routes'));
//   app.use('/dashboard', require('./modules/dashboard/dashboard.routes'));
//   app.use('/analytics', require('./modules/analytics/analytics.routes'));
//   app.use('/automation', require('./modules/automation/automation.routes'));
//   app.use('/finance', require('./modules/finance/finance.routes'));
//   app.use('/consolidation', require('./modules/consolidation/consolidation.routes'));
//   app.use('/forecast', require('./modules/forecasting/forecast.routes'));
//   app.use('/reports', require('./modules/reporting/report.routes'));
//   app.use('/ai', require('./modules/ai/ai.routes'));
// };

module.exports = (app) => {
  app.use('/admin', require('./modules/admin/admin.routes'));
  app.use('/masters', require('./modules/masters/masters.routes'));
  app.use('/purchase', require('./modules/purchase/purchase.routes'));
  app.use('/inventory', require('./modules/inventory/inventory.routes'));
  app.use('/site', require('./modules/site/site.routes'));
  app.use('/engineering', require('./modules/engineering/engineering.routes'));
  app.use('/contracts', require('./modules/contracts/contracts.routes'));
  app.use('/accounts', require('./modules/accounts/accounts.routes'));
  app.use('/accounts/reports', require('./modules/accounts/report.routes'));
  app.use('/qaqc', require('./modules/qaqc/qaqc.routes'));
  app.use('/workflow', require('./modules/workflow/workflow.routes'));
  app.use('/mis', require('./modules/mis/mis.routes')); 
  app.use('/tax', require('./modules/tax/tax.routes'));
  app.use('/statutory', require('./modules/statutory/statutory.routes'));


};
