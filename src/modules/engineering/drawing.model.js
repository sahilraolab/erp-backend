const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Drawing = sequelize.define(
  'drawing',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    drawingNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    discipline: DataTypes.STRING,

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED'),
      defaultValue: 'DRAFT'
    },

    fileName: DataTypes.STRING,
    fileMime: DataTypes.STRING,
    fileSize: DataTypes.INTEGER,
    fileData: DataTypes.BLOB('long')

  },
  {
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'drawingNo']
      }
    ]
  }
);

module.exports = Drawing;
