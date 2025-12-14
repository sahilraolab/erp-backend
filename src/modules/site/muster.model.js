// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('MusterRoll', {
//   projectId: DataTypes.INTEGER,
//   labourType: DataTypes.STRING,
//   count: DataTypes.INTEGER,
//   date: DataTypes.DATEONLY,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Muster = sequelize.define('muster', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  date: DataTypes.DATEONLY,
  labourCount: DataTypes.INTEGER
});

module.exports = Muster;
