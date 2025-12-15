const MIS = require('./misSnapshot.model');
const sequelize = require('../../config/db');

exports.generateDailySnapshot = async ({ date, projectId }) => {
  // Example raw aggregations (safe, read-only)
  const [[finance]] = await sequelize.query(`
    SELECT
      SUM(CASE WHEN a.type='EXPENSE' THEN l.debit ELSE 0 END) as expense,
      SUM(CASE WHEN a.type='INCOME' THEN l.credit ELSE 0 END) as income
    FROM voucher_lines l
    JOIN vouchers v ON v.id = l.voucherId AND v.posted=1
    JOIN accounts a ON a.id = l.accountId
  `);

  // const [[stock]] = await sequelize.query(`
  //   SELECT
  //     SUM(CASE WHEN type='IN' THEN value ELSE 0 END) as stockIn,
  //     SUM(CASE WHEN type='OUT' THEN value ELSE 0 END) as stockOut
  //   FROM stock_ledgers
  // `);
  const [[stock]] = await sequelize.query(`
    SELECT
      SUM(qtyIn) as stockIn,
      SUM(qtyOut) as stockOut
    FROM stock_ledgers
  `);


  return MIS.create({
    date,
    projectId,
    role: 'ADMIN',
    totalExpense: finance.expense || 0,
    totalRevenue: finance.income || 0,
    stockIn: stock.stockIn || 0,
    stockOut: stock.stockOut || 0,
    stockValue: (stock.stockIn || 0) - (stock.stockOut || 0)
  });
};
