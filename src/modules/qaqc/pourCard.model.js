const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PourCard = sequelize.define('pour_card', {
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  siteId: { type: DataTypes.INTEGER, allowNull: false },
  rmcBatchId: { type: DataTypes.INTEGER },

  pourLocation: DataTypes.STRING,
  scheduledAt: DataTypes.DATE,

  status: {
    type: DataTypes.ENUM('REQUESTED', 'APPROVED', 'REJECTED'),
    defaultValue: 'REQUESTED'
  }
});

module.exports = PourCard;