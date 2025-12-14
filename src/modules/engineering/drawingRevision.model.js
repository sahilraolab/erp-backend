const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DrawingRevision = sequelize.define('drawing_revision', {
  drawingId: DataTypes.INTEGER,
  revisionNo: DataTypes.STRING,
  changeNote: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('SUBMITTED', 'APPROVED'),
    defaultValue: 'SUBMITTED'
  }
});

module.exports = DrawingRevision;
