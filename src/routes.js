// src/routes.js

module.exports = (app) => {



  /* ================= PUBLIC ROUTES ================= */

  // Auth (login, refresh, forgot password, etc.)
  app.use('/auth', require('./modules/auth/auth.routes'));

  /* ================= CORE / ADMIN ================= */

  app.use('/admin', require('./modules/admin/admin.routes'));
  app.use('/masters', require('./modules/masters/masters.routes'));

  /* ================= ENGINEERING & OPERATIONS ================= */

  app.use('/engineering', require('./modules/engineering/engineering.routes'));
  app.use('/purchase', require('./modules/purchase/purchase.routes'));
  app.use('/supplier', require('./modules/supplier/supplier.routes'));
  app.use('/inventory', require('./modules/inventory/inventory.routes'));
  app.use('/site', require('./modules/site/site.routes'));
  // app.use('/qaqc', require('./modules/qaqc/qaqc.routes'));

  /* ================= CONTRACTS ================= */

  app.use('/contracts', require('./modules/contracts/contracts.routes'));

  /* ================= FINANCE ================= */

  app.use('/accounts', require('./modules/accounts/accounts.routes'));
  app.use('/accounts/reports', require('./modules/accounts/report.routes'));
  app.use('/tax', require('./modules/tax/tax.routes'));
  app.use('/statutory', require('./modules/statutory/statutory.routes'));

  /* ================= AUTOMATION & AI ================= */

  app.use('/workflow', require('./modules/workflow/workflow.routes'));

  /* ================= GLOBAL ERROR HANDLER ================= */

  app.use(require('./core/error.handler'));
};
