// const sequelize = require('../../config/db');

// exports.consolidatedPL = async (companyIds) => {
//   const [rows] = await sequelize.query(`
//     SELECT a.type, SUM(vl.debit - vl.credit) amount
//     FROM voucher_lines vl
//     JOIN vouchers v ON v.id = vl.voucher_id
//     JOIN accounts a ON a.id = vl.account_id
//     JOIN projects p ON p.id = v.reference_id
//     WHERE p.company_id IN (?)
//     GROUP BY a.type
//   `, { replacements: [companyIds] });
//   return rows;
// };

const sequelize = require('../../config/db');

exports.consolidatedPL = async ({ companyIds, from, to }) => {
  const [rows] = await sequelize.query(`
    SELECT
      a.name,
      SUM(l.debit - l.credit) as amount
    FROM voucher_lines l
    JOIN vouchers v ON v.id = l.voucherId
    JOIN accounts a ON a.id = l.accountId
    WHERE v.companyId IN (:companyIds)
      AND v.posted = 1
      AND v.date BETWEEN :from AND :to
    GROUP BY a.name
  `, {
    replacements: { companyIds, from, to }
  });

  return rows;
};


// AND a.type NOT IN ('INTER_COMPANY_PAYABLE','INTER_COMPANY_RECEIVABLE')