const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Requisition = sequelize.define('requisition', {
  reqNo: { type: DataTypes.STRING, unique: true },
  projectId: DataTypes.INTEGER,
  requestedBy: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = Requisition;
