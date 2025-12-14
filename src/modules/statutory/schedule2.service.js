const sequelize = require('../../config/db');

exports.balanceSheetSchedule = async ({ from, to }) => {
  const [rows] = await sequelize.query(`
    SELECT
      m.scheduleHead,
      SUM(l.debit - l.credit) as amount
    FROM voucher_lines l
    JOIN vouchers v ON v.id = l.voucherId
    JOIN account_schedule_maps m ON m.accountId = l.accountId
    WHERE v.posted = 1
      AND v.date <= :to
    GROUP BY m.scheduleHead
  `, { replacements: { to } });

  return rows;
};
