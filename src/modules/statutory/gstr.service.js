const sequelize = require('../../config/db');

exports.gstr1Summary = async ({ from, to }) => {
  const [rows] = await sequelize.query(`
    SELECT
      a.name as taxType,
      SUM(l.credit) as taxAmount
    FROM voucher_lines l
    JOIN vouchers v ON v.id = l.voucherId
    JOIN accounts a ON a.id = l.accountId
    WHERE v.posted = 1
      AND v.date BETWEEN :from AND :to
      AND a.code IN ('OUTPUT_CGST','OUTPUT_SGST','OUTPUT_IGST')
    GROUP BY a.name
  `, { replacements: { from, to } });

  return rows;
};

exports.inputCreditSummary = async ({ from, to }) => {
  return sequelize.query(`
    SELECT
      a.name,
      SUM(l.debit) as inputCredit
    FROM voucher_lines l
    JOIN vouchers v ON v.id = l.voucherId
    JOIN accounts a ON a.id = l.accountId
    WHERE v.posted = 1
      AND a.type IN ('INPUT_CGST','INPUT_SGST','INPUT_IGST')
      AND v.date BETWEEN :from AND :to
    GROUP BY a.name
  `);
};
