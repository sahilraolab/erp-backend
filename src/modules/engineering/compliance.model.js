const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Compliance = sequelize.define('compliance', {
  projectId: DataTypes.INTEGER,
  type: DataTypes.STRING,
  documentRef: DataTypes.STRING,
  validTill: DataTypes.DATE
});

module.exports = Compliance;
