// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('WPR', {
//   projectId: DataTypes.INTEGER,
//   weekStart: DataTypes.DATE,
//   weekEnd: DataTypes.DATE,
//   progressPercent: DataTypes.DECIMAL,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WPR = sequelize.define('wpr', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  weekStart: DataTypes.DATE,
  weekEnd: DataTypes.DATE,
  summary: DataTypes.TEXT
});

module.exports = WPR;
