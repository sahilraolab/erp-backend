const sequelize = require('../../config/db');

exports.costVsBudget = async (projectId) => {
  const [rows] = await sequelize.query(`
    SELECT 
      b.cost_head,
      b.amount AS budget,
      IFNULL(SUM(vl.debit),0) AS actual
    FROM project_budgets b
    LEFT JOIN voucher_lines vl ON vl.cost_centre_id = b.project_id
    WHERE b.project_id = ?
    GROUP BY b.cost_head
  `, { replacements: [projectId] });

  return rows;
};

exports.vendorPerformance = async () => {
  const [rows] = await sequelize.query(`
    SELECT s.name,
    COUNT(pb.id) bills,
    SUM(pb.total) value
    FROM suppliers s
    JOIN purchase_bills pb ON pb.supplier_id = s.id
    GROUP BY s.id
  `);
  return rows;
};
