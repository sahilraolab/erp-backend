const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Drawing = sequelize.define('drawing', {
  projectId: DataTypes.INTEGER,
  title: DataTypes.STRING,
  drawingNo: DataTypes.STRING,
  discipline: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = Drawing;
