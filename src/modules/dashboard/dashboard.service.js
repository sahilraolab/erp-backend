const sequelize = require('../../config/db');

exports.projectSummary = async () => {
  const [result] = await sequelize.query(`
    SELECT p.id, p.name,
    SUM(sl.qty_in - sl.qty_out) stock
    FROM projects p
    LEFT JOIN stock_ledgers sl ON sl.project_id = p.id
    GROUP BY p.id
  `);
  return result;
};
