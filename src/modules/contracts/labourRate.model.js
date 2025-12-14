const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const LabourRate = sequelize.define('labour_rate', {
  contractorId: DataTypes.INTEGER,
  labourType: DataTypes.STRING,
  ratePerDay: DataTypes.FLOAT
});

module.exports = LabourRate;
