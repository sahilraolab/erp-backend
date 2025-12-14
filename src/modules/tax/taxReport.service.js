exports.gstSummary = async ({ from, to }) => {
  return sequelize.query(`
    SELECT
      a.name,
      SUM(l.debit) as amount
    FROM voucher_lines l
    JOIN accounts a ON a.id = l.accountId
    WHERE a.type IN ('CGST', 'SGST', 'IGST')
    GROUP BY a.name
  `);
};
