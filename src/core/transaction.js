const sequelize = require('../config/db');

module.exports = async (callback) => {
  return sequelize.transaction(async (t) => callback(t));
};
