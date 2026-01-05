const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Site = sequelize.define('site', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Site.beforeValidate(async (site) => {
  if (!site.code) {
    site.code = `SITE-${Date.now()}`;
  }
});

module.exports = Site;
