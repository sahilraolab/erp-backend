const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DrawingRevision = sequelize.define('drawing_revision', {
  drawingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  revisionNo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  changeNote: DataTypes.TEXT,

  status: {
    type: DataTypes.ENUM('SUBMITTED', 'APPROVED'),
    defaultValue: 'SUBMITTED'
  },

  fileName: DataTypes.STRING,
  fileMime: DataTypes.STRING,
  fileSize: DataTypes.INTEGER,
  fileData: DataTypes.BLOB('long')

});

module.exports = DrawingRevision;
