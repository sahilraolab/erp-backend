// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// const CostCenter = sequelize.define('cost_center', {
//   name: DataTypes.STRING,
//   code: DataTypes.STRING
// });

// module.exports = CostCenter;

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CostCenter = sequelize.define('cost_center', {
  name: DataTypes.STRING,
  code: DataTypes.STRING
});

module.exports = CostCenter;
