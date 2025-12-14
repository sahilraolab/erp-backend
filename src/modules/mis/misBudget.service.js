const sequelize = require('../../config/db');
const MISBudget = require('./misBudgetSnapshot.model');

exports.generateBudgetVsActual = async ({ projectId, date }) => {
  const [rows] = await sequelize.query(`
    SELECT
      b.id as budgetHeadId,
      b.amount as budgetAmount,
      IFNULL(SUM(l.debit),0) as actualAmount
    FROM budgets b
    LEFT JOIN budget_account_maps bam ON bam.budgetHeadId = b.id
    LEFT JOIN voucher_lines l ON l.accountId = bam.accountId
    LEFT JOIN vouchers v ON v.id = l.voucherId AND v.posted = 1
    WHERE b.projectId = :projectId
    GROUP BY b.id
  `, {
    replacements: { projectId }
  });

  for (const r of rows) {
    await MISBudget.create({
      date,
      projectId,
      budgetHeadId: r.budgetHeadId,
      budgetAmount: r.budgetAmount,
      actualAmount: r.actualAmount,
      variance: r.budgetAmount - r.actualAmount
    });
  }
};


await generateBudgetVsActual({
  projectId: 1,
  date: today
});
