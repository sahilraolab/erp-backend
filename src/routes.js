module.exports = (app) => {
  // Auth (login, forgot/reset password, me)
  app.use('/auth', require('./modules/auth/auth.routes'));

  // Admin & RBAC
  app.use('/admin', require('./modules/admin/admin.routes'));

  // Masters
  app.use('/masters', require('./modules/masters/masters.routes'));

  // Core Business Modules
  app.use('/engineering', require('./modules/engineering/engineering.routes'));
  app.use('/purchase', require('./modules/purchase/purchase.routes'));
  app.use('/inventory', require('./modules/inventory/inventory.routes'));
  app.use('/site', require('./modules/site/site.routes'));
  app.use('/contracts', require('./modules/contracts/contracts.routes'));
  app.use('/accounts', require('./modules/accounts/accounts.routes'));

  // Accounts Reports (kept separate intentionally)
  app.use('/accounts/reports', require('./modules/accounts/report.routes'));

  // Workflow Engine
  app.use('/workflow', require('./modules/workflow/workflow.routes'));

  // MIS / Analytics
  app.use('/mis', require('./modules/mis/mis.routes'));

  // Tax & Statutory
  app.use('/tax', require('./modules/tax/tax.routes'));
  app.use('/statutory', require('./modules/statutory/statutory.routes'));

  // Consolidation
  app.use('/consolidation', require('./modules/consolidation/consolidation.routes'));

  // Optional / Supporting
  app.use('/qaqc', require('./modules/qaqc/qaqc.routes'));
  app.use('/ai', require('./modules/ai/ai.routes'));
};
