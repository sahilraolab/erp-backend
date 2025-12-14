const sequelize = require('../../config/db');

exports.run = async (template) => {
  const [rows] = await sequelize.query(template.query);
  return rows;
};
