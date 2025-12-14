const sequelize = require('../../config/db');

exports.projectOverrunForecast = async (projectId) => {
  const [rows] = await sequelize.query(`
    SELECT
      SUM(b.amount) budget,
      SUM(vl.debit) actual,
      (SUM(vl.debit) - SUM(b.amount)) variance
    FROM project_budgets b
    LEFT JOIN voucher_lines vl ON vl.cost_centre_id = b.project_id
    WHERE b.project_id = ?
  `, { replacements: [projectId] });

  const r = rows[0] || { budget:0, actual:0, variance:0 };
  return {
    budget: r.budget,
    actual: r.actual,
    variance: r.variance,
    risk: r.variance > 0 ? 'HIGH' : 'LOW'
  };
};
