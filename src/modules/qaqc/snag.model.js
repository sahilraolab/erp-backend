// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('Snag', {
//   projectId: DataTypes.INTEGER,
//   description: DataTypes.TEXT,
//   status: DataTypes.STRING,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Snag = sequelize.define('snag', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  reportedBy: DataTypes.INTEGER,
  assignedTo: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('OPEN', 'CLOSED'),
    defaultValue: 'OPEN'
  }
});

module.exports = Snag;
