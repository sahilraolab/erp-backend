const sequelize = require('../../config/db');

exports.gstSummary = async (req, res) => {
  const [rows] = await sequelize.query(`
    SELECT
      a.name,
      SUM(l.debit) AS amount
    FROM voucher_lines l
    JOIN accounts a ON a.id = l.accountId
    WHERE a.code IN ('CGST', 'SGST', 'IGST')
    GROUP BY a.name
  `);

  res.json(rows);
};

exports.wctSummary = async (req, res) => {
  const [rows] = await sequelize.query(`
    SELECT
      a.name,
      SUM(l.debit) AS amount
    FROM voucher_lines l
    JOIN accounts a ON a.id = l.accountId
    WHERE a.code = 'WCT'
    GROUP BY a.name
  `);

  res.json(rows);
};
