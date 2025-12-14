// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('BBS', {
//   projectId: DataTypes.INTEGER,
//   name: DataTypes.STRING,
//   parentId: DataTypes.INTEGER,
// });


const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const BBS = sequelize.define('bbs', {
  projectId: DataTypes.INTEGER,
  code: DataTypes.STRING,
  description: DataTypes.STRING,
  budgetAmount: DataTypes.FLOAT
});

module.exports = BBS;
