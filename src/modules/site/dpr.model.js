const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DPR = sequelize.define('dpr', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  date: DataTypes.DATEONLY,
  remarks: DataTypes.TEXT
}, {
  indexes: [
    { unique: true, fields: ['siteId', 'date'] }
  ]
});

module.exports = DPR;
