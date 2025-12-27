const sequelize = require('../config/db');

module.exports = async function generateCode(prefix, tableName, pad = 4) {
  const [result] = await sequelize.query(`
    SELECT COUNT(*) AS count FROM ${tableName}
  `);

  const count = Number(result[0].count) + 1;
  return `${prefix}-${String(count).padStart(pad, '0')}`;
};
