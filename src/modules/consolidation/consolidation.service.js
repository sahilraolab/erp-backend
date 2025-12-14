const sequelize = require('../../config/db');

exports.consolidatedPL = async (companyIds) => {
  const [rows] = await sequelize.query(`
    SELECT a.type, SUM(vl.debit - vl.credit) amount
    FROM voucher_lines vl
    JOIN vouchers v ON v.id = vl.voucher_id
    JOIN accounts a ON a.id = vl.account_id
    JOIN projects p ON p.id = v.reference_id
    WHERE p.company_id IN (?)
    GROUP BY a.type
  `, { replacements: [companyIds] });
  return rows;
};
