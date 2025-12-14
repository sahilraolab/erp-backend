const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || null,
  {
    dialect: 'mysql',
    dialectOptions: {
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    },
    logging: false
  }
);

module.exports = sequelize;
