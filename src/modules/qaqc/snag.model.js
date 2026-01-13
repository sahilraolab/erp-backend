const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Snag = sequelize.define('snag', {
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  siteId: { type: DataTypes.INTEGER, allowNull: false },

  referenceType: DataTypes.STRING, // WORK_ORDER, DRAWING, POUR
  referenceId: DataTypes.INTEGER,

  description: DataTypes.TEXT,
  severity: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
    defaultValue: 'LOW'
  },

  status: {
    type: DataTypes.ENUM('OPEN', 'CLOSED'),
    defaultValue: 'OPEN'
  }
});

module.exports = Snag;