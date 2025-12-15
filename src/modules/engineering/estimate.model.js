// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('Estimate', {
//   projectId: DataTypes.INTEGER,
//   version: DataTypes.STRING,
//   total: DataTypes.DECIMAL,
//   status: DataTypes.STRING,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Estimate = sequelize.define('estimate', {
  projectId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  baseAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = Estimate;
