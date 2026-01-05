const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Muster = sequelize.define('muster', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  date: DataTypes.DATEONLY,
  labourCount: DataTypes.INTEGER
}, {
  indexes: [
    { unique: true, fields: ['siteId', 'date'] }
  ]
});

module.exports = Muster;
